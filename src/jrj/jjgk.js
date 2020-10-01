const log = require('../log');

/**
 * jrjJJGK - jrj jjgk
 * @param {object} browser - browser
 * @param {string} code - fund code
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jrjJJGK(browser, code, timeout) {
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
      .goto('https://fund.jrj.com.cn/archives,' + code + ',jjgk.shtml', {
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
      .waitForSelector('.stb', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.waitForSelector .stb', err);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret1 = await page
      .$$eval('.stb', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret1 = {};

          const lstth = eles[0].getElementsByTagName('th');
          const lsttd = eles[0].getElementsByTagName('td');
          for (let i = 0; i < lstth.length; ++i) {
            if (lstth[i].innerText.indexOf('成立日') >= 0) {
              ret1.strCreateTime = lsttd[i].innerText;
            } else if (lstth[i].innerText.indexOf('基金管理人') >= 0) {
              ret1.company = lsttd[i].innerText;
            } else if (lstth[i].innerText.indexOf('最新总份额') >= 0) {
              ret1.size = parseFloat(lstth[i].innerText);
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
    log.error('jrjFund.$$eval .stb', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  if (ret1) {
    if (ret1.strCreateTime) {
      const ct = new Date(ret1.strCreateTime).getTime();
      ret.createTime = Math.floor(ct / 1000);
    }

    if (ret1.company) {
      ret.company = ret1.company;
    }

    if (ret1.size) {
      ret.size = [{size: ret1.size, time: Math.floor(Date.now() / 1000)}];
    }
  }

  return {ret: ret};
}

exports.jrjJJGK = jrjJJGK;
