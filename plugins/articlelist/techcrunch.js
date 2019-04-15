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
  if (url == 'https://techcrunch.com') {
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

    const lst = $('.post-block');
    console.log(lst.length);
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByTagName('h2');
      if (title.length > 0) {
        const premium = lst[i].getElementsByTagName('.premium-content__label');
        const url = title[0].getElementsByTagName('a');
        // const summary = lst[i].getElementsByClassName('mob-sub');

        co = {
          title: title[0].innerText,
        };

        if (url.length > 0) {
          co.url = url[0].href;
        }

        if (premium) {
          co.premium = true;
        }

        // if (summary.length > 0) {
        //   co.summary = summary[0].innerText;
        // }

        ret.articles.push(co);
      }
    }

    console.log(ret);

    return ret;
  });
}

mgrPlugins.regGetArticles('techcrunch.main', ismine, getArticles);
