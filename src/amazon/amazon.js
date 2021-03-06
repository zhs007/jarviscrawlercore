const {attachJQuery, attachJarvisCrawlerCore} = require('../utils');
const log = require('../log');

/**
 * amazon
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {bool} headless - headless modes
 */
async function amazoncn(browser, srctext, srclang, destlang) {
  const page = await browser.newPage();
  await page.goto('https://www.amazon.cn');

  await attachJQuery(page);
  await attachJarvisCrawlerCore(page);
  // await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  // await page.addScriptTag({path: './browser/utils.js'});

  await page
      .evaluate(() => {
        const zms = getElementWithText('.nav-a', 'Z秒杀');
        if (zms) {
        // 增加class，方便一次定位
        // Increase class for easy positioning
          zms.className = 'nav-a zms';
        }
      })
      .catch((err) => {
        log.error('amazoncn.evaluate', err);
      });

  await page.click('.nav-a.zms');

  //   const lst = await page.$$('.nav-a.zms');
  //   for (let i = 0; i < lst.length; ++i) {
  //     consoles.log(lst[i]);
  //   }

  //   await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  //   await page.waitForSelector('.tlid-input.input');
  //   await page.type('.tlid-input.input', srctext);

  //   await page.waitForFunction('$(\'.tlid-translation.translation\').length > 0 && $(\'.tlid-translation.translation\')[0].innerText != \'\'').catch((err) => {
  //     log.error('zhihu.article.formatArticle', err);
  //   });
  //   //   await page.waitForSelector('.tlid-results-container.results-container');
  //   const desttext = await page.evaluate(()=>{
  //     const ret = $('.tlid-translation.translation');
  //     if (ret && ret.length > 0) {
  //       return ret[0].innerText;
  //     }

  //     return '';
  //   });

  //   await page.close();

  //   return desttext;
}

exports.amazoncn = amazoncn;
