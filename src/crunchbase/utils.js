const {sleep, mouseHoldFrameEleEx} = require('../utils');
const log = require('../log');

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

      log.debug('mainframenavigated ' + frame.name() + ' ' + frame.url());
    }
  });

  page.on('domcontentloaded', () => {
    ++domcontentloadedtimes;
    log.debug('domcontentloaded ' + domcontentloadedtimes);
  });

  page.on('response', async (response) => {
    if (response.url() == url) {
      ++urlresponse;

      if (response.status() == 403) {
        url403 = true;
      }

      log.debug('response ' + urlresponse + ' ' + url403);
    }
  });

  // page.on('request', async (request) => {
  //   if (request.url() == url) {
  //     console.log('request ' + url);
  //   }
  // });

  await page.goto(url).catch((err) => {
    log.error('reCAPTCHA.goto', err);
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
  let frameIndex = 0;
  let eleIndex = 0;
  await mouseHoldFrameEleEx(
      page,
      'div',
      async (frame) => {
        ++frameIndex;
        if (frameIndex == 1) {
          return true;
        }

        return false;
      },
      async (ele) => {
        const jspclass = await ele.getProperty('className');
        const pclass = await jspclass.toString().substr('JSHandle:'.length);
        console.log('class ' + pclass);

        const jsid = await ele.getProperty('id');
        const id = await jsid.toString().substr('JSHandle:'.length);
        console.log('id ' + id);

        if (id != '' && pclass == '' && id.indexOf('-') < 0) {
          ++eleIndex;

          if (eleIndex == 2) {
            return true;
          }
        }

        return false;
      },
      5 * 1000
  );
  // console.log(page.frames()[0].childFrames().length);
  // const pos = await page.$eval('#px-captcha', (ele) => {
  //   return {
  //     x: ele.offsetLeft + ele.offsetWidth / 2,
  //     y: ele.offsetTop + ele.offsetHeight,
  //   };
  // });
  // console.log(pos);
  // const elementHandle = await page.$('iframe');
  // const frame = await elementHandle.contentFrame();
  // await page.mouse.move(pos.x, pos.y);
  // await page.mouse.down();
  // await sleep(10 * 1000);
  // await page.mouse.up();
}

exports.reCAPTCHA = reCAPTCHA;
exports.procCAPTCHA = procCAPTCHA;
