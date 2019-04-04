const puppeteer = require('puppeteer');

/**
 * google translate
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {bool} headless - headless modes
 */
async function googletranslate(srctext, srclang, destlang, headless) {
  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.goto('https://translate.google.cn/#view=home&op=translate&sl=' + srclang + '&tl=' + destlang + '&text=');
  await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
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
  });

  console.log(desttext);

  //   await page.type('#os_password', cfg.password);
  //   await page.click('#loginButton');

  //   await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
  //     console.log('catch a err ', err);
  //   });

  //   await runActions(page, cfg);

  await browser.close();
}

exports.googletranslate = googletranslate;
