const messages = require('../../proto/result_pb');
const {exportArticle} = require('../exportarticle/exportarticle');

/**
 * callExportArticle
 * @param {object} browser - browser
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyArticle)
 */
function callExportArticle(browser, call, callback) {
  exportArticle(browser, call.request.getUrl(), '', 'pb', '', 60,
      call.request.getAttachjquery(), false).then((result)=>{
    const reply = new messages.ReplyArticle();
    reply.setResult(result);
    callback(null, reply);
  }).catch((err) => {
    callback(err, null);
  });
}

exports.callExportArticle = callExportArticle;
