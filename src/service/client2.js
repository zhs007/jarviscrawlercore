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
 * @param {number} delay - delay time in seconds
 * @param {number} w - viewport width
 * @param {number} h - viewport height
 */
function analyzePage(servAddr, url, delay, w, h) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.AnalyzePage();
  request.setUrl(url);
  request.setDelay(delay);
  request.setViewportwidth(w);
  request.setViewportheight(h);

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
          console.log('reply:', JSON.stringify(reply.toObject()));
        }
      }
  );
}

/**
 * geoip
 * @param {string} servAddr - servAddr
 * @param {string} ip - ip
 */
function geoip(servAddr, ip) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestGeoIP();
  request.setIp(ip);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_GEOIP,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('reply:', JSON.stringify(reply.toObject()));
        }
      }
  );
}

/**
 * techinasiaCompany
 * @param {string} servAddr - servAddr
 * @param {string} companycode - companycode
 */
function techinasiaCompany(servAddr, companycode) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestTechInAsia();
  request.setMode(messages.TechInAsiaMode.TIAM_COMPANY);
  request.setCompanycode(companycode);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_TECHINASIA,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('reply:', JSON.stringify(reply.toObject()));
        }
      }
  );
}

/**
 * techinasiaJob
 * @param {string} servAddr - servAddr
 * @param {string} jobcode - jobcode
 */
function techinasiaJob(servAddr, jobcode) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestTechInAsia();
  request.setMode(messages.TechInAsiaMode.TIAM_JOB);
  request.setJobcode(jobcode);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_TECHINASIA,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('reply:', JSON.stringify(reply.toObject()));
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

// analyzePage(
//     '127.0.0.1:7051',
//     'http://47.90.46.159:8090/game.html?gameCode=nightclub&language=zh_CN&isCheat=true&slotKey=',
//     10, 1280, 800
// );

// geoip('127.0.0.1:7051', '60.250.112.36');

// techinasiaCompany('127.0.0.1:7051', 'niki-dot-ai');
techinasiaJob('127.0.0.1:7051', 'b6f2b504-e3b5-4f33-9732-5d0d59af828f');
