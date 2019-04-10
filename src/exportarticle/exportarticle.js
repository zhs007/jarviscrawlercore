const {mgrPlugins} = require('../../plugins/exportarticle/index');
const {
  saveMessage,
  setImageInfo,
  getImageHashName,
  newExportArticleResult,
} = require('../utils');
const {exportJPG} = require('./expjpg');

/**
 * export article to a pdf file or a jpg file.
 * @param {object} browser - browser
 * @param {string} url - URL
 * @param {string} outputfile - output file
 * @param {string} mode - mode
 * @param {string} pdfformat - pdf format, like A4
 * @param {number} jpgquality - jpg quality, like 60
 * @param {bool} jquery - attach jquery
 * @param {bool} isoutpurimages - is output images
 */
async function exportArticle(browser, url, outputfile, mode,
    pdfformat, jpgquality, jquery, isoutpurimages) {
  // const browser = await puppeteer.launch({
  //   headless: headless,
  //   args: [
  //     '--no-sandbox',
  //     '--disable-setuid-sandbox',
  //   ],
  // });

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
      await page.addScriptTag({path: './browser/jquery3.3.1.min.js'});
    }

    await page.addScriptTag({path: './browser/utils.js'});

    const ret = await mgrPlugins.exportArticle(url, page);

    if (ret) {
      ret.url = url;

      if (ret.titleImage) {
        ret.titleImage = setImageInfo(
            ret.titleImage, mapResponse, isoutpurimages);
      }

      if (ret.imgs && ret.imgs.length && ret.imgs.length > 0) {
        for (let i = 0; i < ret.imgs.length; ++i) {
          ret.imgs[i] = setImageInfo(
              ret.imgs[i], mapResponse, isoutpurimages);
        }
      }

      if (ret.paragraphs && ret.paragraphs.length &&
        ret.paragraphs.length > 0) {
        for (let i = 0; i < ret.paragraphs.length; ++i) {
          if (ret.paragraphs[i].pt == 2) {
            ret.paragraphs[i].imgHashName = getImageHashName(
                ret.paragraphs[i].imgURL, mapResponse);

            ret.paragraphs[i].imgURL = undefined;
          }
        }
      }

      const result = newExportArticleResult(ret);

      if (outputfile &&
          typeof(outputfile) == 'string' &&
          outputfile.length > 0) {
        if (mode == 'pb') {
          saveMessage(outputfile, result);
        } else if (mode == 'pdf') {
          await page.pdf({
            path: outputfile,
            format: pdfformat,
          });
        }
      }

      await page.close();

      return result;
    }
  }

  await page.close();

  return undefined;
}

exports.exportArticle = exportArticle;
