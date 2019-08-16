const puppeteer = require('puppeteer');

/**
 * startBrowser
 * @param {bool} headless - headless modes
 * @param {number} slowmo - slowMo
 */
async function startBrowser(headless, slowmo) {
  if (!headless) {
    return await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: slowmo,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
      ],
    });
  }

  return await puppeteer.launch({
    headless: headless,
    slowMo: slowmo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
    ],
  });
}

exports.startBrowser = startBrowser;
