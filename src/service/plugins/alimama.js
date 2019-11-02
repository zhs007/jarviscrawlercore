const messages = require('../../../proto/result_pb');
const {alimamaKeepalive} = require('../../alimama/keepalive');
// const {alimamaSearch} = require('../../alimama/search');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyAlimama} = require('../../proto.alimama.utils');

/**
 * callAlimama - alimama
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestAlimama
 * @param {object} request - RequestCrawler
 */
function callAlimama(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.AlimamaMode.ALIMMM_KEEPALIVE) {
    alimamaKeepalive(browser, timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyAlimama(
              messages.AlimamaMode.ALIMMM_KEEPALIVE,
              undefined
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_ALIMAMA, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callAlimama = callAlimama;
