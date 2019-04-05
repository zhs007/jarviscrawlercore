const messages = require('../../proto/result_pb');
const services = require('../../proto/result_grpc_pb');
const {loadConfig, checkConfig} = require('./cfg');
const {startBrowser} = require('../browser');
const {googletranslate} = require('../googletranslate/googletranslate');

const grpc = require('grpc');

let browser = undefined;

/**
 * translate
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyTranslate)
 */
function translate(call, callback) {
  googletranslate(browser, call.request.getText(), call.request.getSrclang(),
      call.request.getDestlang()).then((desttext) => {
    const reply = new messages.ReplyTranslate();
    reply.setText(desttext);
    callback(null, reply);
  }).catch((err) => {
    callback(err, null);
  });
}

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
    translate: translate,
  });

  server.bind(cfg.servAddr, grpc.ServerCredentials.createInsecure());

  server.start();

//   server.tryShutdown(async () => {
//     await browser.close();
//   });
}

exports.startService = startService;
