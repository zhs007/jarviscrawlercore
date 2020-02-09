// const {sleep} = require('../utils');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {WaitAllResponse} = require('../waitallresponse');
const {string2float, string2int} = require('../string.utils');
const {getSubobjectID} = require('./utils');
// const {WaitFrameNavigated} = require('../waitframenavigated');
// const {waitForFunction} = require('../waitutils');

/**
 * douban book
 * @param {object} browser - browser
 * @param {string} id - id
 * @param {number} timeout - timeout in microseconds
 * @return {object} result - {error: err, ret: ret}
 */
async function book(browser, id, timeout) {
  const page = await browser.newPage();
  let awaiterr;

  const baseurl = 'https://book.douban.com/subject/' + id + '/';

  await disableDownloadOthers(page);
  const waitAllResponse = new WaitAllResponse(page);
  //   const mainframe = await page.mainFrame();
  //   const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
  //     const cururl = frame.url();

  //     return cururl.indexOf(searchurl) == 0;
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
    log.error('douban.book.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('douban.book.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('douban.book.waitDone timeout');

    log.error('douban.book.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.title = await page.$$eval('h1', (eles) => {
    if (eles.length > 0) {
      return eles[0].innerText;
    }

    return undefined;
  });

  ret.cover = await page.$$eval('#mainpic', (eles) => {
    if (eles.length > 0) {
      const imgs = eles[0].getElementsByTagName('img');
      if (imgs.length > 0) {
        return imgs[0].src;
      }
    }

    return undefined;
  });

  ret.authors = await page.$$eval('#info', (eles) => {
    if (eles.length > 0) {
      const lstpl = eles[0].getElementsByClassName('pl');
      if (lstpl.length > 0) {
        const lsta = lstpl[0].parentElement.getElementsByTagName('a');
        if (lsta.length > 0) {
          const lst = [];
          for (let i = 0; i < lsta.length; ++i) {
            const arr = lsta[i].innerText.split('：');
            lst.push(arr[arr.length - 1]);
          }

          return lst;
        }
      }
    }

    return undefined;
  });

  ret.score = await page.$$eval('.ll.rating_num', (eles) => {
    if (eles.length > 0) {
      return eles[0].innerText;
    }

    return undefined;
  });

  ret.ratingNums = await page.$$eval('.rating_people', (eles) => {
    if (eles.length > 0) {
      const lstspan = eles[0].getElementsByTagName('span');
      if (lstspan.length > 0) {
        return lstspan[0].innerText;
      }
    }

    return undefined;
  });

  ret.intro = await page.$$eval('.intro', (eles) => {
    if (eles.length > 0) {
      return eles[0].innerText;
    }

    return undefined;
  });

  ret.lstLink = await page.$$eval('#db-rec-section', (eles) => {
    if (eles.length > 0) {
      const lstdl = eles[0].getElementsByTagName('dl');
      const lst = [];
      for (let i = 0; i < lstdl.length; ++i) {
        if (lstdl[i].className != 'clear') {
          const lsta = lstdl[i].getElementsByTagName('a');
          if (lsta.length > 1) {
            lst.push({url: lsta[1].href, title: lsta[1].innerText});
          }
        }
      }
      return lst;
    }

    return undefined;
  });

  ret.lstTag = await page.$$eval('a.tag', (eles) => {
    if (eles.length > 0) {
      const lst = [];
      for (let i = 0; i < eles.length; ++i) {
        lst.push(eles[i].innerText);
      }
      return lst;
    }

    return undefined;
  });

  await page.close();

  if (ret.score) {
    const scoreret = string2float(ret.score);
    if (scoreret.error) {
      return {error: 'string2float(ret.score) ' + scoreret.error.toString()};
    }

    ret.score = scoreret.num;
  }

  if (ret.ratingNums) {
    const siret = string2int(ret.ratingNums);
    if (siret.error) {
      return {error: 'string2int(ret.ratingNums) ' + siret.error.toString()};
    }

    ret.ratingNums = siret.num;
  }

  if (ret.lstLink) {
    for (let i = 0; i < ret.lstLink.length; ++i) {
      ret.lstLink[i].id = getSubobjectID(ret.lstLink[i].url);
    }
  }

  return {ret: ret};
}

exports.book = book;
