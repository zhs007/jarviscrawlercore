const messages = require('../../../pbjs/result_pb');
const {manhuadbAuthor, newReplyManhuadb} = require('../../manhuadb/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * callManhuadb - manhuadb
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestDouban
 * @param {object} request - RequestCrawler
 */
function callManhuadb(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.ManhuaDBMode.MHDB_AUTHOR) {
    manhuadbAuthor(browser, param.getAuthorid(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyManhuadb(
              messages.ManhuaDBMode.MHDB_AUTHOR,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_MANHUADB, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callManhuadb = callManhuadb;
