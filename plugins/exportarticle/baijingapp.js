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
      '.col-sm-8.col-md-8.aw-main-content.aw-article-content',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);
}

mgrPlugins.regPlugin('baijingapp.article', ismine, proc);
