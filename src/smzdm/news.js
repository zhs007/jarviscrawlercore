// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');
const {procSummary} = require('./utils');

/**
 * smzdmNews - smzdm news
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function smzdmNews(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthersEx(page, (req) => {
    const url = req.url();
    if (url.indexOf('openx.net') >= 0) {
      return true;
    }

    return false;
  });

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
    log.error('smzdmNews.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://news.smzdm.com/';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('smzdmNews.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('smzdmNews.waitDone timeout');

    log.error('smzdmNews.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.list', (eles) => {
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curnode = {headimgs: []};
          const lsttitle = eles[i].getElementsByClassName('listTitle');
          if (lsttitle.length > 0) {
            curnode.title = lsttitle[0].innerText;
          }

          const lstimg = eles[i].getElementsByTagName('img');
          if (lstimg.length > 0) {
            curnode.headimgs.push(lstimg[0].src);
          }

          const lstinfo = eles[i].getElementsByClassName('lrInfo');
          if (lstinfo.length > 0) {
            curnode.summary = lstinfo[0].innerText;
          }

          const lsta = eles[i].getElementsByTagName('a');
          if (lsta.length > 0) {
            curnode.url = lsta[0].href;
          }

          lst.push(curnode);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('smzdmNews.$$eval .list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  for (let i = 0; i < lst.length; ++i) {
    lst[i].summary = procSummary(lst[i].summary);
  }

  const ret = {lst: lst};

  return {ret: ret};
}

exports.smzdmNews = smzdmNews;
