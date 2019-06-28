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
    if (urlresponse == 1 && url403) {
      break;
    }

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

    await sleep(100);
  }

  return url403;
}

/**
 * procCAPTCHA
 * @param {object} browser - browser
 * @param {object} page - page
 * @param {string} url - url
 */
async function procCAPTCHA(browser, page, url) {
  console.log(page.frames()[0].childFrames().length);

  const pos = await page.$eval('#px-captcha', (ele) => {
    return {
      x: ele.offsetLeft + ele.offsetWidth / 2,
      y: ele.offsetTop + ele.offsetHeight,
    };
  });

  console.log(pos);

  const elementHandle = await page.$('iframe');
  const frame = await elementHandle.contentFrame();

  await page.mouse.move(pos.x, pos.y);
  await page.mouse.down();

  await sleep(10 * 1000);

  await page.mouse.up();
}

exports.reCAPTCHA = reCAPTCHA;
exports.procCAPTCHA = procCAPTCHA;
