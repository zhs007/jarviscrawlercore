const puppeteer = require('puppeteer');

/**
 * startBrowser
 * @param {bool} headless - headless modes
 */
async function startBrowser(headless) {
  if (!headless) {
    return await puppeteer.launch({
      headless: false,
      devtools: true,
      slowMo: 10,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
  }

  return await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
}

exports.startBrowser = startBrowser;
