// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * com36krNewsFlashes - 36kr newsflashes
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function com36krNewsFlashes(browser, timeout) {
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
    log.error('com36krNewsFlashes.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://36kr.com/newsflashes';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('com36krNewsFlashes.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('com36krNewsFlashes.waitDone timeout');

    log.error('com36krNewsFlashes.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.newsflash-item', (eles) => {
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curnode = {};

          const lsttitle = eles[i].getElementsByClassName('item-title');
          if (lsttitle.length > 0) {
            curnode.title = lsttitle[0].innerText;
            curnode.url = lsttitle[0].href;
          }

          const lstinfo = eles[i].getElementsByClassName('item-desc');
          if (lstinfo.length > 0) {
            const cn = lstinfo[0];
            for (let j = 0; j < cn.childNodes.length; ++j) {
              if (cn.childNodes[j].nodeName == '#text') {
                curnode.summary = cn.childNodes[j].nodeValue;
                break;
              }
            }

            const lsta = cn.getElementsByTagName('a');
            if (lsta.length > 0) {
              curnode.srclink = lsta[0].href;
            }
          }

          lst.push(curnode);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('com36krNewsFlashes.$$eval .newsflash-item', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.com36krNewsFlashes = com36krNewsFlashes;
