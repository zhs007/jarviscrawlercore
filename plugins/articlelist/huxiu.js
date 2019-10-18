const {mgrPlugins} = require('./pluginsmgr');
const log = require('../../src/log');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url == 'https://www.huxiu.com') {
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
  const ret = await page
      .evaluate(async () => {
        const ret = {};
        ret.articles = [];

        const lst = $('.mod-b.mod-art.clearfix');

        for (let i = 0; i < lst.length; ++i) {
          const title = lst[i].getElementsByTagName('h2');
          if (title.length > 0) {
            const url = title[0].getElementsByTagName('a');
            const summary = lst[i].getElementsByClassName('mob-sub');

            co = {
              title: title[0].innerText,
            };

            if (url.length > 0) {
              co.url = url[0].href;
            }

            if (summary.length > 0) {
              co.summary = summary[0].innerText;
            }

            ret.articles.push(co);
          }
        }

        console.log(ret);

        return ret;
      })
      .catch((err) => {
        log.error('huxiu.main:getArticles.evaluate', err);

        errret = err;
      });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('huxiu.main', ismine, getArticles);
