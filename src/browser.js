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

/**
 * attachBrowser
 * @param {string} host - host
 */
async function attachBrowser(host) {
  return await puppeteer.connect({browserWSEndpoint: host});
}

exports.startBrowser = startBrowser;
exports.attachBrowser = attachBrowser;
