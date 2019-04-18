const {
  loadConfig,
  checkConfig,
} = require('./cfg');
const {
  getGameTodayDataSummary,
  onRightFrameLoadedGTDS,
} = require('./gametodaydata');
const {
  getGameDataReport,
  onRightFrameLoadedGDR,
} = require('./gamedatareport');
const {
  attachJQuery,
  attachJarvisCrawlerCore,
} = require('../utils');

const MODE_GAMETODAYDATA = 'gametodaydata';
const MODE_GAMEDATAREPORT = 'gamedatareport';

/**
 * a bot for dtbk
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {bool} debugmode - debug modes
 * @param {string} mode - modes
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 */
async function dtbkbot(browser, cfgfile, debugmode, mode, starttime, endtime) {
  const cfg = loadConfig(cfgfile);
  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    console.log('config file error: ' + cfgerr);

    return;
  }

  const page = await browser.newPage();
  await page.goto(cfg.url);

  // 等待登录加载完成
  await page.waitForSelector('.loginbox');
  // 登录
  await page.type('.loginuser', cfg.username);
  await page.type('.loginpwd', cfg.password);
  await page.click('.loginbtn');

  // 等待页面跳转完成
  await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
    console.log('catch a err ', err);
  });

  // 处理frames
  const leftFrame = page.frames().find((frame) => {
    return frame.name() === 'leftFrame';
  });
  const rightFrame = page.frames().find((frame) => {
    return frame.name() === 'rightFrame';
  });

  if (leftFrame && rightFrame) {
    page.on('framenavigated', async (frame) => {
      if (frame.name() === 'rightFrame') {
        console.log(frame.url());

        await attachJQuery(frame);
        await attachJarvisCrawlerCore(frame);

        if (mode == MODE_GAMETODAYDATA) {
          await onRightFrameLoadedGTDS(frame);
        } else if (mode == MODE_GAMEDATAREPORT) {
          await onRightFrameLoadedGDR(frame);
        }
      }
    });

    await attachJQuery(leftFrame);
    await attachJarvisCrawlerCore(leftFrame);

    // 标记需要的菜单元素
    await leftFrame.evaluate(()=>{
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
        const yxjl = getElementChildWithTagAndText(lstmenuson[i], 'A', '游戏记录');
        if (yxjl) {
          yxjl.className = 'yxjl';
          lstmenuson[i].className = 'menuson jlxx';
        }

        const yxbb = getElementChildWithTagAndText(lstmenuson[i], 'A', '游戏报表');
        if (yxbb) {
          yxbb.className = 'yxbb';
          lstmenuson[i].className = 'menuson bbtj';
        }
      }
    }).catch((err) => {
      console.log('dtbkbot:leftFrame.evaluate', err);
    });

    if (mode == MODE_GAMETODAYDATA) {
      await getGameTodayDataSummary(page, leftFrame, rightFrame);
    } else if (mode == MODE_GAMEDATAREPORT) {
      await getGameDataReport(page, leftFrame, rightFrame, starttime, endtime);
    }
  }

  if (!debugmode) {
    await page.close();
  }
}

exports.dtbkbot = dtbkbot;
