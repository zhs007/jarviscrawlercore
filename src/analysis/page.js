const {sleep, hashMD5} = require('../utils');
const messages = require('../../proto/result_pb');
const {getImageInfo} = require('../imgutils');

/**
 * findReq - find a request
 * @param {array} reqs - request list
 * @param {string} url - url
 * @return {object} req - request
 */
function findReq(reqs, url) {
  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].url == url) {
      return reqs[i];
    }
  }

  return undefined;
}

/**
 * isReqFinished - is request finished?
 * @param {array} reqs - request list
 * @return {bool} isfinished - is finished
 */
function isReqFinished(reqs) {
  const ct = Date.now();

  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].status == 0) {
      if (ct - reqs[i].st >= 30000) {
        reqs[i].status = 404;
        req.et = ct;
      } else {
        return false;
      }
    }
  }

  return true;
}

/**
 * analyze page
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} delay - delay in seconds
 * @param {object} viewport - {width, height, deviceScaleFactor,
 *    isMobile, hasTouch, isLandscape}
 * @return {object} result - {error: err, ret: ret}
 */
async function analyzePage(browser, url, delay, viewport) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  if (viewport) {
    await page.setViewport(viewport);
  }

  const pagebt = Date.now();
  const lstErr = [];
  const lstReq = [];

  page.on('error', (err) => {
    lstErr.push(err.toString());

    console.log('ERROR - ' + err.toString());
  });

  page.on('request', (req) => {
    let url = req.url();
    if (url.indexOf('data:image') == 0) {
      url = 'local:imgdata-' + hashMD5(url);
    }

    const oldreq = findReq(lstReq, url);
    if (oldreq) {
      return;
    }

    console.log('request - ', url);

    lstReq.push({
      url: url,
      st: Date.now(),
      et: -1,
      status: 0,
      buflen: 0,
      contentType: '',
      isGZip: false,
      imgWidth: 0,
      imgHeight: 0,
    });
  });

  page.on('response', async (res) => {
    let url = res.url();
    if (url.indexOf('data:image') == 0) {
      url = 'local:imgdata-' + hashMD5(url);
    }

    console.log('response - ', url);

    const req = findReq(lstReq, url);
    if (req) {
      req.status = res.status();

      const headers = res.headers();

      if (headers['content-type'] && headers['content-type'].indexOf('video') == 0) {
        req.et = Date.now();

        return;
      }

      const buf = await res.buffer();
      req.buflen = buf.byteLength;

      req.et = Date.now();

      if (headers['content-type']) {
        req.contentType = headers['content-type'];
      }

      if (
        headers['content-encoding'] &&
        headers['content-encoding'].indexOf('gzip') >= 0
      ) {
        req.isGZip = true;
      }

      if (req.contentType.indexOf('image/') >= 0) {
        const ir = await getImageInfo(buf);
        if (ir) {
          req.imgWidth = ir.w;
          req.imgHeight = ir.h;
        }
      }
    } else {
      console.log('no response', url);
    }
  });

  let pagegotoerr = undefined;

  await page.goto(url, {timeout: 60000}).catch((err) => {
    console.log('analyzePage.goto', url, err);

    pagegotoerr = err;
  });
  // await page
  //     .goto(url, {
  //       waitUntil: 'networkidle2',
  //     })
  //     .catch((err) => {
  //       console.log('analyzePage.goto', url, err);

  //       pagegotoerr = err;
  //     });

  if (pagegotoerr) {
    await page.close();

    return {error: pagegotoerr};
  }

  let isdone = false;
  while (true) {
    if (isReqFinished(lstReq)) {
      if (isdone) {
        break;
      }

      await sleep(3000);

      isdone = true;
    } else {
      isdone = false;

      await sleep(1000);
    }
  }

  const pageet = Date.now();

  if (delay > 0) {
    await sleep(1000 * delay);
  }

  const buf = await page.screenshot({
    // path: './page001.png',
    fullPage: true,
    type: 'jpeg',
    quality: 60,
  });

  const screenshot = {
    name: 'screenshot.jpg',
    type: messages.AnalyzeScreenshotType.AST_JPG,
    buf: buf,
  };

  await page.close();

  const ret = {
    pageTime: pageet - pagebt,
    pageBytes: 0,
    errs: lstErr,
    screenshots: [screenshot],
  };

  if (lstReq.length > 0) {
    ret.reqs = [];

    for (let i = 0; i < lstReq.length; ++i) {
      ret.reqs.push({
        url: lstReq[i].url,
        downloadTime: lstReq[i].et - lstReq[i].st,
        status: lstReq[i].status,
        bufBytes: lstReq[i].buflen,
        startTime: lstReq[i].st,
        isGZip: lstReq[i].isGZip,
        contentType: lstReq[i].contentType,
        imgWidth: lstReq[i].imgWidth,
        imgHeight: lstReq[i].imgHeight,
      });
    }
  }

  console.log('page time is ', ret.pageTime);

  for (let i = 0; i < lstReq.length; ++i) {
    ret.pageBytes += lstReq[i].buflen;
  }

  console.log('page bytes is ', ret.pageBytes);

  console.log('err - ', JSON.stringify(lstErr));
  console.log('request - ', JSON.stringify(lstReq));

  return {
    ret: ret,
  };
}

exports.analyzePage = analyzePage;
