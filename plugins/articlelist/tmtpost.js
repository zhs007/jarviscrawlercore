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
  if (url == 'https://www.tmtpost.com') {
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

    const lst = $('.post_part.clear');
    // console.log(lst.length);
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByTagName('h3');
      if (title.length > 0) {
        const url = title[0].getElementsByTagName('a');
        const summary = lst[i].getElementsByClassName('summary');

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
  });
}

mgrPlugins.regGetArticles('tmtpost.main', ismine, getArticles);
