const {callSearchInCrunchBase} = require('./plugins/crunchbase');
const {callTranslate} = require('./plugins/translate');

/**
 * get dt data
 * @param {object} browser - browser
 * @param {object} cfg - config
 * @param {object} call - call
 */
function callRequestCrawler(browser, cfg, call) {
  const crawlertype = call.request.getCrawlertype();
  if (crawlertype == 'crunchbase.company') {
    const param = call.request.hasCbcompany();

    callSearchInCrunchBase(browser, cfg, call, param);
  } else if (crawlertype == 'translate') {
    const param = call.request.hasTranslate2();

    callTranslate(browser, cfg, call, param);
  }
}

exports.callRequestCrawler = callRequestCrawler;
