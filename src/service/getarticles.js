const messages = require('../../proto/result_pb');
const {getArticleList} = require('../articlelist/articlelist');
const {mgrWebSite} = require('../websitemgr');

/**
 * translate
 * @param {object} browser - browser
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyArticles)
 */
function callGetArticleList(browser, call, callback) {
  if (call.request.getWebsite()) {
    const curcfg = mgrWebSite.getArticles(call.request.getWebsite());
    if (curcfg) {
      getArticleList(browser,
          curcfg.url,
          '',
          curcfg.jquery).then((result) => {
        for (let i = 0; i < result.articles.length; ++i) {
          result.articles[i].setLang(curcfg.lang);
        }

        const reply = new messages.ReplyArticles();
        reply.setArticles(result);
        callback(null, reply);
      }).catch((err) => {
        callback(err, null);
      });
    } else {
      callback(new Error('Don\'t support ' + call.request.getWebsite()), null);
    }
  } else {
    getArticleList(browser,
        call.request.getUrl(),
        '',
        call.request.getAttachjquery()).then((result) => {
      const reply = new messages.ReplyArticles();
      reply.setArticles(result);
      callback(null, reply);
    }).catch((err) => {
      callback(err, null);
    });
  }
}

exports.callGetArticleList = callGetArticleList;
