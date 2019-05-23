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
  if (url == 'https://zdreview.com') {
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

    const lp = getElement('.nice-ajax-con');
    if (lp) {
      for (let i = 0; i < lp.children.length; ++i) {
        const cn = lp.children[i];
        const title = cn.getElementsByTagName('h2');
        if (title.length > 0) {
          const url = title[0].getElementsByTagName('a');

          co = {
            title: title[0].innerText,
          };

          if (url.length > 0) {
            co.url = url[0].href;
          }

          ret.articles.push(co);
        }
      }
    }

    console.log(ret);

    return ret;
  }).catch((err) => {
    console.log('tmtpost.main:getArticles.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('zdreview', ismine, getArticles);
