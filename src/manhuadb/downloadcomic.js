const {startBrowser} = require('../browser');
const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {parseBookURL, isValidURL} = require('./utils');
const log = require('../log');
const {DownloadList} = require('../request');
const {sleep} = require('../utils');
const fs = require('fs');
const path = require('path');

/**
 * downloadComic - download comic
 * @param {boolean} isdebug - is debug mode
 * @param {string} comicid - comicid
 * @param {int} roottype - roottype, -1,0,1...
 * @param {string} rootpath - rootpath
 * @return {error} err - error
 */
async function downloadComic(isdebug, comicid, roottype, rootpath) {
  try {
    fs.mkdirSync(rootpath);
  } catch (err) {
    log.error('downloadComic mkdirSync error ', err);
  }

  const browser = await startBrowser(!isdebug);
  const timeout = 30 * 1000;
  const dl = new DownloadList();
  let manhuaret;

  while (true) {
    manhuaret = await manhuadbManhua(browser, comicid, timeout);
    if (manhuaret.error) {
      log.error('downloadComic error ', manhuaret.error);

      await sleep(30 * 1000);
    } else {
      break;
    }
  }

  (async () => {
    await dl.run();
  })();

  for (let i = 0; i < manhuaret.ret.books.length; ++i) {
    if (roottype >= 0 && roottype != manhuaret.ret.books[i].rootType) {
      continue;
    }

    const curret = parseBookURL(manhuaret.ret.books[i].url);
    const curbookret = await downloadBook(
        browser,
        curret.comicid,
        curret.bookid,
        path.join(rootpath, manhuaret.ret.books[i].name),
        timeout,
        dl,
    );
    if (curbookret) {
      log.error('downloadBook error ', curbookret);
    }
  }

  while (true) {
    if (dl.isFinished()) {
      break;
    }

    await sleep(1000);
  }

  fs.writeFileSync(
      path.join(rootpath, comicid + '.json'),
      JSON.stringify(manhuaret.ret),
  );

  return undefined;
}

/**
 * checkBook - check book
 * @param {string} rootpath - rootpath
 * @param {int} pagenums - pagenums
 * @return {array} lstpageindex - list for pageindex
 */
function checkBook(rootpath, pagenums) {
  const lst = [];
  for (let i = 1; i <= pagenums; ++i) {
    const fn = path.join(rootpath, i + '.jpg');
    if (!fs.existsSync(fn)) {
      lst.push(i);
    }
  }

  return lst;
}

/**
 * downloadBook - download book
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {string} rootpath - rootpath
 * @param {int} timeout - timeout
 * @param {object} dl - DownloadList
 * @return {error} err - error
 */
async function downloadBook(browser, comicid, bookid, rootpath, timeout, dl) {
  try {
    fs.mkdirSync(rootpath);
  } catch (err) {
    log.error('downloadBook mkdirSync error ', err);
  }

  let ret;
  const lst = [];
  let lastpi;
  while (true) {
    ret = await manhuadbBook(browser, comicid, bookid, 1, timeout);
    if (ret.error) {
      log.error('downloadBook.manhuadbBook error', ret.error);

      await sleep(30 * 1000);

      continue;
    }

    lastpi = checkBook(rootpath, ret.ret.pageNums);

    if (lastpi[0] == 1) {
      if (!isValidURL(ret.ret.pages[0].url)) {
        log.error('downloadBook.manhuadbBook isValidURL', {
          url: ret.ret.pages[0].url,
        });

        await sleep(30 * 1000);

        continue;
      }

      dl.addTask(
          ret.ret.pages[0].url,
          (buf, param) => {
            fs.writeFileSync(path.join(param.rootpath, param.pi + '.jpg'), buf);
          },
          {rootpath: rootpath, pi: 1},
      );

      lst.push(ret.ret.pages[0].url);
    }

    break;
  }

  for (let i = 0; i < lastpi.length; ++i) {
    if (lastpi[i] == 1) {
      continue;
    }

    while (true) {
      const curret = await manhuadbBook(
          browser,
          comicid,
          bookid,
          lastpi[i],
          timeout,
      );
      if (curret.error) {
        log.error('downloadBook.manhuadbBook error', curret.error);

        await sleep(30 * 1000);

        continue;
      }

      log.debug('downloadBook.manhuadbBook ok', curret);

      if (!isValidURL(curret.ret.pages[0].url)) {
        log.error('downloadBook.manhuadbBook isValidURL', {
          url: curret.ret.pages[0].url,
        });

        await sleep(30 * 1000);

        continue;
      }

      dl.addTask(
          curret.ret.pages[0].url,
          (buf, param) => {
            fs.writeFileSync(path.join(param.rootpath, param.pi + '.jpg'), buf);
          },
          {rootpath: rootpath, pi: lastpi[i]},
      );

      lst.push(curret.ret.pages[0].url);

      break;
    }
  }

  return undefined;
}

exports.downloadComic = downloadComic;
