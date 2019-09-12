const messages = require('../../../proto/result_pb');
const {jrjFunds} = require('../../jrj/funds');
const {jrjFund} = require('../../jrj/fund');
const {jrjFundManager} = require('../../jrj/fundmanager');
const {jrjFundValue} = require('../../jrj/fundvalue');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyJRJ} = require('../../jrj/protoutils');

/**
 * callJRJ - jrj
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestSteepAndCheap
 * @param {object} request - RequestCrawler
 */
function callJRJ(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.JRJMode.JRJM_FUNDS) {
    jrjFunds(browser, timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJRJ(param.getMode(), ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JRJ, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.JRJMode.JRJM_FUND) {
    jrjFund(browser, param.getFundcode(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJRJ(param.getMode(), ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JRJ, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.JRJMode.JRJM_FUNDVALUE) {
    jrjFundValue(browser, param.getFundcode(), param.getYear(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJRJ(param.getMode(), ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JRJ, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.JRJMode.JRJM_FUNDMANAGER) {
    jrjFundManager(browser, param.getFundcode(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyJRJ(param.getMode(), ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_JRJ, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callJRJ = callJRJ;
