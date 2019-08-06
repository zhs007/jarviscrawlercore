const messages = require('../../proto/result_pb');
const services = require('../../proto/result_grpc_pb');
const {requestCrawler} = require('./utils');

const grpc = require('grpc');

const TOKEN = 'wzDkh9h2fhfUVuS9jZ8uVbhV3vC5AWX3';

/**
 * startTranslate2
 * @param {string} servAddr - service addr
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {string} text - text
 */
function startTranslate2(servAddr, srclang, destlang, text) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestTranslate2();
  request.setText(text);
  request.setSrclang(srclang);
  request.setDestlang(destlang);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_TRANSLATE2,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('text:', reply.getText());
        }
      }
  );
}

/**
 * getCrunchBaseCompany
 * @param {string} servAddr - service addr
 * @param {string} company - company code
 */
function getCrunchBaseCompany(servAddr, company) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestCrunchBaseCompany();
  request.setSearch(company);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_CB_COMPANY,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('text:', reply);
        }
      }
  );
}

/**
 * analyzePage
 * @param {string} servAddr - servAddr
 * @param {string} url - url
 * @param {string} delay - delay time in seconds
 */
function analyzePage(servAddr, url, delay) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.AnalyzePage();
  request.setUrl(url);
  request.setDelay(delay);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_ANALYZEPAGE,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('text:', reply);
        }
      }
  );
}

// startTranslate2(
//     '127.0.0.1:7051',
//     'en',
//     'zh-CN',
//     '@Peter Walker I am sure there is a problem with excel file, I need more time to check it.'
// );

// getCrunchBaseCompany('127.0.0.1:7051', 'slack');

analyzePage('127.0.0.1:7051', 'http://47.90.46.159:8090/game.html?gameCode=nightclub&language=zh_CN&isCheat=true&slotKey=', 10);
