const {startBrowser} = require('../browser');
const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {parseBookURL} = require('./utils');
const log = require('../log');
const {DownloadList} = require('../request');
const {sleep} = require('../utils');
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
  try {
    fs.mkdirSync(rootpath);
  } catch (err) {
    log.error('downloadComic mkdirSync error ', err);
  }

  const browser = await startBrowser(!isdebug);
  const timeout = 30 * 1000;
  const dl = new DownloadList();

  const manhuaret = await manhuadbManhua(browser, comicid, timeout);
  if (manhuaret.error) {
    log.error('downloadComic error ', manhuaret.error);
  }

  (async () => {
    await dl.run();
  })();

  for (let i = 0; i < manhuaret.ret.books.length; ++i) {
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

    sleep(1000);
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
  while (true) {
    ret = await manhuadbBook(browser, comicid, bookid, 1, timeout);
    if (ret.error) {
      log.error('downloadBook.manhuadbBook error', ret.error);

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

    break;
  }

  // const lsterr = [];
  // let downloadnums = 0;
  // download(ret.ret.pages[0].url).then((cdret) => {
  //   if (cdret.error) {
  //     log.error(
  //         'downloadBook.download ' + ret.ret.pages[0].url + ' error ',
  //         cdret.error,
  //     );

  //     lsterr.push(ret.ret.pages[0].url);

  //     return;
  //   }

  //   fs.writeFileSync(path.join(rootpath, '1.jpg'), cdret.buf);
  //   downloadnums++;
  // });

  // lst.push(ret.ret.pages[0].url);
  // fs.writeFileSync(path.join(rootpath, '1.jpg'), ret.pages[0].data);

  for (let i = 2; i <= ret.ret.pageNums; ++i) {
    while (true) {
      const curret = await manhuadbBook(browser, comicid, bookid, i, timeout);
      if (curret.error) {
        log.error('downloadBook.manhuadbBook error', curret.error);

        await sleep(30 * 1000);

        continue;
      }

      dl.addTask(
          curret.ret.pages[0].url,
          (buf, param) => {
            fs.writeFileSync(path.join(param.rootpath, param.pi + '.jpg'), buf);
          },
          {rootpath: rootpath, pi: i},
      );

      lst.push(curret.ret.pages[0].url);

      break;
    }

    // download(curret.ret.pages[0].url).then((ret) => {
    //   if (ret.error) {
    //     log.error(
    //         'downloadBook.download ' + curret.pages[0].url + ' error ',
    //         ret.error,
    //     );
    //   }

    //   fs.writeFileSync(path.join(rootpath, i + '.jpg'), ret.buf);
    //   downloadnums++;
    // });

    // lst.push(curret.ret.pages[0].url);
    // fs.writeFileSync(path.join(rootpath, i + '.jpg'), curret.pages[0].data);
  }

  return undefined;
}

exports.downloadComic = downloadComic;
