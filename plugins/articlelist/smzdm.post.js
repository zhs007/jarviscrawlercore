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
  if (url == 'https://post.smzdm.com') {
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

        const lst = $('.feed-block.z-hor-feed.post-feed-block');
        for (let i = 0; i < lst.length; ++i) {
          const title = lst[i].getElementsByClassName('z-feed-title');
          if (title.length > 0) {
            co = {
              title: title[0].innerText,
            };

            const href = lst[i].getElementsByTagName('a');

            co.url = href[0].href;

            ret.articles.push(co);
          }
        }

        console.log(ret);

        return ret;
      })
      .catch((err) => {
        log.error('smzdm.post:getArticles.evaluate', err);

        errret = err;
      });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('smzdm.post', ismine, getArticles);
