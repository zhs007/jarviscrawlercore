// const {sleep} = require('../utils');
const log = require('../log');
// const {WaitAllResponse} = require('../waitallresponse');

/**
 * jdActive - jd active
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdActive(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  // const waitAllResponse = new WaitAllResponse(page);

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
    log.error('jdActive.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://pro.jd.com/mall/active/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdActive.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page
      .$$eval('a', (eles) => {
        if (eles.length > 0) {
          activeret = {
            urlActive: [],
            urlProduct: [],
          };

          for (let i = 0; i < eles.length; ++i) {
            if (eles[i].href.indexOf('https://pro.jd.com/mall/active/') == 0) {
              activeret.urlActive.push(eles[i].href.split('https://pro.jd.com/mall/active/')[1]);
            } else if (eles[i].href.indexOf('https://item.jd.com/') == 0) {
              activeret.urlProduct.push(eles[i].href.split('https://item.jd.com/')[1]);
            }
          }

          return activeret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdActive.a', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.jdActive = jdActive;
