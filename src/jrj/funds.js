const log = require('../log');

/**
 * getCode - get code
 * @param {string} name - name
 * @return {string} code - code
 */
function getCode(name) {
  const lstarr0 = name.split('【');
  if (lstarr0.length == 2) {
    const lstarr1 = lstarr0[1].split('】');
    if (lstarr1.length == 2) {
      return lstarr1[0];
    }
  }

  return '';
}

/**
 * jrjFunds - jrj funds
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jrjFunds(browser, timeout) {
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
    log.error('jrjFunds.setViewport', awaiterr);

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

  await page
      .goto('http://fund.jrj.com.cn/family.shtml', {
        timeout: timeout,
        waitUntil: 'domcontentloaded',
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFunds.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('div.box').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('jrjFunds.waitForSelector div.box', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page
      .$$eval('div.box', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret = [];

          const lsttd = eles[0].getElementsByTagName('td');
          for (let i = 0; i < lsttd.length; ++i) {
            const lsta = lsttd[i].getElementsByTagName('a');
            for (let j = 0; j < lsta.length; ++j) {
              ret.push(lsta[j].innerText);
            }
          }

          return ret;
        }

        // if (eles.length > 0) {
        //   eles = eles[0].getElementsByClassName('ln1');

        //   const ret = [];

        //   for (let i = 0; i < eles.length; ++i) {
        //     const lsta = eles[i].getElementsByTagName('a');
        //     for (let j = 0; j < lsta.length; ++j) {
        //       ret.push(lsta[j].innerText);
        //     }
        //   }

        //   return ret;
        // }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFunds.$$eval div.box', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const codes = [];
  for (let i = 0; i < ret.length; ++i) {
    const code = getCode(ret[i]);
    if (code.length > 0) {
      codes.push(code);
    }
  }

  return {ret: {codes: codes}};
}

exports.jrjFunds = jrjFunds;
