// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {closeDialog, procSKU} = require('./utils');
// const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * manhuaguiManhua - manhuagui manhua
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function manhuaguiManhua(browser, comicid, timeout) {
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
    log.error('manhuaguiManhua.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.manhuagui.com/comic/' + comicid + '/';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('manhuaguiManhua.goto ' + baseurl, awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('manhuaguiManhua.waitDone timeout');

    log.error('manhuaguiManhua.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.name = await page
      .$$eval('h1', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuaguiManhua.$$eval h1', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.authors = await page
      .$$eval('.book-detail.pr.fr', (eles) => {
        if (eles.length > 0) {
          const lsta = eles[0].getElementsByTagName('a');
          const lst = [];
          for (let i = 0; i < lsta.length; ++i) {
            if (lsta[i].href.indexOf('https://www.manhuagui.com/author/') == 0) {
              lst.push(lsta[i].innerText);
            }
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuaguiManhua.$$eval .book-detail.pr.fr', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const lstrootname = await page
      .$$eval('h4', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            lst.push(eles[i].innerText);
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuaguiManhua.$$eval h4', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.books = await page
      .$$eval('#chapter-list-0', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            const lsta = eles[i].getElementsByTagName('a');
            for (let j = 0; j < lsta.length; ++j) {
              lst.push({
                title: lsta[j].title,
                url: lsta[j].href,
                name: lsta[j].title,
                rootType: i,
              });
            }
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuaguiManhua.$$eval #chapter-list-0', awaiterr);

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

exports.manhuaguiManhua = manhuaguiManhua;
