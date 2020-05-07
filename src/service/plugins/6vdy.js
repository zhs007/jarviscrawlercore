const messages = require('../../../proto/result_pb');
const {p6vdyMovie, p6vdyMovies, newReply6vdy} = require('../../6vdy/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * call6vdy - 6vdy
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestDouban
 * @param {object} request - RequestCrawler
 */
function call6vdy(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.P6vdyMode.P6VDY_MOVIES) {
    p6vdyMovies(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReply6vdy(messages.P6vdyMode.P6VDY_MOVIES, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_6VDY, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.P6vdyMode.P6VDY_MOVIE) {
    p6vdyMovie(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReply6vdy(messages.P6vdyMode.P6VDY_MOVIE, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_6VDY, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.call6vdy = call6vdy;
