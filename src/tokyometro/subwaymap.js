// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * tokyometroSubwaymap - tokyometro subwaymap
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tokyometroSubwaymap(browser, timeout) {
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
    log.error('tokyometroSubwaymap.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.tokyometro.jp/cn/subwaymap/index.html';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tokyometroSubwaymap.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tokyometroSubwaymap.waitDone timeout');

    log.error('tokyometroSubwaymap.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.v2_link', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            if (
              eles[i].href.indexOf(
                  'https://www.tokyometro.jp/lang_cn/station/line',
              ) >= 0
            ) {
              lst.push({
                name: eles[i].innerText,
                url: eles[i].href,
              });
            }
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tokyometroSubwaymap.$$eval .v2_link', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lines: lst};

  return {ret: ret};
}

exports.tokyometroSubwaymap = tokyometroSubwaymap;
