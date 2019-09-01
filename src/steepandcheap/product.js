const {sleep} = require('../utils');

/**
 * getColorName - get color name
 * @param {object} page - page
 * @return {string} str - color name
 */
async function getColorName(page) {
  let awaiterr;
  const name = await page
      .$$eval('.buybox__title-color-name', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return '';
  }

  return name;
}

/**
 * getSizeList - get size list
 * @param {object} page - page
 * @return {object} ret - {size, sizeValid}
 */
async function getSizeList(page) {
  let awaiterr;
  const obj = await page
      .$$eval('.buybox__size-item', (eles) => {
        if (eles.length > 0) {
          const size = [];
          const sizeValid = [];

          for (let i = 0; i < eles.length; ++i) {
            size.push(eles[i].innerText);
            if (eles[i].children.length == 1) {
              sizeValid.push(true);
            } else {
              const arr = eles[i].getElementsByClassName('buybox__cross-line');
              if (arr.length > 0) {
                if (arr[0].style.display == 'none') {
                  sizeValid.push(true);
                } else {
                  sizeValid.push(false);
                }
              } else {
                sizeValid.push(true);
              }
            }
          }

          return {size: size, sizeValid: sizeValid};
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return undefined;
  }

  return obj;
}

/**
 * steepandcheapProduct - steepandcheap product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function steepandcheapProduct(browser, url, timeout) {
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
    console.log('steepandcheapProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.the-wall').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('steepandcheapProduct.waitForSelector .the-wall', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {};

  ret.category = await page
      .$$eval('.crumb', (eles) => {
        const lst = [];

        for (let i = 0; i < eles.length; ++i) {
          lst.push(eles[i].innerText);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProduct.$$eval .crumb', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.imgs = await page
      .$$eval('.ui-mediacarousel__list', (eles) => {
        const lst = [];

        if (eles.length > 0) {
          const imgs = eles[0].getElementsByTagName('img');
          for (let i = 0; i < imgs.length; ++i) {
            lst.push(imgs[i].src);
          }
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log(
        'steepandcheapProduct.$$eval .ui-mediacarousel__list',
        awaiterr
    );

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.skuid = await page
      .$$eval('.sku-id', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProduct.$$eval .sku-id', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let lastname = '';
  const lstcolor = await page.$$('.buybox__color-item').catch((err) => {
    awaiterr = err;
  });
  if (lstcolor.length > 0) {
    ret.color = [];

    for (let i = 0; i < lstcolor.length; ++i) {
      await lstcolor[i].click();

      while (true) {
        const curname = await getColorName(page);

        if (curname != lastname) {
          lastname = curname;

          break;
        }

        await sleep(1000);
      }

      const curcolor = {
        color: lastname,
      };

      const curret = await getSizeList(page);
      if (curret) {
        curcolor.size = curret.size;
        curcolor.sizeValid = curret.sizeValid;
      }

      ret.color.push(curcolor);
    }
  }

  if (awaiterr) {
    console.log('steepandcheapProduct.$$eval .buybox__colors-item', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.steepandcheapProduct = steepandcheapProduct;
