// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {closeDialog, procSKU} = require('./utils');
// const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * manhuadbManhua - manhuadb manhua
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function manhuadbManhua(browser, comicid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
  // await page.setRequestInterception(true);
  const waitAllResponse = new WaitAllResponse(page);

  // page.on('request', (req) => {
  //   if (req.resourceType() === 'image') {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });

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

  const baseurl = 'https://www.manhuadb.com/manhua/' + comicid;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('manhuadbManhua.goto ' + baseurl, awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('manhuadbManhua.waitDone timeout');

    log.error('manhuadbManhua.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.name = await page
      .$$eval('.comic-title', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbManhua.$$eval .comic-title', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.authors = await page
      .$$eval('.comic-creator', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            lst.push(eles[i].innerText);
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbManhua.$$eval .comic-title', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const lstrootname = await page
      .$$eval('#myTab', (eles) => {
        if (eles.length > 0) {
          const lsta = eles[0].getElementsByTagName('a');
          if (lsta.length > 0) {
            const lst = [];
            for (let k = 0; k < lsta.length; ++k) {
              lst.push(lsta[k].innerText);
            }

            return lst;
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

  ret.books = await page
      .$$eval('#comic-book-list', (eles) => {
        if (eles.length > 0) {
          const lstol = eles[0].getElementsByTagName('ol');
          if (lstol.length > 0) {
            const lst = [];
            for (let k = 0; k < lstol.length; ++k) {
              const lsta = lstol[k].getElementsByTagName('a');
              if (lsta.length > 0) {
                for (let i = 0; i < lsta.length; ++i) {
                  lst.push({
                    title: lsta[i].title,
                    url: lsta[i].href,
                    name: lsta[i].innerText,
                    rootType: k,
                  });
                }
              }
            }

            return lst;
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

  if (ret.books && lstrootname) {
    for (let i = 0; i < ret.books.length; ++i) {
      ret.books[i].rootName = lstrootname[ret.books[i].rootType];
    }
  }

  await page.close();

  return {ret: ret};
}

exports.manhuadbManhua = manhuadbManhua;
