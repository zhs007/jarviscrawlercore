const {attachJQuery} = require('../utils');

/**
 * google translate
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {bool} headless - headless modes
 */
async function googletranslate(browser, srctext, srclang, destlang) {
  const page = await browser.newPage();
  await page
      .goto(
          'https://translate.google.cn/#view=home&op=translate&sl=' +
        srclang +
        '&tl=' +
        destlang +
        '&text='
      )
      .catch((err) => {
        console.log('googletranslate.goto', err);
      });

  // await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  await attachJQuery(page);
  await page.waitForSelector('.tlid-input.input').catch((err) => {
    console.log('googletranslate.waitForSelector', err);
  });
  await page.type('.tlid-input.input', srctext).catch((err) => {
    console.log('googletranslate.type', err);
  });

  await page
      .waitForFunction(
          '$(\'.tlid-translation.translation\').length > 0 && $(\'.tlid-translation.translation\')[0].innerText != \'\''
      )
      .catch((err) => {
        console.log('googletranslate.waitForFunction', err);
      });
  //   await page.waitForSelector('.tlid-results-container.results-container');
  const desttext = await page
      .evaluate(() => {
        const ret = $('.tlid-translation.translation');
        if (ret && ret.length > 0) {
          return ret[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        console.log('googletranslate.evaluate', err);
      });

  await page.close();

  return desttext;
}

exports.googletranslate = googletranslate;
