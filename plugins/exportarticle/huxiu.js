const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.huxiu.com/article/') == 0) {
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
      '.article-wrap',
      (element) => {
        return element.innerHTML;
      });

  //   console.log('geekpark.article');
  //   console.log(dom.length);

  await page.setContent(dom);
}

mgrPlugins.regPlugin('huxiu.article', ismine, proc);
