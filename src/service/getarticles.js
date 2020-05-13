const messages = require('../../pbjs/result_pb');
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
      getArticleList(
          browser,
          curcfg.url,
          '',
          curcfg.jquery).then(({
        result,
        err}) => {
        if (err) {
          callback(new Error(err + ' @ ' + call.request.getWebsite()), null);

          return;
        }

        const lstArticles = result.getArticlesList();
        for (let i = 0; i < lstArticles.length; ++i) {
          lstArticles[i].setLang(curcfg.lang);
        }

        const reply = new messages.ReplyArticles();
        reply.setArticles(result);
        callback(null, reply);
      }).catch((err) => {
        callback(new Error('catch ' + err + ' @ ' + call.request.getWebsite()), null);
      });
    } else {
      callback(new Error('Don\'t support ' + call.request.getWebsite()), null);
    }
  } else {
    getArticleList(browser,
        call.request.getUrl(),
        '',
        call.request.getAttachjquery()).then(({
      result,
      err}) => {
      if (err) {
        callback(new Error(err.messages + ' @ ' + call.request.getUrl()), null);

        return;
      }

      const reply = new messages.ReplyArticles();
      reply.setArticles(result);
      callback(null, reply);
    }).catch((err) => {
      callback(new Error('catch ' + err.messages + ' @ ' + call.request.getUrl()), null);
    });
  }
}

exports.callGetArticleList = callGetArticleList;
