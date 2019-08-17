/**
 * tinypng - tinypng
 * @param {object} browser - browser
 * @param {string} fn - filename
 * @return {object} ret - {error, latitude, longitude, organization, asn, continent, country, region, city, hostname}
 */
async function tinypng(browser, fn) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page.goto('https://tinypng.com/').catch((err) => {
    awaiterr = err;
    // console.log('ipvoidgeoip.goto', err);
  });

  if (awaiterr) {
    console.log('tinypng.goto', awaiterr);

    return {error: awaiterr};
  }

  await page.waitForSelector('.upload').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.waitForSelector upload', awaiterr);

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
        console.log('ipvoidgeoip.uploadFile upload', awaiterr);

        return {error: awaiterr};
      }
    }
  }

  await page.waitForSelector('.after').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.waitForSelector after', awaiterr);

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

    console.log(lst);
  }

  await page.close();

  return {};
}

exports.tinypng = tinypng;
