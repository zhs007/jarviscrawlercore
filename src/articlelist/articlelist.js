const {mgrPlugins} = require('../../plugins/articlelist/index');
const {
  saveMessage,
  setImageInfo,
  getImageHashName,
  newExportArticleResult,
} = require('../utils');

/**
 * export article to a pdf file or a jpg file.
 * @param {object} browser - browser
 * @param {string} url - URL
 * @param {string} outputfile - output file
 * @param {bool} jquery - jquery
 */
async function getArticleList(browser, url, outputfile, jquery) {
  const mapResponse = {};

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  page.on('response', async (response) => {
    if (!response) {
      return;
    }

    const url = response.url();
    // console.log(url);
    const headers = response.headers();
    if (headers && headers['content-type'] &&
          headers['content-type'].indexOf('image') == 0) {
      mapResponse[url] = await response.buffer();
    }
  });

  await page.goto(url,
      {
        waitUntil: 'domcontentloaded',
        // waitUntil: 'networkidle2',
        timeout: 0,
      }).catch((err) => {
    console.log('page.goto', url, err);
  });

  //   await page.close();

  if (jquery) {
    await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  }

  await page.addScriptTag({path: './browser/utils.js'});

  const ret = await mgrPlugins.getArticles(url, page);

  //   await page.close();

  return undefined;
}

exports.getArticleList = getArticleList;
