const messages = require('../../../proto/result_pb');
const {
  search,
  doubanType2str,
  newReplyDouban,
} = require('../../douban/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
// const {newReplyTaobao} = require('../../proto.taobao.utils');

/**
 * callDouban - douban
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestDouban
 * @param {object} request - RequestCrawler
 */
function callDouban(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.DoubanMode.DBM_SEARCH) {
    search(
        browser,
        doubanType2str(param.getDoubantype()),
        param.getText(),
        false,
        timeout,
    )
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyDouban(messages.DoubanMode.DBM_SEARCH, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_DOUBAN, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callDouban = callDouban;
