const messages = require('../../../proto/result_pb');
const {analyzePage} = require('../../analysis/page');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyAnalyzePage} = require('../../utils');

/**
 * callAnalyzePage - analyze page
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - AnalyzePage
 */
function callAnalyzePage(browser, cfg, call, param) {
  analyzePage(browser, param.getUrl(), param.getDelay())
      .then((ret) => {
        if (ret.error) {
          replyError(call, ret.error, true);

          return;
        }

        // console.log(ret);

        const reply = new messages.ReplyCrawler();

        const val = newReplyAnalyzePage(ret.ret);

        setReplyCrawler(reply, messages.CrawlerType.CT_ANALYZEPAGE, val);

        replyMsg(call, reply, true);
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callAnalyzePage = callAnalyzePage;
