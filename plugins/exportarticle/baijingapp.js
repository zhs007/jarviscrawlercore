const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('http://www.baijingapp.com/article/') == 0) {
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
  const dom = await page.$eval(
      '.aw-mod.aw-question-detail',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

  await formatArticle(page);
}

/**
 * formatArticle
 * @param {object} page - page
 */
async function formatArticle(page) {
  await page.$$eval(
      '.aw-mod.aw-question-detail',
      (elements) => {

      });
}

mgrPlugins.regPlugin('baijingapp.article', ismine, proc);
