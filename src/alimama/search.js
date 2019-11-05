const log = require('../log');
const {sleep, closeAllPagesEx} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');
const {
  getProducts,
  waitAllProducts,
  checkNeedLogin,
  login,
} = require('./utils');

/**
 * alimamaSearch - alimama search
 * @param {object} browser - browser
 * @param {string} text - text
 * @param {object} cfg - config
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function alimamaSearch(browser, text, cfg, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = 'https://pub.alimama.com/promo/search/index.htm';
  checkNeedLogin(page, url);

  const waitAllResponse = new WaitAllResponse(page);
  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const cururl = frame.url();

    return cururl.indexOf(url) == 0;
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
    log.error('alimamaSearch.setViewport', awaiterr);

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
    log.error('alimamaSearch.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('alimamaSearch.waitDone timeout.');

    log.error('alimamaSearch.waitDone ', err);

    await page.close();

    return {error: err};
  }

  waitAllResponse.reset();

  if (cfg) {
    const loginret = await login(page, cfg.username, cfg.password);
    if (loginret.err) {
      log.error('alimamaSearch.login ', loginret.err);

      await page.close();

      return {error: loginret.err};
    }

    const isok = await waitAllResponse.waitDone(timeout);
    if (!isok) {
      const err = new Error('alimamaSearch.waitDone timeout.');

      log.error('alimamaSearch.waitDone ', err);

      await page.close();

      return {error: err};
    }

    waitAllResponse.reset();
  }

  const lstinput = await page.$$('.input.search-input').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('alimamaSearch.$$(.input.search-input) ', awaiterr);

    await page.close();

    return {error: awaiterr};
  }

  if (lstinput.length <= 0) {
    const err = new Error('alimamaSearch.$$(.input.search-input) non-input.');

    log.error('alimamaSearch.$$(.input.search-input) ', err);

    await page.close();

    return {error: err};
  }

  await lstinput[0].hover();
  await lstinput[0].type(text, {delay: 10});

  // const lstbtn = await page.$$('.btn.btn-brand.search-btn').catch((err) => {
  //   awaiterr = err;
  // });
  // if (awaiterr) {
  //   log.error('alimamaSearch.$$(.btn.btn-brand.search-btn) ', awaiterr);

  //   await page.close();

  //   return {error: awaiterr};
  // }

  // if (lstbtn.length <= 0) {
  //   const err = new Error(
  //       'alimamaSearch.$$(.btn.btn-brand.search-btn) non-input.'
  //   );

  //   log.error('alimamaSearch.$$(.btn.btn-brand.search-btn) ', err);

  //   await page.close();

  //   return {error: err};
  // }

  // await lstbtn[0].hover();
  // await sleep(300 + Math.floor(Math.random() * 200));

  waitchgpage.resetex();
  waitAllResponse.reset();

  await lstinput[0].type(String.fromCharCode(13));
  // await lstbtn[0].click();

  await waitchgpage.waitDone(timeout);
  await waitAllResponse.waitDone(timeout);

  const retWaitAllProducts = await waitAllProducts(
      page,
      waitAllResponse,
      timeout
  );
  if (retWaitAllProducts) {
    log.error('alimamaSearch.waitAllProducts ', retWaitAllProducts);

    await page.close();

    return {error: retWaitAllProducts};
  }

  const ret = await getProducts(page);
  if (ret.error) {
    log.error('alimamaSearch.getProducts ', ret.error);

    await page.close();

    return {error: ret.error};
  }

  await page.close();

  await closeAllPagesEx(browser, 6);

  return {ret: {text: text, products: ret.lst}};
}

exports.alimamaSearch = alimamaSearch;
