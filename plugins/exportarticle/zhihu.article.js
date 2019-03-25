const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://zhuanlan.zhihu.com/p/') == 0) {
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
      '.RichText.ztext.Post-RichText',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);
}

mgrPlugins.regPlugin('zhihu.article', ismine, proc);
