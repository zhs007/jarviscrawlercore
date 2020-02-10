// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {closeDialog, procSKU} = require('./utils');
// const {waitForLocalFunction, waitForFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * manhuadbAuthor - manhuadb author
 * @param {object} browser - browser
 * @param {string} authorid - authorid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function manhuadbAuthor(browser, authorid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
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
    log.error('manhuadbAuthor.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.manhuadb.com/author/' + authorid;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('manhuadbAuthor.goto ' + baseurl, awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('manhuadbAuthor.waitDone timeout');

    log.error('manhuadbAuthor.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.detail = await page
      .$$eval('.comic-detail-section', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbAuthor.$$eval .comic-detail-section', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const authorret = await page
      .$$eval('.card-title', (eles) => {
        if (eles.length > 0) {
          const authorret = {
            name: eles[0].childNodes[0].data,
          };

          const lstspan = eles[0].getElementsByTagName('span');
          if (lstspan.length > 0) {
            authorret.otherName = [];
            for (let i = 0; i < lstspan.length; ++i) {
              authorret.otherName.push(lstspan[i].innerText);
            }
          }

          return authorret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbAuthor.$$eval .card-title', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (authorret) {
    if (authorret.name) {
      ret.name = authorret.name;
    }

    if (authorret.otherName) {
      ret.otherName = authorret.otherName;
    }
  }

  ret.manhua = await page
      .$$eval('.comic-book-unit', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            const curmh = {};
            const lstimg = eles[i].getElementsByTagName('img');
            if (lstimg.length > 0) {
              curmh.cover = lstimg[0].src;
            }

            const lsth2 = eles[i].getElementsByTagName('h2');
            if (lsth2.length > 0) {
              const lsta = lsth2[0].getElementsByTagName('a');
              if (lsta.length > 0) {
                curmh.name = lsta[0].innerText;
                curmh.url = lsta[0].href;
              }
            }

            const cc = eles[i].getElementsByClassName('comic-creators');
            if (cc.length > 0) {
              curmh.authors = [];
              const lstli = cc[0].getElementsByTagName('li');
              for (let j = 0; j < lstli.length; ++j) {
                curmh.authors.push(lstli[j].innerText);
              }
            }

            lst.push(curmh);
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('manhuadbAuthor.$$eval #comic-book-list', awaiterr);

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

exports.manhuadbAuthor = manhuadbAuthor;
