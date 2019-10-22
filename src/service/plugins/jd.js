const messages = require('../../../proto/result_pb');
const {jdProduct} = require('../../jd/product');
const {jdActive} = require('../../jd/active');
const {jdActivePage} = require('../../jd/activepage');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyJD} = require('../../proto.jd.utils');

/**
 * callJD - jd
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestJD
 * @param {object} request - RequestCrawler
 */
function callJD(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.JDMode.JDM_ACTIVE) {
    jdActive(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJD(messages.JDMode.JDM_ACTIVE, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JD, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.JDMode.JDM_PRODUCT) {
    jdProduct(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJD(messages.JDMode.JDM_PRODUCT, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JD, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.JDMode.JDM_ACTIVEPAGE) {
    jdActivePage(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJD(messages.JDMode.JDM_ACTIVEPAGE, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JD, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callJD = callJD;
