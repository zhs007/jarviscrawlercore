const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.zhihu.com/question/') == 0) {
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
      '.Card.AnswerCard',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);
}

mgrPlugins.regPlugin('zhihu.answer.article', ismine, proc);
