const {sleep, hashMD5} = require('../utils');
const messages = require('../../proto/result_pb');
const {getImageInfo} = require('../imgutils');
const {IPMgr} = require('../ipmgr');

/**
 * getURL - get url
 * @param {string} url - url
 * @return {string} url - url
 */
function getURL(url) {
  if (url.indexOf('data:') == 0) {
    url = 'local:data-' + hashMD5(url);
  } else {
    // const urlinfo = new URL(url);
    const arr = url.split('?');
    return arr[0];
  }

  return url;
}

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
  // const ct = Date.now();
  // const endnums = 0;

  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].status == 0) {
      // if (!reqs[i].hasres) {
      // if (ct - reqs[i].st >= 30000) {
      //   reqs[i].status = 404;
      //   reqs[i].et = ct;

      //   ++endnums;

      //   continue;
      // }
      // }

      return false;
      // return {isfinished: false, endnums: endnums};
    }
  }

  return true;
  // return {isfinished: true, endnums: endnums};
}

/**
 * analyze page
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {object} viewport - {width, height, deviceScaleFactor,
 *    isMobile, hasTouch, isLandscape}
 * @param {object} options - {screenshots, logs, timeout, screenshotsDelay}
 * @return {object} result - {error: err, ret: ret}
 */
async function analyzePage(browser, url, viewport, options) {
  const ipmgr = new IPMgr();
  let needscreenshots = false;
  let needlogs = false;
  let timeout = 3 * 60 * 1000;
  let screenshotsDelay = 0;

  if (options) {
    if (options.screenshots) {
      needscreenshots = true;
    }

    if (options.logs) {
      needlogs = true;
    }

    if (options.timeout > 0) {
      timeout = options.timeout * 1000;
    }

    if (options.screenshotsDelay > 0) {
      screenshotsDelay = options.screenshotsDelay * 1000;
    }
  }

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  if (viewport) {
    await page.setViewport(viewport);
  }

  const pagebt = Date.now();
  const lstErr = [];
  const lstReq = [];
  const lstLogs = [];
  const lstScreenshots = [];
  let waitend = false;
  // let downloadNums = 0;

  page.on('console', (msg) => {
    if (needlogs) {
      lstLogs.push(msg.text());
    }

    if (msg.type() == 'error') {
      lstErr.push(msg.text());
    }
  });

  page.on('error', (err) => {
    lstErr.push(err.toString());

    console.log('ERROR - ' + err.toString());
  });

  page.on('request', (req) => {
    if (waitend) {
      return;
    }

    const url = getURL(req.url());

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
      hasres: false,
    });
  });

  page.on('requestfailed', async (req) => {
    if (waitend) {
      return;
    }

    const url = getURL(req.url());

    const curreq = findReq(lstReq, url);
    if (curreq) {
      if (curreq.status == 0) {
        curreq.status = -1;
        curreq.et = Date.now();
      }
    }

    console.log('requestfailed - ', url);
  });

  page.on('response', async (res) => {
    if (waitend) {
      return;
    }
    // ++downloadNums;

    const url = getURL(res.url());

    console.log('response - ', url);

    const req = findReq(lstReq, url);
    if (req) {
      req.hasres = true;

      const headers = res.headers();

      if (
        headers['content-type'] &&
        headers['content-type'].indexOf('video') == 0
      ) {
        req.et = Date.now();
        req.status = res.status();

        // --downloadNums;
        return;
      }

      if (res.status() == 302) {
        req.et = Date.now();
        req.status = res.status();

        // --downloadNums;
        return;
      }

      const buf = await res.buffer();
      req.buflen = buf.byteLength;

      req.et = Date.now();
      req.status = res.status();

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

      const remoteaddr = res.remoteAddress();
      if (remoteaddr) {
        req.remoteaddr = remoteaddr.ip + ':' + remoteaddr.port;
      }
    } else {
      console.log('no response', url);
    }

    // --downloadNums;
  });

  let pagegotoerr = undefined;

  await page.goto(url, {timeout: timeout}).catch((err) => {
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

  const startwaittime = Date.now();
  let isdone = false;
  while (true) {
    if (Date.now() - startwaittime >= timeout) {
      await page.close();

      return {error: 'timeout'};
    }

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

  if (needscreenshots) {
    if (screenshotsDelay > 0) {
      await sleep(screenshotsDelay);
    }

    let buf = await page.screenshot({
      // path: './page001.png',
      fullPage: true,
      type: 'jpeg',
      quality: 60,
    });

    isdone = false;
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

    waitend = true;

    buf = await page.screenshot({
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

    lstScreenshots.push(screenshot);
  }

  await page.close();

  const ret = {
    pageTime: pageet - pagebt,
    pageBytes: 0,
    errs: lstErr,
    logs: lstLogs,
    screenshots: lstScreenshots,
  };

  if (lstReq.length > 0) {
    ret.reqs = [];

    for (let i = 0; i < lstReq.length; ++i) {
      const curreq = {
        url: lstReq[i].url,
        downloadTime: lstReq[i].et - lstReq[i].st,
        status: lstReq[i].status,
        bufBytes: lstReq[i].buflen,
        startTime: lstReq[i].st,
        isGZip: lstReq[i].isGZip,
        contentType: lstReq[i].contentType,
        imgWidth: lstReq[i].imgWidth,
        imgHeight: lstReq[i].imgHeight,
      };

      curreq.ipaddr = await ipmgr.getIP(lstReq[i].url);

      ret.reqs.push(curreq);
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
