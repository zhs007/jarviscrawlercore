const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url == 'https://news.smzdm.com') {
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
  let errret = undefined;
  const ret = await page.evaluate(async () => {
    const ret = {};
    ret.articles = [];

    const lst = $('.list');
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByClassName('listTitle');
      if (title.length > 0) {
        co = {
          title: title[0].innerText,
        };

        const href = title[0].getElementsByTagName('a');
        if (href.length > 0) {
          co.url = href[0].href;
        }

        const lrInfo = lst[i].getElementsByClassName('lrInfo');
        if (lrInfo.length > 0) {
          co.summary = lrInfo[0].innerText;
        }

        ret.articles.push(co);
      }
    }

    console.log(ret);

    return ret;
  }).catch((err) => {
    console.log('smzdm.news:getArticles.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('smzdm.news', ismine, getArticles);
