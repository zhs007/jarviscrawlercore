// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {parseID} = require('./utils');
// const {DownloadList} = require('../request');
// const path = require('path');
// const fs = require('fs');

// const oabturl = 'http://oabt008.com/';

/**
 * hao6vNewPage - hao6v newpage page
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function hao6vNewPage(browser, timeout) {
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
    log.error('hao6vNewPage.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'http://www.hao6v.com/gvod/zx.html';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('hao6vNewPage.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('hao6vNewPage.waitDone timeout');

    log.error('hao6vNewPage.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('ul.list', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lsta = eles[0].getElementsByTagName('a');
          for (let i = 0; i < lsta.length; ++i) {
            lst.push({
              name: lsta[i].text,
              url: lsta[i].href,
            });
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('hao6vNewPage.$$eval ul.list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: []};

  for (let i = 0; i < lst.length; ++i) {
    const ci = {
      fullname: lst[i].name,
      url: lst[i].url,
      resid: parseID(lst[i].url),
    };

    ret.lst.push(ci);
  }

  return {ret: ret};
}

exports.hao6vNewPage = hao6vNewPage;
