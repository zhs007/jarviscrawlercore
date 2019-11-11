const {sleep} = require('../utils');
const {getURLCode} = require('./utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');

/**
 * mountainstealsSale - mountainsteals sale
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function mountainstealsSale(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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
    log.error('mountainstealsSale.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://www.mountainsteals.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('mountainstealsSale.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('mountainstealsSale.waitDone timeout');

    log.error('mountainstealsSale.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval(
          '.prod-item.prod-item--three.prod-item--two-tablet.prod-item--one-mobile.prod-item--bdb.plp-search-item',
          (eles) => {
            const lst = [];

            for (let i = 0; i < eles.length; ++i) {
              const cu = eles[i].getElementsByTagName('a');
              if (cu.length > 0) {
                lst.push(cu[0].href);
              }
            }

            return lst;
          }
      )
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: err};
  }

  for (let i = 0; i < lst.length; ++i) {
    lst[i] = getURLCode(lst[i]);
  }

  await page.close();

  return {ret: {products: lst}};
}

exports.mountainstealsSale = mountainstealsSale;
