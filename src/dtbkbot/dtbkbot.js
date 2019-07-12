const {loadConfig, checkConfig, getEnvConfig} = require('./cfg');
const {
  getGameTodayDataSummary,
  onRightFrameLoadedGTDS,
} = require('./gametodaydata');
const {
  getGameDataReport,
  onRightFrameLoadedGDR,
} = require('./gamedatareport');
const {
  onRightFrameLoadedGPKCGR,
  checkGPKGameResult,
} = require('./gpkcheckgameresult');
const {attachJQuery, attachJarvisCrawlerCore} = require('../utils');
const {WaitRightFrame} = require('./utils');
const messages = require('../../proto/result_pb');

/**
 * a bot for dtbk
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {bool} debugmode - debug modes
 * @param {string} envName - name for environment
 * @param {DTDataType} dtDataType - dtDataType
 * @param {string} businessid - businessid
 * @param {string} gamecode - gamecode
 * @param {string} playername - playername
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 * @return {object} result - {error: err, ret: ret}
 */
async function dtbkbot(
    browser,
    cfgfile,
    debugmode,
    envName,
    dtDataType,
    businessid,
    gamecode,
    playername,
    starttime,
    endtime
) {
  let ret = undefined;

  const cfg = loadConfig(cfgfile);
  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    const errstr = 'config file error: ' + cfgerr;
    console.log(errstr);

    return {error: errstr};
  }

  const envcfg = getEnvConfig(cfg, envName);
  if (!envcfg) {
    const errstr = 'no envName ' + envName;
    console.log(errstr);

    return {error: errstr};
  }

  const page = await browser.newPage();
  page.on('console', (msg) => {
    console.log('PAGE LOG:', msg.text());
  });

  await page
      .setViewport({
        width: 1920,
        height: 920,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        console.log('dtbkbot.setViewport', err);
      });

  await page.goto(envcfg.url).catch((err) => {
    console.log('dtbkbot.goto', err);
  });

  // 等待登录加载完成
  await page
      .waitForFunction(() => {
        const objs = document.getElementsByClassName('loginbox');
        if (objs.length > 0) {
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.log('dtbkbot.waitForFunction.loginbox', err);
      });

  // 登录
  await page.type('.loginuser', envcfg.username);
  await page.type('.loginpwd', envcfg.password);
  await page.click('.loginbtn');

  // 等待页面跳转完成
  await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
    console.log('catch a err ', err);
  });

  // 处理frames
  const topFrame = await page.frames().find((frame) => {
    return frame.name() === 'topFrame';
  });
  const leftFrame = await page.frames().find((frame) => {
    return frame.name() === 'leftFrame';
  });
  const rightFrame = await page.frames().find((frame) => {
    return frame.name() === 'rightFrame';
  });

  if (topFrame) {
    topFrame.$eval('.user', (ele) => {
      ele.children[0].children[1].className = 'logoutbtn';
    });
  }

  if (leftFrame && rightFrame) {
    const waitRightFrame = new WaitRightFrame(page);

    page.on('framenavigated', async (frame) => {
      if (frame.name() === 'rightFrame') {
        console.log(frame.url());

        await attachJQuery(frame);
        await attachJarvisCrawlerCore(frame);

        if (dtDataType == messages.DTDataType.DT_DT_TODAYGAMEDATA) {
          await onRightFrameLoadedGTDS(frame);
        } else if (dtDataType == messages.DTDataType.DT_DT_BUSINESSGAMEREPORT) {
          await onRightFrameLoadedGDR(frame);
        } else if (dtDataType == messages.DTDataType.DT_DT_GPKCHECKGAMERESULT) {
          await onRightFrameLoadedGPKCGR(frame);
        }
      }
    });

    await attachJQuery(leftFrame);
    await attachJarvisCrawlerCore(leftFrame);

    // 标记需要的菜单元素
    await leftFrame
        .evaluate(() => {
          const jlxx = getElementWithText('.title', '记录信息');
          if (jlxx) {
            jlxx.className = 'title jlxx';
          }

          const bbtj = getElementWithText('.title', '报表统计');
          if (jlxx) {
            bbtj.className = 'title bbtj';
          }

          const lstmenuson = $('.menuson');
          for (let i = 0; i < lstmenuson.length; ++i) {
            const yxjl = getElementChildWithTagAndText(
                lstmenuson[i],
                'A',
                '游戏记录'
            );
            if (yxjl) {
              yxjl.className = 'yxjl';
              lstmenuson[i].className = 'menuson jlxx';
            }

            const gpkyxjl = getElementChildWithTagAndText(
                lstmenuson[i],
                'A',
                'GPK游戏记录'
            );
            if (gpkyxjl) {
              gpkyxjl.className = 'gpkyxjl';
            }

            const yxbb = getElementChildWithTagAndText(
                lstmenuson[i],
                'A',
                '游戏报表'
            );
            if (yxbb) {
              yxbb.className = 'yxbb';
              lstmenuson[i].className = 'menuson bbtj';
            }
          }
        })
        .catch((err) => {
          console.log('dtbkbot:leftFrame.evaluate', err);
        });

    if (dtDataType == messages.DTDataType.DT_DT_TODAYGAMEDATA) {
      ret = await getGameTodayDataSummary(page, leftFrame, rightFrame);
    } else if (dtDataType == messages.DTDataType.DT_DT_BUSINESSGAMEREPORT) {
      ret = await getGameDataReport(
          page,
          leftFrame,
          rightFrame,
          starttime,
          endtime
      );
    } else if (dtDataType == messages.DTDataType.DT_DT_GPKCHECKGAMERESULT) {
      ret = await checkGPKGameResult(
          page,
          leftFrame,
          rightFrame,
          waitRightFrame,
          businessid,
          gamecode,
          playername,
          starttime,
          endtime
      );
    }
  }

  if (!debugmode) {
    if (topFrame) {
      await topFrame.click('.logoutbtn');

      // 等待登录加载完成
      await page
          .waitForFunction(() => {
            const objs = document.getElementsByClassName('loginbox');
            if (objs.length > 0) {
              return true;
            }

            return false;
          })
          .catch((err) => {
            console.log('dtbkbot.logout.waitForFunction.loginbox', err);
          });
    }

    await page.close();
  }

  return ret;
}

exports.dtbkbot = dtbkbot;
