const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url == 'https://www.geekpark.net') {
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

    const lst = $('.article-item');
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByTagName('h3');
      if (title.length > 0) {
        const url = title[0].parentNode;
        const summary = lst[i].getElementsByClassName('multiline-text-overflow');

        co = {
          title: title[0].innerText,
        };

        co.url = url.href;

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

mgrPlugins.regGetArticles('geekpark.main', ismine, getArticles);
