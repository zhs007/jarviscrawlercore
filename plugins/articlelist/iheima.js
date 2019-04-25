const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url == 'http://www.iheima.com') {
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

    const lst = $('.item-wrap.clearfix');
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByClassName('title');
      if (title.length > 0) {
        co = {
          title: title[0].innerText,
        };

        co.url = title[0].href;

        ret.articles.push(co);
      }
    }

    console.log(ret);

    return ret;
  }).catch((err) => {
    console.log('iheima.main:getArticles.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('iheima.main', ismine, getArticles);
