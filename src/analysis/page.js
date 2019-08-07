const {sleep, hashMD5} = require('../utils');

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
  for (let i = 0; i < reqs.length; ++i) {
    if (reqs[i].status == 0) {
      return false;
    }
  }

  return true;
}

/**
 * analyze page
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} delay - delay in seconds
 * @return {object} result - {error: err, ret: ret}
 */
async function analyzePage(browser, url, delay) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);

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
      const buf = await res.buffer();
      req.buflen = buf.byteLength;

      req.et = Date.now();
      req.status = res.status();
    } else {
      console.log('no response', url);
    }
  });

  let pagegotoerr = undefined;

  await page.goto(url).catch((err) => {
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

  await page.close();

  const ret = {
    pageTime: pageet - pagebt,
    pageBytes: 0,
    errs: lstErr,
  };

  if (lstReq.length > 0) {
    ret.reqs = [];

    for (let i = 0; i < lstReq.length; ++i) {
      ret.reqs.push({
        url: lstReq[i].url,
        downloadTime: lstReq[i].et - lstReq[i].bt,
        status: lstReq[i].status,
        buflen: lstReq[i].buflen,
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
