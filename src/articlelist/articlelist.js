const {mgrPlugins} = require('../../plugins/articlelist/index');
const {
  saveMessage,
  newArticleList,
  attachJQuery,
  attachJarvisCrawlerCore,
} = require('../utils');

/**
 * export article to a pdf file or a jpg file.
 * @param {object} browser - browser
 * @param {string} url - URL
 * @param {string} outputfile - output file
 * @param {bool} jquery - jquery
 * @param {bool} debugmode - debugmode
 */
async function getArticleList(browser, url, outputfile, jquery, debugmode) {
  const mapResponse = {};

  const page = await browser.newPage();
  await page.setBypassCSP(true);

  page.on('response', async (response) => {
    if (!response) {
      return;
    }

    const status = response.status();
    if (status >= 300 && status <= 399) {
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

  // console.log('goto end');

  //   await page.close();

  await attachJQuery(page);
  await attachJarvisCrawlerCore(page);
  // if (jquery) {
  //   await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
  // }

  // await page.addScriptTag({path: './browser/utils.js'});

  // console.log('getArticles');

  const ret = await mgrPlugins.getArticles(url, page);
  if (ret) {
    const result = newArticleList(ret);

    if (outputfile &&
      typeof(outputfile) == 'string' &&
      outputfile.length > 0) {
      saveMessage(outputfile, result);
    }

    if (!debugmode) {
      await page.close();
    }

    return result;
  }

  if (!debugmode) {
    await page.close();
  }

  return undefined;
}

exports.getArticleList = getArticleList;
