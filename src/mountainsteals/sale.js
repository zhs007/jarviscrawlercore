const {sleep} = require('../utils');
const {getURLCode} = require('./utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');
const log = require('../log');

/**
 * getProducts - get products
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, lst}
 */
async function getProducts(page, timeout) {
  let awaiterr = undefined;
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
          },
      )
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: err};
  }

  return {lst: lst};
}

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

  const baseurl = 'https://www.mountainsteals.com/' + url;

  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const url = frame.url();

    return url.toLowerCase().indexOf(baseurl) == 0;
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
    log.error('mountainstealsSale.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto(baseurl, {
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

  const lst = [];

  while (true) {
    const cret = await getProducts(page, timeout);
    if (cret.error) {
      log.error('mountainstealsSale.getProducts', cret.error);

      await page.close();

      return {error: cret.error.toString()};
    }

    for (let i = 0; i < cret.lst.length; ++i) {
      lst.push(cret.lst[i]);
    }

    const lstnp = await page
        .$$('.search-pagination-button.next-page')
        .catch((err) => {
          awaiterr = err;
        });
    if (awaiterr) {
      log.error(
          'mountainstealsSale.$$ .search-pagination-button.next-page',
          awaiterr,
      );

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (lstnp.length == 0) {
      break;
    }

    await lstnp[0].hover().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('mountainstealsSale.hover', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    waitchgpage.resetex();
    waitAllResponse.reset();

    await lstnp[0].click().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('mountainstealsSale.click', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    const isok = await waitchgpage.waitDone(timeout);
    if (!isok) {
      awaiterr = new Error('mountainstealsSale.waitchgpage.waitDone timeout');

      log.error('mountainstealsSale.waitchgpage ', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    const isdone = await waitAllResponse.waitDone(timeout);
    if (!isdone) {
      const err = new Error('waitAllResponse.waitDone timeout');

      log.error('mountainstealsSale.waitAllResponse', err);

      await page.close();

      return {error: err.toString()};
    }

    await sleep(3000);
  }

  for (let i = 0; i < lst.length; ++i) {
    lst[i] = getURLCode(lst[i]);
  }

  await page.close();

  return {ret: {products: lst}};
}

exports.mountainstealsSale = mountainstealsSale;
