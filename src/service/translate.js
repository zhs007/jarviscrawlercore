const messages = require('../../proto/result_pb');
const {googletranslate} = require('../googletranslate/googletranslate');

/**
 * translate
 * @param {object} browser - browser
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyTranslate)
 */
function callTranslate(browser, call, callback) {
  googletranslate(browser, call.request.getText(), call.request.getSrclang(),
      call.request.getDestlang()).then((desttext) => {
    const reply = new messages.ReplyTranslate();
    reply.setText(desttext);
    callback(null, reply);
  }).catch((err) => {
    callback(err, null);
  });
}

exports.callTranslate = callTranslate;
