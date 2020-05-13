const messages = require('../../../pbjs/result_pb');
const {mountainstealsProduct} = require('../../mountainsteals/product');
const {mountainstealsSale} = require('../../mountainsteals/sale');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyMountainSteals} = require('../../proto.mountainsteals');

/**
 * callMountainsteals - mountainsteals
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestMountainsteals
 * @param {object} request - RequestCrawler
 */
function callMountainsteals(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;

  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.MountainStealsMode.MSM_SALE) {
    mountainstealsSale(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyMountainSteals(
              messages.MountainStealsMode.MSM_SALE,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_MOUNTAINSTEALS, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.MountainStealsMode.MSM_PRODUCT) {
    mountainstealsProduct(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyMountainSteals(
              messages.MountainStealsMode.MSM_PRODUCT,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_MOUNTAINSTEALS, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callMountainsteals = callMountainsteals;
