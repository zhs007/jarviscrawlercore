/**
 * steepandcheapProducts - steepandcheap products
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function steepandcheapProducts(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // page.on('request', async (req) => {
  //   const rt = req.resourceType();
  //   if (rt == 'image' || rt == 'media' || rt == 'font') {
  //     await req.abort();

  //     return;
  //   }

  //   await req.continue();
  // });

  await page
      .goto('https://www.steepandcheap.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProducts.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.product').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('steepandcheapProducts.waitForSelector .product', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page.$$eval('.product', (eles) => {
    console.log(eles);

    const ret = [];

    return ret;
  }).catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('steepandcheapProducts.$$eval .product', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.steepandcheapProducts = steepandcheapProducts;
