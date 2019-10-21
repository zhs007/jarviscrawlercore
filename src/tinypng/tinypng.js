const {download} = require('../request');
const log = require('../log');

/**
 * tinypng - tinypng
 * @param {object} browser - browser
 * @param {string} fn - filename
 * @return {object} ret - {error}
 */
async function tinypng(browser, fn) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page.goto('https://tinypng.com/').catch((err) => {
    awaiterr = err;
    // console.log('ipvoidgeoip.goto', err);
  });

  if (awaiterr) {
    log.error('tinypng.goto', awaiterr);

    return {error: awaiterr};
  }

  await page.waitForSelector('.upload').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('ipvoidgeoip.waitForSelector upload', awaiterr);

    return {error: awaiterr};
  }

  const sectionUpload = await page.$('.upload');
  if (sectionUpload) {
    const inputUpload = await sectionUpload.$('input');
    if (inputUpload) {
      await inputUpload.uploadFile(fn).catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        log.error('ipvoidgeoip.uploadFile upload', awaiterr);

        return {error: awaiterr};
      }
    }
  }

  await page.waitForSelector('.after').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('ipvoidgeoip.waitForSelector after', awaiterr);

    return {error: awaiterr};
  }

  const afterfiles = await page.$$('.after');
  if (afterfiles) {
    const lst = [];
    for (let i = 0; i < afterfiles.length; ++i) {
      const curf = await afterfiles[i].$eval('a', (ele) => {
        return ele.href;
      });

      lst.push(curf);
    }

    // console.log(JSON.stringify(lst));

    if (lst.length > 0) {
      const lstbuf = [];

      for (let i = 0; i < lst.length; ++i) {
        const cr = await download(lst[i], -1);
        if (!cr) {
          return {error: 'download fail!'};
        }

        if (cr.error) {
          return {error: cr.error};
        }

        if (cr.buf) {
          lstbuf.push(cr.buf);
        }
      }

      await page.close();

      return {lstbuf: lstbuf};
    }
  }

  await page.close();

  return {error: 'no data'};
}

exports.tinypng = tinypng;
