const messages = require('../../../pbjs/result_pb');
const {
  tokyometroLine,
  tokyometroSubwaymap,
  kotsumetrotokyoSubways,
  jrailpassSubways,
  newReplyPublicTransit,
} = require('../../publictransit/index');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * callPublicTransit - PublicTransit
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestPublicTransit
 * @param {object} request - RequestCrawler
 */
function callPublicTransit(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.PublicTransitMode.PTM_TOKYOMETRO_SUBWAYS) {
    tokyometroSubwaymap(browser, timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyPublicTransit(
              messages.PublicTransitMode.PTM_TOKYOMETRO_SUBWAYS,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_PUBLICTRANSIT, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (
    param.getMode() == messages.PublicTransitMode.PTM_TOKYOMETRO_LINE
  ) {
    tokyometroLine(browser, param.getUrl(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyPublicTransit(
              messages.PublicTransitMode.PTM_TOKYOMETRO_LINE,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_PUBLICTRANSIT, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (
    param.getMode() == messages.PublicTransitMode.PTM_KOSTUMETROTOKYO_SUBWAYS
  ) {
    kotsumetrotokyoSubways(browser, timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyPublicTransit(
              messages.PublicTransitMode.PTM_KOSTUMETROTOKYO_SUBWAYS,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_PUBLICTRANSIT, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (
    param.getMode() == messages.PublicTransitMode.PTM_JRAILPASS_SUBWAYS
  ) {
    jrailpassSubways(browser, timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyPublicTransit(
              messages.PublicTransitMode.PTM_JRAILPASS_SUBWAYS,
              ret.ret,
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_PUBLICTRANSIT, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callPublicTransit = callPublicTransit;
