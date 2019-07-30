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
      ],
    });
  }

  return await puppeteer.launch({
    headless: headless,
    slowMo: slowmo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
}

exports.startBrowser = startBrowser;
