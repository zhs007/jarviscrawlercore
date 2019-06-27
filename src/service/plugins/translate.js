const messages = require('../../../proto/result_pb');
const {translateInGoogle} = require('../../googletranslate/service');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * translate
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTranslate2
 */
function callTranslate(browser, cfg, call, param) {
  if (param.getText() == '') {
    const reply = new messages.ReplyCrawler();

    const val = new messages.TranslateResult();
    val.setText(ret.text);

    setReplyCrawler(reply, messages.CrawlerType.CT_TRANSLATE2, val);

    replyMsg(call, reply, true);

    return;
  }

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

        // console.log(ret);

        const reply = new messages.ReplyCrawler();

        const val = new messages.TranslateResult();
        val.setText(ret.text);

        setReplyCrawler(reply, messages.CrawlerType.CT_TRANSLATE2, val);

        replyMsg(call, reply, true);
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callTranslate = callTranslate;
