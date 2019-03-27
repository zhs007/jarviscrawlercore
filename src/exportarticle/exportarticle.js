const puppeteer = require('puppeteer');
const {mgrPlugins} = require('../../plugins/exportarticle/index');
const {jarviscrawlercore} = require('../../proto/result');
const {saveMessage, setImageInfo} = require('../utils');
// const images = require('images');
// const {importScript} = require('../browserscript');

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

  const page = await browser.newPage();
  page._onCertificateError = (error)=> {
    console.log('invalid cert', error);
  };

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
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

  // const ret = await mgrPlugins.formatArticle(page);
  if (ret) {
    const result = new jarviscrawlercore.ExportArticleResult(ret);

    result.url = url;

    if (ret.imgs && ret.imgs.length && ret.imgs.length > 0) {
      for (let i = 0; i < ret.imgs.length; ++i) {
        result.imgs[i] = setImageInfo(result.imgs[i], ret.imgs[i]);
        // result.imgs[i].data = Buffer.from(ret.imgs[i].base64data, 'base64');

        // result.imgs[i].hashName = hashMD5(result.imgs[i].data);
        // // console.log(result.imgs[i].hash);

        // const img = images(result.imgs[i].data);
        // if (img) {
        //   result.imgs[i].width = img.width();
        //   result.imgs[i].height = img.height();

        //   // img.save('abc001.png');
        // }
      }
    }

    if (outputfile) {
      saveMessage(outputfile, result);
    }
    // saveMessage('abc1.pb', result);
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
