const services = require('../../pbjs/result_grpc_pb');
const {loadConfig, checkConfig, isValidToken} = require('./cfg');
const {attachBrowser, startBrowser} = require('../browser');
const {callTranslate} = require('./translate');
const {callExportArticle} = require('./exportarticle');
const {callGetArticleList} = require('./getarticles');
const {callGetDTData} = require('./dtdata');
const {replyError} = require('./utils');
const {callRequestCrawler} = require('./requestcrawler');
const log = require('../log');

const grpc = require('grpc');

let browser = undefined;

/**
 * startService
 * @param {string} cfgfile - config filename
 */
async function startService(cfgfile) {
  const cfg = loadConfig(cfgfile);
  const err = checkConfig(cfg);
  if (err) {
    log.error(err);

    return;
  }

  if (cfg.attach) {
    browser = await attachBrowser(cfg.attach);
  } else {
    browser = await startBrowser(cfg.headless, cfg.slowMo);
  }
  //   const page = await browser.newPage();

  const server = new grpc.Server();

  server.addService(services.JarvisCrawlerServiceService, {
    translate: (call, callback) => {
      if (!isValidToken(cfg, call.request.getToken())) {
        callback(new Error('invalid token'), null);

        return;
      }

      callTranslate(browser, call, callback);
    },
    exportArticle: (call) => {
      if (!isValidToken(cfg, call.request.getToken())) {
        log.error('invalid token', call.request.getToken());

        call.end();

        return;
      }

      callExportArticle(browser, call);
    },
    getArticles: (call, callback) => {
      if (!isValidToken(cfg, call.request.getToken())) {
        callback(new Error('invalid token'), null);

        return;
      }

      callGetArticleList(browser, call, callback);
    },
    getDTData: (call, callback) => {
      if (!isValidToken(cfg, call.request.getToken())) {
        callback(new Error('invalid token'), null);

        return;
      }

      if (!cfg.dtconfig) {
        callback(new Error('invalid dtconfig'), null);

        return;
      }

      callGetDTData(browser, cfg.dtconfig, call, callback);
    },
    requestCrawler: (call) => {
      if (!isValidToken(cfg, call.request.getToken())) {
        replyError(call, 'invalid token', call.request.getToken(), true);

        return;
      }

      callRequestCrawler(browser, cfg, call);
    },
  });

  server.bind(cfg.servAddr, grpc.ServerCredentials.createInsecure());

  server.start();

  //   server.tryShutdown(async () => {
  //     await browser.close();
  //   });
}

exports.startService = startService;
