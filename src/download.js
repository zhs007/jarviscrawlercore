const {sleep} = require('./utils');
const log = require('./log');

/**
 * getBaseURL - get base url, https://a.b.c/d?e=f => https://a.b.c/d
 * @param {string} url - url
 * @return {string} baseurl - baseurl
 */
function getBaseURL(url) {
  if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
    const arr = url.split('?');
    return arr[0];
  }

  return '';
}

/**
 * download - download a file
 * @param {object} page - if page is null, it's will new a page, and then close it
 * @param {string} url - url
 * @param {number} timeout - timeout in second
 * @return {object} ret - {error, buf}
 */
async function download(page, url, timeout) {
  let awaiterr = undefined;
  let isnewpage = false;
  if (!page) {
    page = await browser.newPage().catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('download.newPage', awaiterr);

      return {error: awaiterr};
    }

    isnewpage = true;
  }

  if (typeof timeout != 'number' || timeout <= 0) {
    timeout = 3 * 60 * 1000;
  } else {
    timeout = timeout * 1000;
  }

  const baseurl = getBaseURL(url);
  if (baseurl == '') {
    return {error: 'url fail!'};
  }

  let downloadstate = 0;
  let buf = undefined;

  const onrequest = async (req) => {
    if (downloadstate == 0 && req && req.url()) {
      const cburl = getBaseURL(req.url());
      if (cburl == baseurl) {
        downloadstate = 1;
      }
    }
  };

  const onrequestfailed = async (req) => {
    if (req && req.url()) {
      const cburl = getBaseURL(req.url());
      if (downloadstate == 1 && cburl == baseurl) {
        downloadstate = 3;
      }
    }
  };

  const onresponse = async (res) => {
    if (res && res.url()) {
      const cburl = getBaseURL(res.url());
      if (downloadstate == 1 && cburl == baseurl) {
        if (res.status() == 302) {
          downloadstate = 5;

          return;
        }

        buf = await res.buffer();
        downloadstate = 2;
      }
    }
  };

  page.on('request', onrequest);
  page.on('requestfailed', onrequestfailed);
  page.on('response', onresponse);

  await page.goto(url).catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('download.goto', awaiterr);

    return {error: awaiterr};
  }

  const startwaittime = Date.now();
  while (true) {
    if (Date.now() - startwaittime >= timeout) {
      await page.close();

      return {error: 'timeout'};
    }

    if (downloadstate > 1) {
      break;
    } else {
      await sleep(1000);
    }
  }

  if (isnewpage) {
    await page.close();
  } else {
    page.removeListener('request', onrequest);
    page.removeListener('requestfailed', onrequestfailed);
    page.removeListener('response', onresponse);
  }

  return {buf: buf};
}

exports.download = download;
