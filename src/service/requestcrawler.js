const messages = require('../../proto/result_pb');
const {callSearchInCrunchBase} = require('./crunchbase');

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
  }
}

exports.callRequestCrawler = callRequestCrawler;
