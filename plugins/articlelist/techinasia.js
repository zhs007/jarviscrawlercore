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
  if (url == 'https://www.techinasia.com') {
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

  await page.waitForFunction(() => {
    return $('.item').length > 0;
  }).catch((err) => {
    errret = err;
  });

  if (errret) {
    return {
      result: undefined,
      err: errret,
    };
  }

  const ret = await page.evaluate(async () => {
    const ret = {};
    ret.articles = [];

    const lst = $('.item');
    console.log(lst.length);
    for (let i = 0; i < lst.length; ++i) {
      const title = lst[i].getElementsByTagName('h2');
      if (title.length > 0) {
        // const premium = lst[i].getElementsByTagName('.premium-content__label');
        const url = lst[i].getElementsByTagName('a');
        // const summary = lst[i].getElementsByClassName('mob-sub');

        co = {
          title: title[0].innerText,
        };

        if (url.length > 0) {
          co.url = url[0].href;
        }

        // if (premium) {
        //   co.premium = true;
        // }

        const summary = lst[i].getElementsByClassName('.excerpt');
        if (summary.length > 0) {
          co.summary = summary[0].innerText;
        }

        // if (summary.length > 0) {
        //   co.summary = summary[0].innerText;
        // }

        ret.articles.push(co);
      }
    }

    console.log(ret);

    return ret;
  }).catch((err) => {
    console.log('techinasia.main:getArticles.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regGetArticles('techinasia.main', ismine, getArticles);
