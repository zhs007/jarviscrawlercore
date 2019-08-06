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

    const req = findReq(lstReq, url);
    if (req) {
      req.status = res.status();

      const buf = await res.buffer();
      req.buflen = buf.byteLength;

      req.et = Date.now();
    } else {
      console.log('no response', url);
    }
  });

  await page
      .goto(url, {
        waitUntil: 'networkidle2',
      })
      .catch((err) => {
        console.log('analyzePage.goto', url, err);
      });

  const pageet = Date.now();

  if (delay > 0) {
    await sleep(1000 * delay);
  }

  await page.close();

  console.log('page time is ', pageet - pagebt);

  let curbytes = 0;
  for (let i = 0; i < lstReq.length; ++i) {
    curbytes += lstReq[i].buflen;
  }

  console.log('page bytes is ', curbytes);

  console.log('err - ', JSON.stringify(lstErr));
  console.log('request - ', JSON.stringify(lstReq));
}

exports.analyzePage = analyzePage;
