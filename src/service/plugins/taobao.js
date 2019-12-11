const messages = require('../../../proto/result_pb');
const {taobaoItem} = require('../../taobao/item');
const {taobaoSearch} = require('../../taobao/search');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyTaobao} = require('../../proto.taobao.utils');

/**
 * callTaobao - taobao
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTaobao
 * @param {object} request - RequestCrawler
 */
function callTaobao(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.TaobaoMode.TBM_PRODUCT) {
    taobaoItem(browser, param.getItemid(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTaobao(messages.TaobaoMode.TBM_PRODUCT, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TAOBAO, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.TaobaoMode.TBM_SEARCH) {
    taobaoSearch(browser, param.getText(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTaobao(messages.TaobaoMode.TBM_SEARCH, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TAOBAO, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callTaobao = callTaobao;
