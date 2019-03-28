const puppeteer = require('puppeteer');
const {mgrPlugins} = require('../../plugins/exportarticle/index');
const {jarviscrawlercore} = require('../../proto/result');
const {saveMessage, setImageInfo} = require('../utils');

/**
 * export article to a pdf file or a jpg file.
 * @param {string} url - URL
 * @param {string} outputfile - output file
 * @param {string} pdffile - pdf filename
 * @param {string} pdfformat - pdf format, like A4
 * @param {string} jpgfile - jpg filename
 * @param {bool} headless - headless mode
 */
async function exportArticle(url, outputfile, pdffile, pdfformat,
    jpgfile, headless) {
  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const mapResponse = {};

  const page = await browser.newPage();
  await page.setBypassCSP(true);
  // await page.setRequestInterception(true);
  // page.on('request', (req) => {
  //   intercept(req, scenario.url);
  // });

  page.on('response', async (response) => {
    const url = response.url();
    // console.log(url);
    const headers = response.headers();
    if (headers && headers['content-type'] &&
        headers['content-type'].indexOf('image') == 0) {
      mapResponse[url] = await response.buffer();
    }
  });

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  await page.addScriptTag({url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'});
  await page.addScriptTag({path: './browser/utils.js'});
  // await importScript(page);
  // await page.addScriptTag({url: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/index.js'});

  if (jpgfile && jpgfile != '') {
    await page.screenshot({
      path: jpgfile,
      type: 'jpeg',
      quality: 60,
      fullPage: true,
    });
  }

  const ret = await mgrPlugins.procTask(url, page);
  await page.waitForNavigation({waitUntil: 'networkidle0'}).catch((err) => {
    console.log('catch a err ', err);
  });
  if (ret) {
    const result = new jarviscrawlercore.ExportArticleResult(ret);

    result.url = url;

    if (ret.titleImage) {
      result.titleImage = setImageInfo(result.titleImage,
          ret.titleImage, mapResponse);
    }

    if (ret.imgs && ret.imgs.length && ret.imgs.length > 0) {
      for (let i = 0; i < ret.imgs.length; ++i) {
        result.imgs[i] = setImageInfo(result.imgs[i], ret.imgs[i], mapResponse);
      }
    }

    if (outputfile) {
      saveMessage(outputfile, result);
    }
  }

  if (pdffile && pdffile != '') {
    if (!pdfformat) {
      pdfformat = 'A4';
    }

    await page.pdf({
      path: pdffile,
      format: pdfformat,
    });
  }

  await browser.close();
}

exports.exportArticle = exportArticle;
