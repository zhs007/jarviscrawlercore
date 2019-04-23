const services = require('../../proto/result_grpc_pb');
const {
  loadConfig,
  checkConfig,
  isValidToken,
} = require('./cfg');
const {startBrowser} = require('../browser');
const {callTranslate} = require('./translate');
const {callExportArticle} = require('./exportarticle');
const {callGetArticleList} = require('./getarticles');
const {callGetDTData} = require('./dtdata');

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
    console.log(err);

    return;
  }

  browser = await startBrowser(cfg.headless);
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
        console.log('invalid token.', call.request.getToken());

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

      callGetDTData(browser, cfg.dtconfig, call, callback);
    },
  });

  server.bind(cfg.servAddr, grpc.ServerCredentials.createInsecure());

  server.start();

//   server.tryShutdown(async () => {
//     await browser.close();
//   });
}

exports.startService = startService;
