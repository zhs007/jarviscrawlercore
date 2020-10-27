const {DownloadRequest} = require('../downloadrequest');
const vm = require('vm');
// const moment = require('moment');
const dayjs = require('dayjs');
const log = require('../log');

/**
 * jrjFundValue - jrj fundvalue
 * @param {object} browser - browser
 * @param {string} code - fund code
 * @param {string} date - year
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jrjFundValue(browser, code, date, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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
    log.error('jrjFundValue.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // await page.setRequestInterception(true);
  // page.on('request', async (req) => {
  //   const rt = req.resourceType();
  //   if (rt == 'image' || rt == 'media' || rt == 'font') {
  //     await req.abort();

  //     return;
  //   }

  //   await req.continue();
  // });

  // if (pageid > 1) {
  //   url += '&page=' + (pageid - 1).toString();
  // }

  const url =
    'http://fund.jrj.com.cn/json/archives/history/netvalue?fundCode=' +
    code +
    '&obj=obj&date=' +
    date;
  const downreq = new DownloadRequest(page, [url]);

  await page
      .goto(url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFundValue.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await downreq.waitDone(timeout);
  if (!isdone) {
    const errstr = 'jrjFundValue.waitDown timeout';

    await page.close();

    return {error: errstr};
  }

  await page.close();

  const curreq = downreq.findReq(url);

  if (curreq) {
    const strcode = curreq.buf.toString();

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(strcode, sandbox);

    const ret = {code: code, values: []};

    const netValue = sandbox.obj.fundHistoryNetValue;
    if (
      Array.isArray(netValue) &&
      netValue.length > 0 &&
      netValue[0].unit_net
    ) {
      for (let i = 0; i < netValue.length; ++i) {
        try {
          const uval = Math.floor(parseFloat(netValue[i].unit_net) * 10000);
          let aval = -1;
          if (netValue[i].accum_net) {
            aval = Math.floor(parseFloat(netValue[i].accum_net) * 10000);
          }

          const cd = netValue[i].enddate;

          const ct = dayjs(cd, 'YYYY-MM-DD');

          ret.values.push({
            date: ct.format('YYYYMMDD'),
            value: uval,
            totalValue: aval,
          });
          // ret.date.push(cd);
          // ret.iValue.push(uval);
          // ret.iTotalValue.push(aval);
        } catch (err) {
          log.error('jrjFundValue proc values err ' + err);
        }
      }
    }

    return {ret: ret};
  }

  return {error: 'jrjFundValue no js code'};
}

exports.jrjFundValue = jrjFundValue;
