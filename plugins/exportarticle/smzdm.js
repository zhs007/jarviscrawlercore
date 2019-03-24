const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://post.smzdm.com/p/') == 0) {
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
      'article',
      (element) => {
        return element.innerHTML;
      });

  //   console.log('geekpark.article');
  //   console.log(dom.length);

  await page.setContent(dom);
}

mgrPlugins.regPlugin('smzdm.article', ismine, proc);
