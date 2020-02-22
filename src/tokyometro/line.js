// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * tokyometroLine - tokyometro line
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tokyometroLine(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
  const waitAllResponse = new WaitAllResponse(page);

  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tokyometroLine.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = url;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tokyometroLine.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tokyometroLine.waitDone timeout');

    log.error('tokyometroLine.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('td.v2_cellStation', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            lst.push(eles[i].innerText.trim());
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tokyometroLine.$$eval td.v2_cellStation', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {stations: lst};

  return {ret: ret};
}

exports.tokyometroLine = tokyometroLine;
