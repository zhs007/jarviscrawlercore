const {sleep} = require('../utils');
// const {WaitURLResponse} = require('../waiturlresponse');
// const {WaitDomContentLoaded} = require('../waitfordomcontentloaded');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');
const {waitForFunction} = require('../waitutils');

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
  // await page.setRequestInterception(true);
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

  // page.on('request', (req) => {
  //   if (req.resourceType() === 'image') {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });

  // const waitURL = new WaitURLResponse(page);
  // const waitdomloaded = new WaitDomContentLoaded(page);

  // await waitdomloaded.wait(async () => {
  //   if (type == 'movie') {
  //     await page.goto('https://movie.douban.com/').catch((err) => {
  //       log.error('douban.search.goto', err);
  //     });
  //   } else {
  //     await page.goto('https://www.douban.com/').catch((err) => {
  //       log.error('douban.search.goto', err);
  //     });
  //   }
  // }, 3 * 60 * 1000);

  // let baseurl = 'https://www.douban.com/';
  // if (type == 'movie') {
  //   baseurl = 'https://movie.douban.com/';
  // } else if (type == 'book') {
  //   baseurl = 'https://book.douban.com/';
  // }

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

  // while (true) {
  //   if (isloaded) {
  //     break;
  //   }

  //   await sleep(1000);
  // }

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

  // await waitdomloaded.wait(async () => {
  await page.click('.searchbtn');
  // }, 3 * 60 * 1000);

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

  // waitURL.wait4URL(
  //     'https://movie.douban.com/subject_search?search_text',
  //     () => {},
  //     3 * 60 * 1000
  // );

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

  log.debug(lst);

  if (!debugmode) {
    await page.close();
  }

  return {lst: lst};
}

exports.search = search;
