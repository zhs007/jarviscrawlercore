const {sleep} = require('../utils');

/**
 * mountainstealsSale - mountainsteals sale
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} pageid - pageid, is like 1, 2, 3
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function mountainstealsSale(browser, url, pageid, timeout) {
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
    console.log('mountainstealsSale.setViewport', awaiterr);

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
    console.log('mountainstealsSale.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  return {ret: {}};
}

exports.mountainstealsSale = mountainstealsSale;
