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
  // console.log('zhihu');

  // const ele = await page.$(
  //     '.VagueImage.origin_image.zh-lightbox-thumb');

  // // console.log(ele.asElement());

  // const properties = await ele.getProperties();
  // for (const key of properties.keys()) {
  //   console.log(key);
  // }

  // const ele = await page.$eval(
  //     // '.RichText.ztext.Post-RichText',
  //     // '.VagueImage.origin_image.zh-lightbox-thumb',
  //     'figure',
  //     (element) => {
  //       console.log(element);

  //       return element.innerHTML;
  //     });

  // console.log(ele);

  // const jval = await ele.jsonValue();
  // console.log(ele);
  // console.log(jval);
}

/**
 * formatArticle
 * @param {object} page - page
 * @return {ExportArticleResult} result - result
 */
async function formatArticle(page) {
  return undefined;
}

mgrPlugins.regPlugin('zhihu.article', ismine, proc, formatArticle);
