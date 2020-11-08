const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
// const {disableDownloadOthers} = require('../page.utils');
const {clearInput} = require('../eleutils');
// const {parseID} = require('./utils');

/**
 * parsePrice - parse price
 * @param {string} strPrice - price
 * @return {number} price - price
 */
function parsePrice(strPrice) {
  return parseFloat(strPrice.replace(',', ''));
}

/**
 * parseVolume - parse volume
 * @param {string} strVolume - volume
 * @return {number} volume - volume
 */
function parseVolume(strVolume) {
  const bv = parseFloat(strVolume.replace(',', ''));
  if (strVolume.indexOf('M') >= 0) {
    return Math.floor(bv * 1000000);
  }

  if (strVolume.indexOf('B') >= 0) {
    return Math.floor(bv * 1000000000);
  }

  return Math.floor(bv);
}

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

  const lst = await page
      .$$eval('#curr_table', (eles) => {
        const getElementAttributes = (ele, key) => {
          const attrs = ele.attributes;
          for (let i = 0; i < attrs.length; ++i) {
            if (attrs[i].name == key) {
              return attrs[i].value;
            }
          }

          return undefined;
        };

        if (eles.length > 0) {
          const lst = [];
          const lsttr = eles[0].getElementsByTagName('tr');
          for (let i = 0; i < lsttr.length; ++i) {
            const lsttd = lsttr[i].getElementsByTagName('td');
            if (lsttd.length == 7) {
              lst.push({
                ts: getElementAttributes(lsttd[0], 'data-real-value'),
                close: getElementAttributes(lsttd[1], 'data-real-value'),
                open: getElementAttributes(lsttd[2], 'data-real-value'),
                high: getElementAttributes(lsttd[3], 'data-real-value'),
                low: getElementAttributes(lsttd[4], 'data-real-value'),
                volume: getElementAttributes(lsttd[5], 'data-real-value'),
              });
            }
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('investingAssets.$$eval #curr_table', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {data: []};

  for (let i = 0; i < lst.length; ++i) {
    const ci = {
      ts: parseInt(lst[i].ts),
      close: Math.floor(parsePrice(lst[i].close) * 10000),
      open: Math.floor(parsePrice(lst[i].open) * 10000),
      high: Math.floor(parsePrice(lst[i].high) * 10000),
      low: Math.floor(parsePrice(lst[i].low) * 10000),
      volume: parseVolume(lst[i].volume),
    };

    ret.data.push(ci);
  }

  return {ret: ret};
}

exports.parsePrice = parsePrice;
exports.parseVolume = parseVolume;
exports.investingHD = investingHD;
