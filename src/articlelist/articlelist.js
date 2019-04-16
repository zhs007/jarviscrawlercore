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
 * @return {ArticleList} result - ArticleList
 * @return {error} err - error
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
    const headers = response.headers();
    if (headers && headers['content-type'] &&
          headers['content-type'].indexOf('image') == 0) {
      mapResponse[url] = await response.buffer();
    }
  });

  await page.goto(url,
      {
        waitUntil: 'domcontentloaded',
        timeout: 0,
      }).catch((err) => {
    console.log('page.goto', url, err);
  });

  await attachJQuery(page);
  await attachJarvisCrawlerCore(page);

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

    return {
      result: result,
      err: undefined,
    };
  }

  if (!debugmode) {
    await page.close();
  }

  return {
    result: undefined,
    err: undefined,
  };
}

exports.getArticleList = getArticleList;
