const messages = require('../../../proto/result_pb');
const {translateInGoogle} = require('../../googletranslate/service');
const {replyError} = require('../utils');

/**
 * translate
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTranslate2
 */
function callTranslate(browser, cfg, call, param) {
  translateInGoogle(
      browser,
      param.getText(),
      param.getSrclang(),
      param.getDestlang()
  )
      .then((ret) => {
        if (ret.error) {
          replyError(call, ret.error, true);

          return;
        }

        call.end();
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callTranslate = callTranslate;
