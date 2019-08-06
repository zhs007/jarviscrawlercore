const {callSearchInCrunchBase} = require('./plugins/crunchbase');
const {callTranslate} = require('./plugins/translate');
const {callGetDTData} = require('./plugins/dtdata');
const {callAnalyzePage} = require('./plugins/analyzepage');
const messages = require('../../proto/result_pb');
const {replyError} = require('./utils');

/**
 * get dt data
 * @param {object} browser - browser
 * @param {object} cfg - config
 * @param {object} call - call
 */
function callRequestCrawler(browser, cfg, call) {
  const crawlertype = call.request.getCrawlertype();
  if (crawlertype == messages.CrawlerType.CT_CB_COMPANY) {
    if (!call.request.hasCbcompany()) {
      replyError(call, 'no cbcompany');

      return;
    }

    const param = call.request.getCbcompany();

    callSearchInCrunchBase(browser, cfg, call, param);
  } else if (crawlertype == messages.CrawlerType.CT_TRANSLATE2) {
    if (!call.request.hasTranslate2()) {
      replyError(call, 'no translate2');

      return;
    }

    const param = call.request.getTranslate2();

    callTranslate(browser, cfg, call, param);
  } else if (crawlertype == messages.CrawlerType.CT_DTDATA) {
    if (!call.request.hasDtdata()) {
      replyError(call, 'no dtdata');

      return;
    }

    const param = call.request.getDtdata();

    callGetDTData(browser, cfg, call, param);
  } else if (crawlertype == messages.CrawlerType.CT_ANALYZEPAGE) {
    if (!call.request.hasAnalyzepage()) {
      replyError(call, 'no analyzepage');

      return;
    }

    const param = call.request.getAnalyzepage();

    callAnalyzePage(browser, cfg, call, param);
  }
}

exports.callRequestCrawler = callRequestCrawler;
