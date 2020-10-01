const log = require('../log');

/**
 * getName - get name
 * @param {string} fullname - fullname
 * @return {string} name - name
 */
function getName(fullname) {
  const lstarr0 = fullname.split('（');
  if (lstarr0.length == 2) {
    return lstarr0[0];
  }

  return '';
}

/**
 * getCreateTime - get createtime
 * @param {string} strtime - strtime
 * @return {int64} time - time
 */
function getCreateTime(strtime) {
  const lstarr0 = strtime.split('：');
  if (lstarr0.length == 2) {
    const ct = new Date(lstarr0[1]).getTime();
    return Math.floor(ct / 1000);
  }

  return 0;
}

/**
 * jrjFund - jrj fund
 * @param {object} browser - browser
 * @param {string} code - fund code
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jrjFund(browser, code, timeout) {
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
    log.error('jrjFund.setViewport', awaiterr);

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

  const ret = {};

  await page
      .goto('http://fund.jrj.com.cn/archives,' + code + '.shtml', {
        timeout: timeout,
        waitUntil: 'domcontentloaded',
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .waitForSelector('.hdmain', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.waitForSelector .hdmain', err);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret1 = await page
      .$$eval('.hdmain', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret1 = {};
          const lsth1 = eles[0].getElementsByTagName('h1');
          if (lsth1.length > 0) {
            ret1.fullname = lsth1[0].innerText;
          }

          const lstmhsub = eles[0].getElementsByClassName('mh-sub');
          if (lstmhsub.length > 0) {
            const lsti = lstmhsub[0].getElementsByTagName('i');
            if (lsti.length > 0) {
              ret1.tags = [];

              for (let i = 0; i < lsti.length; ++i) {
                ret1.tags.push(lsti[i].innerText);
              }
            }
          }

          return ret1;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.$$eval .hdmain', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (!ret1) {
    log.error('jrjFund.no ret1');

    await page.close();

    return {error: 'jrjFund.no ret1'};
  }

  const ret2 = await page
      .$$eval('.tit-inf', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret2 = {};

          const lsta = eles[0].getElementsByTagName('a');
          if (lsta.length == 2) {
            ret2.managerurl = lsta[0].herf;
            ret2.manager = lsta[0].innerText;
            ret2.company = lsta[1].innerText;
          }

          const lstspan = eles[0].getElementsByTagName('span');
          if (lstspan.length == 7) {
            ret2.strCreateTime = lstspan[2].innerText;
          } else if (lstspan.length == 6) {
            ret2.strCreateTime = lstspan[1].innerText;
          }

          return ret2;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.$$eval .tit-inf', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret2 == undefined) {
    const ret3 = await page
        .$$eval('.tittopone', (eles) => {
          console.log(eles);

          if (eles.length > 0) {
            const ret3 = {};

            const lsta = eles[0].getElementsByTagName('a');
            if (lsta.length == 3) {
              ret3.company = lsta[2].innerText;
            }

            return ret3;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jrjFund.$$eval .tittopone', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.company = ret3.company;
  } else {
    ret.createTime = getCreateTime(ret2.strCreateTime);
    ret.company = ret2.company;
  }

  const ret5 = await page
      .$$eval('#con_2', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret5 = {size: 0};

          const lsthui = eles[0].getElementsByClassName('hui');
          for (let i = 0; i < lsthui.length; ++i) {
            if (lsthui[i].innerText.indexOf('规模') >= 0) {
              const lsttl = eles[0].getElementsByClassName('tl');
              if (lsttl.length >= i) {
                ret5.size = parseFloat(lsttl[i].innerText);
              }

              break;
            }
          }

          return ret5;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.$$eval #con_2', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.code = code;
  ret.name = getName(ret1.fullname);
  ret.tags = ret1.tags;

  if (ret5) {
    ret5.time = Math.floor(Date.now() / 1000);
    ret.size = [ret5];
  }

  await page.close();

  return {ret: ret};
}

exports.jrjFund = jrjFund;
