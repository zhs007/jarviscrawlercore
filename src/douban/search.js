const {sleep} = require('../utils');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');
const {waitForFunction} = require('../waitutils');
const {getSubobjectID} = require('./utils');

/**
 * douban search
 * @param {object} browser - browser
 * @param {string} type - type, it is like movie
 * @param {string} str - str
 * @param {bool} debugmode - debugmode
 * @param {number} timeout - timeout in microseconds
 * @return {object} result - {error: err, ret: ret}
 */
async function search(browser, type, str, debugmode, timeout) {
  const page = await browser.newPage();
  let awaiterr;

  let baseurl = 'https://www.douban.com/';
  let searchurl = '';
  if (type == 'movie') {
    baseurl = 'https://movie.douban.com/';
  } else if (type == 'book') {
    baseurl = 'https://book.douban.com/';
    searchurl = 'https://search.douban.com/book/subject_search';
  }

  await disableDownloadOthers(page);
  const waitAllResponse = new WaitAllResponse(page);
  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const cururl = frame.url();

    return cururl.indexOf(searchurl) == 0;
  });

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
    log.error('douban.search.setViewport', awaiterr);

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
    log.error('douban.search.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('douban.search.waitDone timeout');

    log.error('douban.search.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  await page.$eval('.inp', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchinput';
    }
  });

  await page.type('.searchinput', str);

  await page.$eval('.inp-btn', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchbtn';
    }
  });

  await page.click('.searchbtn');

  isdone = await waitchgpage.waitDone(timeout);
  if (!isdone) {
    const err = new Error('douban.search.waitchgpage.waitDone timeout');

    log.error('douban.search.waitchgpage.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('douban.search.waitDone2 timeout');

    log.error('douban.search.waitDone2 ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  awaiterr = await waitForFunction(page, '.item-root', (eles) => {
    return eles.length > 0;
  });
  if (awaiterr) {
    log.error('douban.search.waitForFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await sleep(1000);

  const lst = await page.$$eval('.item-root', (eles) => {
    const lst = [];
    console.log(eles.length);
    for (let i = 0; i < eles.length; ++i) {
      const lsttitle = eles[i].getElementsByClassName('title');
      if (lsttitle.length > 0) {
        const lsta = lsttitle[0].getElementsByTagName('a');
        if (lsta.length > 0) {
          lst.push({title: lsta[0].innerText, url: lsta[0].href});
        }
      }
    }

    console.log(lst);

    return lst;
  });

  for (let i = 0; i < lst.length; ++i) {
    ret[i].id = getSubobjectID(lst[i].url);
  }

  // log.debug(lst);

  if (!debugmode) {
    await page.close();
  }

  return {ret: {subjects: lst}};
}

exports.search = search;
