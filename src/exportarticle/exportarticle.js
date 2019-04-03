const puppeteer = require('puppeteer');
const {mgrPlugins} = require('../../plugins/exportarticle/index');
const {jarviscrawlercore} = require('../../proto/result');
const {saveMessage, setImageInfo, getImageHashName} = require('../utils');
const {exportJPG} = require('./expjpg');

/**
 * export article to a pdf file or a jpg file.
 * @param {string} url - URL
 * @param {string} outputfile - output file
 * @param {string} mode - mode
 * @param {string} pdfformat - pdf format, like A4
 * @param {int} jpgquality - jpg quality, like 60
 * @param {bool} headless - headless mode
 * @param {bool} jquery - attach jquery
 * @param {bool} isoutpurimages - is output images
 */
async function exportArticle(url, outputfile, mode, pdfformat, jpgquality,
    headless, jquery, isoutpurimages) {
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
    if (!response) {
      return;
    }

    const url = response.url();
    // console.log(url);
    const headers = response.headers();
    if (headers && headers['content-type'] &&
          headers['content-type'].indexOf('image') == 0) {
      mapResponse[url] = await response.buffer();
    }
  });

  await page.goto(url,
      {
        waitUntil: 'networkidle2',
        timeout: 0,
      }).catch((err) => {
    console.log('page.goto', url, err);
  });

  // await page.goto(url);

  if (mode == 'jpg') {
    await exportJPG(page, outputfile, jpgquality);
  } else {
    if (jquery) {
      await page.addScriptTag({url: './jquery3.3.1.min.js'});
    }

    await page.addScriptTag({path: './browser/utils.js'});

    const ret = await mgrPlugins.procTask(url, page);

    if (ret) {
      const result = new jarviscrawlercore.ExportArticleResult(ret);

      result.url = url;

      if (ret.titleImage) {
        result.titleImage = setImageInfo(result.titleImage,
            ret.titleImage, mapResponse, isoutpurimages);
      }

      if (ret.imgs && ret.imgs.length && ret.imgs.length > 0) {
        for (let i = 0; i < ret.imgs.length; ++i) {
          result.imgs[i] = setImageInfo(result.imgs[i],
              ret.imgs[i], mapResponse, isoutpurimages);
        }
      }

      if (result.paragraphs && result.paragraphs.length && result.paragraphs.length > 0) {
        for (let i = 0; i < result.paragraphs.length; ++i) {
          if (result.paragraphs[i].pt == 2) {
            result.paragraphs[i].imgHashName = getImageHashName(result.paragraphs[i].imgURL, mapResponse);
            result.paragraphs[i].imgURL = undefined;
          }
        }
      }

      if (mode == 'pb') {
        saveMessage(outputfile, result);
      }
    }

    if (mode == 'pdf') {
      await page.pdf({
        path: outputfile,
        format: pdfformat,
      });
    }
  }

  await browser.close();
}

exports.exportArticle = exportArticle;
