// const {sleep} = require('../utils');
// const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
// const {closeDialog, procSKU} = require('./utils');
const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * manhuadbManhua - manhuadb manhua
 * @param {object} browser - browser
 * @param {string} manhuaid - manhuaid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function manhuadbManhua(browser, manhuaid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  //   const waitAllResponse = new WaitAllResponse(page);

  //   let inititemdetail;
  //   page.on('response', async (res) => {
  //     const url = res.url();

  //     if (url.indexOf('https://mdskip.taobao.com/core/initItemDetail.htm') == 0) {
  //       inititemdetail = await res.buffer().catch((err) => {
  //         log.error('tmallDetail.WaitAllResponse.buffer ' + err);
  //       });
  //     }
  //   });

  //   let noretry = 0;
  //   page.on('framenavigated', (f) => {
  //     if (f == page.mainFrame()) {
  //       if (
  //         f
  //             .url()
  //             .indexOf('https://huodong.taobao.com/wow/malldetail/act/guide-tb?') ==
  //         0
  //       ) {
  //         noretry = 1;
  //       }
  //     }
  //   });

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
    log.error('manhuadbManhua.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.manhuadb.com/manhua/' + manhuaid;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('manhuadbManhua.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('manhuadbManhua.waitDone timeout');

    log.error('manhuadbManhua.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.books = await page
      .$$eval('#comic-book-list', (eles) => {
        if (eles.length > 0) {
          const lstol = eles[0].getElementsByTagName('ol');
          if (lstol.length > 0) {
            const lsta = lstol[0].getElementsByTagName('a');
            if (lsta.length > 0) {
              const lst = [];

              for (let i = 0; i < lsta.length; ++i) {
                lst.push({
                  title: lsta[i].title,
                  url: lsta[i].href,
                });
              }

              return lst;
            }
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbManhua.$$eval #comic-book-list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.manhuadbManhua = manhuadbManhua;
