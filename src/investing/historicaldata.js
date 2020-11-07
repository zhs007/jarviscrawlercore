const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {clearInput} = require('../eleutils');
// const {parseID} = require('./utils');

/**
 * investingHD - investing get historical data
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {string} st - starttime, it's like 2010/01/01
 * @param {string} et - endtime, it's like 2010/10/01
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function investingHD(browser, url, st, et, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  //   await disableDownloadOthers(page);
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
    log.error('investingHD.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // const baseurl = 'https://cn.investing.com/' + url;
  const baseurl = url + '-historical-data';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('investingHD.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('investingHD.waitDone timeout');

    log.error('investingHD.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lstdp = await page.$$('#datePickerIconWrap').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('investingHD $$(#datePickerIconWrap)', awaiterr);

    await page.close();

    return {error: awaiterr};
  }

  if (lstdp.length == 0) {
    return {
      error: new Error('investingHD invalid $$(#datePickerIconWrap).'),
    };
  }

  await lstdp[lstdp.length - 1].hover();
  await sleep(50);

  // waitAllResponse.reset();

  await lstdp[lstdp.length - 1].click();

  let curtime = 0;
  let lstsd = [];
  let lsted = [];
  let lstbtn = [];
  while (curtime < timeout) {
    lstsd = await page.$$('#startDate').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('investingHD $$(#startDate)', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    lsted = await page.$$('#endDate').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('investingHD $$(#endDate)', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    lstbtn = await page.$$('#applyBtn').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('investingHD $$(#applyBtn)', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (lstsd.length > 0 && lsted.length > 0 && lstbtn.length > 0) {
      break;
    }

    await sleep(1000);
    curtime += 1000;
  }

  if (lstsd.length == 0 || lsted.length == 0 || lstbtn.length == 0) {
    log.error('investingHD (lstsd && lsted && lstbtn)');

    await page.close();

    return {error: 'investingHD (lstsd && lsted && lstbtn)'};
  }

  lstsd = await page.$$('#startDate');

  await lstsd[0].hover().catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('investingHD lstsd[0].hover()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearInput(page, lstsd[0]);
  if (awaiterr) {
    log.error('investingHD clearInput()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await lstsd[0].type(st, {delay: 100}).catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('investingHD lstsd[0].type()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  lsted = await page.$$('#endDate');

  await lsted[0].hover().catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('investingHD lsted[0].hover()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearInput(page, lsted[0]);
  if (awaiterr) {
    log.error('investingHD clearInput()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await lsted[0].type(et, {delay: 100}).catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('investingHD lsted[0].type()', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  lstbtn = await page.$$('#applyBtn');

  await lstbtn[0].hover();
  await sleep(50);

  waitAllResponse.reset();

  await lstbtn[0].click();

  isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('investingHD.waitDone timeout');

    log.error('investingHD.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  //   const lst = await page
  //       .$$eval('td.elp.plusIconTd', (eles) => {
  //         if (eles.length > 0) {
  //           const lst = [];
  //           for (let i = 0; i < eles.length; ++i) {
  //             const lsta = eles[i].getElementsByTagName('a');
  //             if (lsta.length > 0) {
  //               lst.push({
  //                 name: lsta[0].innerText,
  //                 url: lsta[0].href,
  //               });
  //             }
  //           }

  //           return lst;
  //         }

  //         return [];
  //       })
  //       .catch((err) => {
  //         awaiterr = err;
  //       });
  //   if (awaiterr) {
  //     log.error('investingAssets.$$eval td.elp.plusIconTd', awaiterr);

  //     await page.close();

  //     return {error: awaiterr.toString()};
  //   }

  await page.close();

  const ret = {lst: []};

  //   for (let i = 0; i < lst.length; ++i) {
  //     const ci = {
  //       name: lst[i].name,
  //       url: lst[i].url,
  //       // resid: parseID(lst[i].url),
  //     };

  //     ret.lst.push(ci);
  //   }

  return {ret: ret};
}

exports.investingHD = investingHD;
