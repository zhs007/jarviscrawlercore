const puppeteer = require('puppeteer');

/**
 * startBrowser
 * @param {bool} headless - headless modes
 */
async function startBrowser(headless) {
  return await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
}

exports.startBrowser = startBrowser;
