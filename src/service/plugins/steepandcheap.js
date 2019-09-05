const messages = require('../../../proto/result_pb');
const {steepandcheapProducts} = require('../../steepandcheap/products');
const {steepandcheapProduct} = require('../../steepandcheap/product');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyTechInAsia} = require('../../utils');

/**
 * callSteepAndCheap - steepandcheap
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestSteepAndCheap
 * @param {object} request - RequestCrawler
 */
function callSteepAndCheap(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.SteepAndCheapMode.SACM_PRODUCTS) {
    steepandcheapProducts(browser, param.getCompanycode(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.SteepAndCheapMode.SACM_PRODUCTS, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_STEEPANDCHEAP, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.SteepAndCheapMode.SACM_PRODUCT) {
    steepandcheapProduct(browser, param.getJobcode(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.SteepAndCheapMode.SACM_PRODUCT, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_STEEPANDCHEAP, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callSteepAndCheap = callSteepAndCheap;
