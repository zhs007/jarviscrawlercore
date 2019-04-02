const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.lieyunwang.com/archives/') == 0) {
    return true;
  }

  return false;
}

/**
 * ismine
 * @param {string} url - URL
 * @param {object} page -
 */
async function proc(url, page) {
  await page.waitForNavigation({waitUntil: 'networkidle0'}).catch((err) => {
    console.log('catch a err ', err);
  });

  const dom = await page.$eval(
      '.article-main',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);
}

/**
 * formatArticle
 * @param {object} page - page
 * @return {ExportArticleResult} result - result
 */
async function formatArticle(page) {
  return undefined;
}

mgrPlugins.regPlugin('lieyunwang.article', ismine, proc, formatArticle);
