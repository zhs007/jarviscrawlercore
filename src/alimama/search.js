const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {login, checkNeedLogin} = require('./utils');

/**
 * alimamaSearch - alimama search
 * @param {object} browser - browser
 * @param {string} text - text
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function alimamaSearch(browser, text, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = 'https://pub.alimama.com/promo/search/index.htm';
  checkNeedLogin(page, url);

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
    log.error('jdActive.setViewport', awaiterr);

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
    log.error('jdActive.goto', awaiterr);

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

  await login(page, 'aaa', 'bbb');

  await page.close();

  return {ret: ret};
}

exports.alimamaSearch = alimamaSearch;
