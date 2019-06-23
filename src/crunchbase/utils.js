const {sleep} = require('../utils');

/**
 * reCAPTCHA
 * @param {object} browser - browser
 * @param {object} page - page
 * @param {string} url - url
 */
async function reCAPTCHA(browser, page, url) {
  let urlresponse = 0;
  let url403 = false;
  let domcontentloadedtimes = 0;

  page.on('domcontentloaded', () => {
    ++domcontentloadedtimes;
  });
  page.on('response', async (response) => {
    if (response.url() == url) {
      ++urlresponse;

      if (response.status() == 403) {
        url403 = true;
      }
    }
  });

  await page.goto(url).catch((err) => {
    console.log('reCAPTCHA.goto', err);
  });

  while (true) {
    await sleep(100);

    if (urlresponse == 2 && domcontentloadedtimes == 2) {
      break;
    }
  }

  return url403;
}

exports.reCAPTCHA = reCAPTCHA;
