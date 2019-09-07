const {WaitFrameNavigated} = require('../waitframenavigated');
const {closeDialog} = require('./utils');
const {sleep} = require('../utils');

/**
 * parseURL - parse URL
 * @param {string} url - url
 * @return {string} url - url
 */
function parseURL(url) {
  const url1 = url.split('.com/');
  if (url1.length > 1) {
    const url2 = url1[1].split('&ti=');
    return url2[0];
  }

  return url;
}

/**
 * chgPage - change to page
 * @param {object} page - page
 * @param {number} pageid - pageid, is like 1, 2, 3
 * @param {string} baseurl - baseurl
 * @param {number} timeout - timeout in microseconds
 * @return {error} err - error
 */
async function chgPage(page, pageid, baseurl, timeout) {
  if (pageid > 1) {
    await sleep(3 * 1000);

    let awaiterr;

    await page.waitForSelector('.page-link', {timeout: timeout}).catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      return awaiterr;
    }

    const mainframe = await page.mainFrame();
    const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
      const url = frame.url();

      return url.indexOf(baseurl) == 0;
    });

    const lstpages = await page.$$('.page-link').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    if (pageid > lstpages.length + 1) {
      return new Error('chgPage invalid pageid');
    }

    await lstpages[pageid - 2].hover().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    await lstpages[pageid - 2].click().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    const isok = await waitchgpage.waitDone(timeout);
    if (!isok) {
      return new Error('chgPage.waitDone timeout');
    }

    waitchgpage.release();
  }

  return undefined;
}

/**
 * steepandcheapProducts - steepandcheap products
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} pageid - pageid, is like 1, 2, 3
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function steepandcheapProducts(browser, url, pageid, timeout) {
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
    console.log('steepandcheapProducts.setViewport', awaiterr);

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

  awaiterr = await closeDialog(page);
  if (awaiterr) {
    console.log('steepandcheapProducts.chgPage ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await chgPage(page, pageid, 'https://www.steepandcheap.com/' + url, timeout);
  if (awaiterr) {
    console.log('steepandcheapProducts.chgPage ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.plp-products-wrap').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('steepandcheapProducts.waitForSelector .plp-products-wrap', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page
      .$$eval('.plp-products-wrap', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          eles = eles[0].getElementsByClassName('product');

          const ret = [];

          for (let i = 0; i < eles.length; ++i) {
            const curret = {currency: 'USD'};
            const curele = eles[i];

            const isnew = curele.getElementsByClassName('pli-new-icon');
            if (isnew.length > 0) {
              curret.isNew = true;
            }

            const stocklevel = curele.getElementsByClassName('pli-stock-level');
            if (stocklevel.length > 0) {
              const stocklevelarr = stocklevel[0].innerText.trim().split(' ', -1);
              if (stocklevelarr.length != 3) {
                console.log('invalid stock level ' + stocklevel[0].innerText);
              } else {
                try {
                  curret.stockLevel = parseInt(stocklevelarr[1]);
                } catch (err) {
                  console.log('invalid stock level ' + stocklevel[0].innerText);
                }
              }
            }

            const brandname = curele.getElementsByClassName('ui-pl-name-brand');
            if (brandname.length > 0) {
              curret.brandName = brandname[0].innerText;
            }

            const titlename = curele.getElementsByClassName('ui-pl-name-title');
            if (titlename.length > 0) {
              curret.productName = titlename[0].innerText.split('-', -1);
            }

            const lowprice = curele.getElementsByClassName('ui-pl-pricing-low-price');
            if (lowprice.length > 0) {
              const lowpricearr = lowprice[0].innerText.split('$', -1);
              if (lowpricearr.length != 2) {
                console.log('invalid low price ' + lowprice[0].innerText);
              } else {
                try {
                  curret.curPrice = parseFloat(lowpricearr[1]);
                } catch (err) {
                  console.log('invalid low price ' + lowprice[0].innerText);
                }
              }
            }

            const highprice = curele.getElementsByClassName('ui-pl-pricing-high-price');
            if (highprice.length > 0) {
              const highpricearr = highprice[0].innerText.split('$', -1);
              if (highpricearr.length != 2) {
                console.log('invalid high price ' + highprice[0].innerText);
              } else {
                try {
                  curret.price = parseFloat(highpricearr[1]);
                } catch (err) {
                  console.log('invalid high price ' + highprice[0].innerText);
                }
              }
            }

            const ratingbase = curele.getElementsByClassName('rating-base');
            if (ratingbase.length > 0) {
              try {
                curret.ratingValue = parseInt(ratingbase[0].children[0].innerText);
              } catch (err) {
                console.log('invalid rating-base ' + ratingbase[0]);
              }
            }

            const reviews = curele.getElementsByClassName('ui-pl-reviews');
            if (reviews.length > 0) {
              try {
                curret.reviews = parseInt(reviews[0].children[2].innerText);
              } catch (err) {
                console.log('invalid reviews ' + reviews[0]);
              }
            }

            const link = curele.getElementsByTagName('a');
            if (link.length > 0) {
              curret.url = link[0].href;
            }

            ret.push(curret);
          }

          return ret;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProducts.$$eval .product', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret1 = await page
      .$$eval('.page-number', (eles) => {
        const ret1 = {};
        try {
          ret1.maxPage = parseInt(eles[eles.length - 1].innerText);
        } catch (err) {
          console.log('invalid page number ' + eles[eles.length - 1]);
        }
        return ret1;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProducts.$$eval .page-number', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  for (let i = 0; i < ret.length; ++i) {
    ret[i].url = parseURL(ret[i].url);
  }

  return {ret: {maxPage: ret1.maxPage, products: ret}};
}

exports.steepandcheapProducts = steepandcheapProducts;
