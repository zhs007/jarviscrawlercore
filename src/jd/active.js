const {
  clearCookies,
  clearSessionStorage,
  clearLocalStorage,
  clearIndexedDB,
} = require('../utils');
const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {checkBan} = require('./utils');

/**
 * jdActive - jd active
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdActive(browser, url, timeout) {
  let awaiterr = undefined;
  let banret = -1;
  const page = await browser.newPage();

  const waitAllResponse = new WaitAllResponse(page);

  checkBan(page, 'https://pro.jd.com/mall/active/' + url, (bantype) => {
    banret = bantype;
  });

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

  awaiterr = await clearCookies(page);
  if (awaiterr) {
    log.error('jdActive.clearCookies', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearSessionStorage(page);
  if (awaiterr) {
    log.error('jdActive.clearSessionStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearLocalStorage(page);
  if (awaiterr) {
    log.error('jdActive.clearLocalStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearIndexedDB(page);
  if (awaiterr) {
    log.error('jdActive.clearIndexedDB', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('jdActive.waitDone timeout.');

    log.error('jdActive.waitDone ', err);

    await page.close();

    return {erroor: err};
  }

  waitAllResponse.reset();

  const ret = await page
      .$$eval('a', (eles) => {
        if (eles.length > 0) {
          activeret = {
            urlActive: [],
            urlProduct: [],
            title: document.title,
          };

          for (let i = 0; i < eles.length; ++i) {
            if (eles[i].href.indexOf('https://pro.jd.com/mall/active/') == 0) {
              activeret.urlActive.push(
                  eles[i].href.split('https://pro.jd.com/mall/active/')[1]
              );
            } else if (eles[i].href.indexOf('https://item.jd.com/') == 0) {
              activeret.urlProduct.push(
                  eles[i].href.split('https://item.jd.com/')[1]
              );
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

  ret.url = url;

  if (banret >= 0) {
    if (banret == 0) {
      awaiterr = new Error(
          'noretry:ban ' + 'https://pro.jd.com/mall/active/' + url
      );
    } else if (banret == 1) {
      awaiterr = new Error(
          'noretry:error ' + 'https://pro.jd.com/mall/active/' + url
      );
    }

    log.error('jdActive.isban ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.jdActive = jdActive;
