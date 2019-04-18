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
  await page.goto('https://translate.google.cn/#view=home&op=translate&sl=' +
    srclang + '&tl=' + destlang + '&text=');

  // await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  await attachJQuery(page);
  await page.waitForSelector('.tlid-input.input');
  await page.type('.tlid-input.input', srctext);

  await page.waitForFunction('$(\'.tlid-translation.translation\').length > 0 && $(\'.tlid-translation.translation\')[0].innerText != \'\'').catch((err) => {
    console.log('zhihu.article.formatArticle', err);
  });
  //   await page.waitForSelector('.tlid-results-container.results-container');
  const desttext = await page.evaluate(()=>{
    const ret = $('.tlid-translation.translation');
    if (ret && ret.length > 0) {
      return ret[0].innerText;
    }

    return '';
  }).catch((err) => {
    console.log('googletranslate.evaluate', err);
  });

  await page.close();

  return desttext;
}

exports.googletranslate = googletranslate;
