const {callSearchInCrunchBase} = require('./plugins/crunchbase');
const {callTranslate} = require('./plugins/translate');
const {callGetDTData} = require('./plugins/dtdata');
const {callAnalyzePage} = require('./plugins/analyzepage');
const {callGeoIP} = require('./plugins/geoip');
const {callTechInAsia} = require('./plugins/techinasia');
const {callSteepAndCheap} = require('./plugins/steepandcheap');
const {callMountainsteals} = require('./plugins/mountainsteals');
const {callJRJ} = require('./plugins/jrj');
const {callJD} = require('./plugins/jd');
const {callAlimama} = require('./plugins/alimama');
const {callTmall} = require('./plugins/tmall');
const {callTaobao} = require('./plugins/taobao');
const {callDouban} = require('./plugins/douban');
const {callManhuadb} = require('./plugins/manhuadb');
const {callOABT} = require('./plugins/oabt');
const {callHao6v} = require('./plugins/hao6v');
const {call6vdy} = require('./plugins/6vdy');
const {callPublicTransit} = require('./plugins/publictransit');
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
  } else if (crawlertype == messages.CrawlerType.CT_GEOIP) {
    if (!call.request.hasGeoip()) {
      replyError(call, 'no geoip');

      return;
    }

    const param = call.request.getGeoip();

    callGeoIP(browser, cfg, call, param);
  } else if (crawlertype == messages.CrawlerType.CT_TECHINASIA) {
    if (!call.request.hasTechinasia()) {
      replyError(call, 'no techinasia');

      return;
    }

    const param = call.request.getTechinasia();

    callTechInAsia(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_STEEPANDCHEAP) {
    if (!call.request.hasSteepandcheap()) {
      replyError(call, 'no steepcheap');

      return;
    }

    const param = call.request.getSteepandcheap();

    callSteepAndCheap(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_JRJ) {
    if (!call.request.hasJrj()) {
      replyError(call, 'no jrj');

      return;
    }

    const param = call.request.getJrj();

    callJRJ(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_JD) {
    if (!call.request.hasJd()) {
      replyError(call, 'no jd');

      return;
    }

    const param = call.request.getJd();

    callJD(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_ALIMAMA) {
    if (!call.request.hasAlimama()) {
      replyError(call, 'no alimama');

      return;
    }

    const param = call.request.getAlimama();

    callAlimama(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_TMALL) {
    if (!call.request.hasTmall()) {
      replyError(call, 'no tmall');

      return;
    }

    const param = call.request.getTmall();

    callTmall(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_TAOBAO) {
    if (!call.request.hasTaobao()) {
      replyError(call, 'no taobao');

      return;
    }

    const param = call.request.getTaobao();

    callTaobao(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_MOUNTAINSTEALS) {
    if (!call.request.hasMountainsteals()) {
      replyError(call, 'no mountainsteals');

      return;
    }

    const param = call.request.getMountainsteals();

    callMountainsteals(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_DOUBAN) {
    if (!call.request.hasDouban()) {
      replyError(call, 'no douban');

      return;
    }

    const param = call.request.getDouban();

    callDouban(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_MANHUADB) {
    if (!call.request.hasManhuadb()) {
      replyError(call, 'no manhuadb');

      return;
    }

    const param = call.request.getManhuadb();

    callManhuadb(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_OABT) {
    if (!call.request.hasOabt()) {
      replyError(call, 'no oabt');

      return;
    }

    const param = call.request.getOabt();

    callOABT(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_HAO6V) {
    if (!call.request.hasHao6v()) {
      replyError(call, 'no hao6v');

      return;
    }

    const param = call.request.getHao6v();

    callHao6v(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_6VDY) {
    if (!call.request.hasP6vdy()) {
      replyError(call, 'no 6vdy');

      return;
    }

    const param = call.request.getP6vdy();

    call6vdy(browser, cfg, call, param, call.request);
  } else if (crawlertype == messages.CrawlerType.CT_PUBLICTRANSIT) {
    if (!call.request.hasPublictransit()) {
      replyError(call, 'no publictransit');

      return;
    }

    const param = call.request.getPublictransit();

    callPublicTransit(browser, cfg, call, param, call.request);
  } else {
    replyError(call, 'no plugin');
  }
}

exports.callRequestCrawler = callRequestCrawler;
