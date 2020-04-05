// const {sleep} = require('../utils');
const {waitForLocalFunction} = require('../waitutils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownload} = require('../page.utils');
// const {closeDialog, procSKU} = require('./utils');
// const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * tvbsmhBook - tvbsmh book
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {string} pageindex - pageindex
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tvbsmhBook(browser, comicid, bookid, pageindex, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  if (pageindex <= 0) {
    pageindex = 1;
  }

  await disableDownload(page, (req) => {
    const rt = req.resourceType();
    if (rt == 'media' || rt == 'font') {
      return true;
    } else if (rt === 'image') {
      if (req.url().indexOf('https://img.tvbsmh.com/img/') != 0) {
        return true;
      }
    } else {
      const url = req.url();
      if (
        url.indexOf('propellerclick.com') >= 0 ||
        url.indexOf('runative-syndicate.com') >= 0 ||
        url.indexOf('run-syndicate.com') >= 0
      ) {
        return true;
      }
    }

    return false;
  });

  const mapimgbuf = {};
  page.on('response', (res) => {
    const url = res.url();
    if (url.indexOf('https://img.tvbsmh.com/img/') != 0) {
      return;
    }

    // log.info('manhuaguiBook.response ' + pageindex + ' url is ' + url);

    res.buffer().then((buf) => {
      mapimgbuf[url] = buf;

      // log.info(
      //     'manhuaguiBook.response end ' +
      //     pageindex +
      //     ' url is ' +
      //     url +
      //     ' len is ' +
      //     mapimgbuf[url].length,
      // );
    });
    // mapimgbuf[url] = await res.buffer();

    // log.info(
    //     'manhuaguiBook.response end ' +
    //     pageindex +
    //     ' url is ' +
    //     url +
    //     ' len is ' +
    //     mapimgbuf[url].length,
    // );
  });
  // await page.setRequestInterception(true);
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
    log.error('tvbsmhBook.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl =
    'https://www.tvbsmh.com/series-' + comicid + '-' + bookid + '-' + pageindex;
  // let baseurl = '';
  // if (pageindex == 1) {
  //   baseurl =
  //     'https://www.manhuagui.com/comic/' + comicid + '/' + bookid + '.html';
  // } else {
  //   baseurl =
  //     'https://www.manhuagui.com/comic/' +
  //     comicid +
  //     '/' +
  //     bookid +
  //     '.html#p=' +
  //     pageindex;
  // }

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tvbsmhBook.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tvbsmhBook.waitDone timeout');

    log.error('tvbsmhBook.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.pageNums = await page
      .$$eval('div.num', (eles) => {
        if (eles.length > 0) {
          const lsta = eles[0].getElementsByTagName('a');
          if (lsta.length > 0) {
            return parseInt(lsta[lsta.length - 1].innerText);
          }
        }

        return 0;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tvbsmhBook.$$eval div.num', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // if (pageindex > 1) {
  //   await page.select('#pageSelect', pageindex.toString()).catch((err) => {
  //     awaiterr = err;
  //   });

  //   await sleep(1000);

  //   const isdoneselect = await waitAllResponse.waitDone(timeout);
  //   if (!isdoneselect) {
  //     const err = new Error('manhuaguiBook.waitDone select timeout');

  //     log.error('manhuaguiBook.waitDone select', err);

  //     await page.close();

  //     return {error: err.toString()};
  //   }

  //   if (awaiterr) {
  //     log.error('manhuaguiBook.select', awaiterr);

  //     await page.close();

  //     return {error: awaiterr.toString()};
  //   }
  // }

  const imgurl = await page
      .$$eval('.ptview', (eles) => {
        if (eles.length > 0) {
          const lstimg = eles[0].getElementsByTagName('img');
          if (lstimg.length > 0) {
            return lstimg[0].src;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tvbsmhBook.$$eval .ptview', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await waitForLocalFunction(
      page,
      () => {
        return mapimgbuf[imgurl] != undefined;
      },
      1000,
      timeout,
  );
  // while (!mapimgbuf[imgurl]) {
  //   await sleep(1000);
  // }

  ret.pages = [
    {url: imgurl, pageIndex: pageindex, imgbuf: mapimgbuf[imgurl]},
  ];

  await page.close();

  return {ret: ret};
}

exports.tvbsmhBook = tvbsmhBook;
