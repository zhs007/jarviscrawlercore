const {sleep} = require('../utils');
const log = require('../log');

/**
 * jdProduct - jd product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdProduct(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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
    log.error('jdProduct.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://item.jd.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: {}};
}

exports.jdProduct = jdProduct;
