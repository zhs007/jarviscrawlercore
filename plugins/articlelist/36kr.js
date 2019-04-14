const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url == 'https://36kr.com') {
    return true;
  }

  return false;
}

/**
 * getArticles
 * @param {object} page - page
 * @return {ArticleList} result - result
 */
async function getArticles(page) {
  // articleSingle
  return await page.evaluate(async () => {
    const ret = {};
    ret.articles = [];

    const lst = $('.kr-flow-article-item');
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByClassName('article-item-title');
      if (title.length > 0) {
        const summary = lst[i].getElementsByClassName('article-item-description');

        co = {
          title: title[0].innerText,
        };

        co.url = title[0].href;

        if (summary.length > 0) {
          co.summary = summary[0].innerText;
        }

        ret.articles.push(co);
      }
    }

    console.log(ret);

    return ret;
  });
}

mgrPlugins.regGetArticles('36kr.main', ismine, getArticles);
