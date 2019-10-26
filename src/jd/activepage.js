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
 * jdActivePage - jd active page
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdActivePage(browser, url, timeout) {
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
    log.error('jdActivePage.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto(url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdActivePage.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearCookies(page);
  if (awaiterr) {
    log.error('jdActivePage.clearCookies', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearSessionStorage(page);
  if (awaiterr) {
    log.error('jdActivePage.clearSessionStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearLocalStorage(page);
  if (awaiterr) {
    log.error('jdActivePage.clearLocalStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearIndexedDB(page);
  if (awaiterr) {
    log.error('jdActivePage.clearIndexedDB', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('jdActivePage.waitDone timeout.');

    log.error('jdActivePage.waitDone ', err);

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
    log.error('jdActivePage.a', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const lstitems = await page
      .evaluate(() => {
        const lstitems = [];
        if (window.__react_data__ && window.__react_data__.pageData) {
          const floorList = window.__react_data__.pageData.floorList;
          if (floorList && floorList.length > 0) {
            for (let i = 0; i < floorList.length; ++i) {
              if (
                floorList[i].hotZone &&
              floorList[i].hotZone.hotZonesList &&
              floorList[i].hotZone.hotZonesList.length > 0
              ) {
                for (
                  let j = 0;
                  j < floorList[i].hotZone.hotZonesList.length;
                  ++j
                ) {
                  const cz = floorList[i].hotZone.hotZonesList[j];
                  if (cz.jump && cz.jump.params) {
                    if (cz.jump.params.url) {
                      if (cz.jump.params.url.indexOf('//item.jd.com/') == 0) {
                        const ci = cz.jump.params.url
                            .split('//item.jd.com/')[1]
                            .split('.html')[0];
                        lstitems.push(ci + '.html');
                      }
                    } else if (cz.jump.params.skuId) {
                      lstitems.push(cz.jump.params.skuId + '.html');
                    }
                  }
                }
              }
            }
          }
        }

        return lstitems;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdActivePage.__react_data__ ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  for (let i = 0; i < lstitems.length; ++i) {
    ret.urlProduct.push(lstitems[i]);
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

    log.error('jdActivePage.isban ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.jdActivePage = jdActivePage;
