const {startBrowser} = require('../browser');
const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {parseBookURL} = require('./utils');
const log = require('../log');
const {download} = require('../request');
const fs = require('fs');
const path = require('path');

/**
 * downloadComic - download comic
 * @param {boolean} isdebug - is debug mode
 * @param {string} comicid - comicid
 * @param {string} rootpath - rootpath
 * @return {error} err - error
 */
async function downloadComic(isdebug, comicid, rootpath) {
  const browser = await startBrowser(!isdebug);
  const timeout = 3 * 60 * 1000;

  const manhuaret = await manhuadbManhua(browser, comicid, timeout);
  if (manhuaret.error) {
    log.error('downloadComic error ', manhuaret.error);
  }

  for (let i = 0; i < manhuaret.ret.books.length; ++i) {
    const curret = parseBookURL(manhuaret.ret.books[i].url);
    const curbookret = await downloadBook(
        browser,
        curret.comicid,
        curret.bookid,
        path.join(rootpath, manhuaret.ret.books[i].name),
        timeout,
    );
    if (curbookret) {
      log.error('downloadBook error ', curbookret);
    }
  }

  return undefined;
}

/**
 * downloadBook - download book
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {string} rootpath - rootpath
 * @param {int} timeout - timeout
 * @return {error} err - error
 */
async function downloadBook(browser, comicid, bookid, rootpath, timeout) {
  const lst = [];
  const ret = await manhuadbBook(browser, comicid, bookid, 1, timeout);
  if (ret.error) {
    return ret.error;
  }

  download(ret.ret.pages[0].url).then((ret) => {
    if (ret.error) {
      log.error(
          'downloadBook.download ' + ret.pages[0].url + ' error ',
          ret.error,
      );
    }

    fs.writeFileSync(path.join(rootpath, '1.jpg'), ret.buf);
  });

  lst.push(ret.ret.pages[0].url);
  // fs.writeFileSync(path.join(rootpath, '1.jpg'), ret.pages[0].data);

  for (let i = 2; i <= ret.ret.pageNums; ++i) {
    const curret = await manhuadbBook(browser, comicid, bookid, i, timeout);
    if (curret.error) {
      return curret.error;
    }

    download(curret.ret.pages[0].url).then((ret) => {
      if (ret.error) {
        log.error(
            'downloadBook.download ' + curret.pages[0].url + ' error ',
            ret.error,
        );
      }

      fs.writeFileSync(path.join(rootpath, i + '.jpg'), ret.buf);
    });

    lst.push(curret.ret.pages[0].url);
    // fs.writeFileSync(path.join(rootpath, i + '.jpg'), curret.pages[0].data);
  }

  return undefined;
}

exports.downloadComic = downloadComic;
