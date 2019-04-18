const services = require('../../proto/result_grpc_pb');
const {loadConfig, checkConfig} = require('./cfg');
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
      callTranslate(browser, call, callback);
    },
    exportArticle: (call, callback) => {
      callExportArticle(browser, call, callback);
    },
    getArticles: (call, callback) => {
      callGetArticleList(browser, call, callback);
    },
    getDTData: (call, callback) => {
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
