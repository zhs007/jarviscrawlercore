const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  // console.log(url);
  if (url == 'https://www.lieyunwang.com') {
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

    const lst = $('.article-bar.clearfix');
    // console.log(lst.length);
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByClassName('lyw-article-title');
      if (title.length > 0) {
        const summary = lst[i].getElementsByClassName('article-digest mt10');

        co = {
          title: title[0].innerText,
          url: title[0].href,
        };

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

mgrPlugins.regGetArticles('lieyunwang.main', ismine, getArticles);
