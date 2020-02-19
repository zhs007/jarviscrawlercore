const messages = require('../../../proto/result_pb');
const {oabtPage, newReplyOABT} = require('../../oabt/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * callOABT - oabt
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestDouban
 * @param {object} request - RequestCrawler
 */
function callOABT(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.OABTMode.OABTM_PAGE) {
    oabtPage(browser, param.getPageindex(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyOABT(messages.OABTMode.OABTM_PAGE, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_OABT, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callOABT = callOABT;
