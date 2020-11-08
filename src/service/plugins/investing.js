const messages = require('../../../pbjs/result_pb');
const {
  investingHD,
  investingAssets,
  newReplyInvesting,
} = require('../../investing/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * callInvesting - investing
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestInvesting
 * @param {object} request - RequestCrawler
 */
function callInvesting(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.InvestingMode.INVESTINGMODE_ASSETS) {
    investingAssets(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyInvesting(
              messages.InvestingMode.INVESTINGMODE_ASSETS,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_INVESTING, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.InvestingMode.INVESTINGMODE_HD) {
    investingHD(
        browser,
        param.getUrl(),
        param.getStartdata(),
        param.getEnddata(),
        timeout,
    )
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyInvesting(
              messages.InvestingMode.INVESTINGMODE_HD,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_INVESTING, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callInvesting = callInvesting;
