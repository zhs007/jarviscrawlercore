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
  let frametimes = 0;
  let ct = 0;

  page.on('framenavigated', (frame) => {
    if (frame == page.mainFrame()) {
      if (frame.url() == url) {
        ++frametimes;
      }

      if (frametimes == 2) {
        ct = new Date().getTime();
      }

      console.log('mainframenavigated ' + frame.name() + ' ' + frame.url());
    }
  });

  page.on('domcontentloaded', () => {
    ++domcontentloadedtimes;
    console.log('domcontentloaded ' + domcontentloadedtimes);
  });
  page.on('response', async (response) => {
    if (response.url() == url) {
      ++urlresponse;

      if (response.status() == 403) {
        url403 = true;
      }

      console.log('response ' + urlresponse + ' ' + url403);
    }
  });
  // page.on('request', async (request) => {
  //   if (request.url() == url) {
  //     console.log('request ' + url);
  //   }
  // });

  await page.goto(url).catch((err) => {
    console.log('reCAPTCHA.goto', err);
  });

  while (true) {
    await sleep(100);

    if (urlresponse == 2 && domcontentloadedtimes == 2) {
      break;
    }

    if (ct > 0) {
      const curt = new Date().getTime();
      if (curt - ct > 5000) {
        if (urlresponse == 1 && domcontentloadedtimes == 1) {
          break;
        }
      }
    }
  }

  return url403;
}

exports.reCAPTCHA = reCAPTCHA;
