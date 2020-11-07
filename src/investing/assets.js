// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * investingAssets - investing get assets
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function investingAssets(browser, url, timeout) {
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
    log.error('investingAssets.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // const baseurl = 'https://cn.investing.com/' + url;
  const baseurl = url;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('investingAssets.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('investingAssets.waitDone timeout');

    log.error('investingAssets.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('td.elp.plusIconTd', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            const lsta = eles[i].getElementsByTagName('a');
            if (lsta.length > 0) {
              lst.push({
                name: lsta[0].innerText,
                url: lsta[0].href,
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
    log.error('investingAssets.$$eval td.elp.plusIconTd', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: []};

  for (let i = 0; i < lst.length; ++i) {
    const ci = {
      name: lst[i].name,
      url: lst[i].url,
      // resid: parseID(lst[i].url),
    };

    ret.lst.push(ci);
  }

  return {ret: ret};
}

exports.investingAssets = investingAssets;
