// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * lieyunwangNewsFlashes - lieyunwang newsflashes
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function lieyunwangNewsFlashes(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthersEx(page, (req) => {
    const url = req.url();
    if (url.indexOf('openx.net') >= 0) {
      return true;
    }

    return false;
  });

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
    log.error('lieyunwangNewsFlashes.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.lieyunwang.com/news';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('lieyunwangNewsFlashes.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('lieyunwangNewsFlashes.waitDone timeout');

    log.error('lieyunwangNewsFlashes.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.news1-item', (eles) => {
        const lst = [];

        for (let i = 0; i < eles.length; ++i) {
          const curnode = {};

          const lsttitle = eles[i].getElementsByClassName('news1-title');
          if (lsttitle.length > 0) {
            curnode.title = lsttitle[0].innerText;
          }

          const lsta = eles[i].getElementsByTagName('a');
          if (lsta.length > 0) {
            curnode.url = lsta[0].href;
          }

          const lstsummary = eles[i].getElementsByClassName(
              'news1-content xianzhi',
          );
          if (lstsummary.length > 0) {
            curnode.summary = lstsummary[0].innerText;
          }

          const lstlink = eles[i].getElementsByClassName('news1-link');
          if (lstlink.length > 0) {
            curnode.srclink = lstlink[0].href;
          }

          lst.push(curnode);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('lieyunwangNewsFlashes.$$eval .news1-item', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.lieyunwangNewsFlashes = lieyunwangNewsFlashes;
