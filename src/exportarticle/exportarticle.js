const puppeteer = require('puppeteer');
const {mgrPlugins} = require('../../plugins/exportarticle/index');

/**
 * export article to a pdf file or a jpg file.
 * @param {string} url - URL
 * @param {string} pdffile - pdf filename
 * @param {string} pdfformat - pdf format, like A4
 * @param {string} jpgfile - jpg filename
 */
async function exportArticle(url, pdffile, pdfformat, jpgfile) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
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

  if (jpgfile && jpgfile != '') {
    await page.screenshot({
      path: jpgfile,
      type: 'jpeg',
      quality: 60,
      fullPage: true,
    });
  }

  await mgrPlugins.procTask(url, page);

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
