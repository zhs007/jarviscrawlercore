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

/**
 * a bot for dtbk
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {bool} debugmode - debug modes
 */
async function dtbkbot(browser, cfgfile, debugmode) {
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
        await attachJQuery(frame);
        await attachJarvisCrawlerCore(frame);

        await onRightFrameLoadedGTDS(frame);
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

    await getGameTodayDataSummary(page, leftFrame, rightFrame);

    await getGameDataReport(page, leftFrame, rightFrame);
  }

  if (!debugmode) {
    await page.close();
  }
}

exports.dtbkbot = dtbkbot;
