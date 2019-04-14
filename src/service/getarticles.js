const messages = require('../../proto/result_pb');
const {getArticleList} = require('../articlelist/articlelist');

/**
 * translate
 * @param {object} browser - browser
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyArticles)
 */
function callGetArticleList(browser, call, callback) {
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

exports.callGetArticleList = callGetArticleList;
