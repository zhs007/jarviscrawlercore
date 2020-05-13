const messages = require('../../../pbjs/result_pb');
const {tmallDetail} = require('../../tmall/detail');
const {tmallDetailMobile} = require('../../tmall/detailmobile');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyTmall} = require('../../proto.tmall.utils');

/**
 * callTmall - tmall
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTmall
 * @param {object} request - RequestCrawler
 */
function callTmall(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.TmallMode.TMM_PRODUCT) {
    tmallDetail(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTmall(messages.TmallMode.TMM_PRODUCT, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TMALL, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.TmallMode.TMM_MOBILEPRODUCT) {
    tmallDetailMobile(
        browser,
        param.getUrl(),
        param.getDevice(),
        cfg.defaultmobiledevice,
        timeout,
    )
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTmall(
              messages.TmallMode.TMM_MOBILEPRODUCT,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_TMALL, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callTmall = callTmall;
