// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
// const {closeDialog, procSKU} = require('./utils');
// const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * manhuadbBook - manhuadb book
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {string} pageindex - pageindex
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function manhuadbBook(browser, comicid, bookid, pageindex, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  const waitAllResponse = new WaitAllResponse(page);

  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });

  // let imgbuf;
  // //   let inititemdetail;
  // page.on('response', async (res) => {
  //   let url = await res.url();

  //   url = url.toLowerCase();
  //   const arr = url.split('.');
  //   if (arr[arr.length - 1] == 'jpg') {
  //     imgbuf = await res.buffer().catch((err) => {
  //       log.error('manhuadbBook.WaitAllResponse.buffer ' + err);
  //     });
  //   }
  // });

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
    log.error('manhuadbBook.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let baseurl;
  if (pageindex == 1) {
    baseurl =
      'https://www.manhuadb.com/manhua/' + comicid + '/' + bookid + '.html';
  } else {
    baseurl =
      'https://www.manhuadb.com/manhua/' +
      comicid +
      '/' +
      bookid +
      '_p' +
      pageindex +
      '.html';
  }

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('manhuadbBook.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('manhuadbBook.waitDone timeout');

    log.error('manhuadbBook.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.pageNums = await page
      .$$eval('select', (eles) => {
        if (eles.length > 0) {
          return eles[0].length;
        }

        return 0;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbBook.$$eval select', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const imgurl = await page
      .$$eval('.img-fluid.show-pic', (eles) => {
        if (eles.length > 0) {
          return eles[0].src;
        }

        return 0;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbBook.$$eval select', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // while (true) {
  //   if (imgbuf != undefined) {
  //     break;
  //   }

  //   await sleep(1000);
  // }

  ret.pages = [{url: imgurl, pageIndex: pageindex}];

  await page.close();

  return {ret: ret};
}

exports.manhuadbBook = manhuadbBook;
