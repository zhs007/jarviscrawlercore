const puppeteer = require('puppeteer');

/**
 * export article to a pdf file or a jpg file.
 * @param {string} url - URL
 * @param {string} outputfile - output file
 */
async function tracing(url, outputfile) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  //   await page.tracing.start({screenshots: true, path: outputfile});
  await page.tracing.start({path: outputfile});
  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  await page.tracing.stop();

  await browser.close();

  process.exit(0);
}

exports.tracing = tracing;
