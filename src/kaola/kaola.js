const {
  attachJQuery,
  attachJarvisCrawlerCore,
} = require('../utils');

/**
 * kaola
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {bool} headless - headless modes
 */
async function kaola(browser, srctext, srclang, destlang) {
  const page = await browser.newPage();
  await page.goto('https://www.kaola.com/');

  await attachJQuery(page);
  await attachJarvisCrawlerCore(page);
  // await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  // await page.addScriptTag({path: './browser/utils.js'});

  await page.evaluate(() => {
    const jrxsg = getElementWithText('.toplevel', '今日限时购');
    if (jrxsg) {
      // 增加class，方便一次定位
      // Increase class for easy positioning
      jrxsg.className = 'toplevel jrxsg';
      // 取消新窗口打开
      // Cancel new window open
      jrxsg.removeAttribute('target');
    }
  });

  await page.click('.toplevel.jrxsg');
}

exports.kaola = kaola;
