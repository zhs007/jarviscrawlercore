const {WaitFrameNavigated} = require('../waitframenavigated');
const {closeDialog} = require('./utils');
const {sleep} = require('../utils');
const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {disableDownloadOthers} = require('../page.utils');

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
 * getMaxPages - get max pages
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, pages}
 */
async function getMaxPages(page, timeout) {
  let awaiterr;

  let ct = 0;
  while (true) {
    const isok = await page.evaluate(() => {
      const lst = document.getElementsByClassName('plp-products-wrap');
      if (lst.length > 0) {
        const lstpages = document.getElementsByClassName('page-number');
        if (lstpages.length > 0) {
          return true;
        }
      }

      return false;
    });

    if (isok) {
      break;
    }

    if (ct >= timeout) {
      return {error: new Error('getMaxPages timeout.')};
    }

    await sleep(1000);
    ct += 1000;
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
    return {error: awaiterr.toString()};
  }

  return {pages: ret1.maxPage};
}

/**
 * nextPage - change to next page
 * @param {object} page - page
 * @param {string} baseurl - baseurl
 * @param {string} firsturl - firsturl
 * @param {number} timeout - timeout in microseconds
 * @return {error} err - error
 */
async function nextPage(page, baseurl, firsturl, timeout) {
  let awaiterr;

  let ct = 0;
  while (true) {
    const isok = await page
        .evaluate(() => {
          const lst = document.getElementsByClassName('pag-next');
          if (lst.length > 0) {
            return true;
          }

          return false;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      return awaiterr;
    }

    if (isok) {
      break;
    }

    if (ct >= timeout) {
      return {error: new Error('getMaxPages timeout.')};
    }

    await sleep(1000);
    ct += 1000;
  }

  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const url = frame.url();

    return url.indexOf(baseurl) == 0;
  });

  const np = await page.$$('.pag-next').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  if (np.length > 0) {
    await np[0].hover();
    await sleep(1000);
    await np[0].click({delay: 300}).catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    waitchgpage.resetex();
    const isok = await waitchgpage.waitDone(timeout);
    if (!isok) {
      return new Error('chgPage.waitDone timeout');
    }

    waitchgpage.release();

    let curms = 0;
    while (true) {
      const cururl = await getFirstProductURL(page);
      if (cururl != '' && cururl != firsturl) {
        break;
      }

      await sleep(1000);
      curms += 1000;

      if (curms > timeout) {
        break;
      }
    }
  }

  return undefined;
}

/**
 * getFirstProductURL - get first product url
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {string} url - url
 */
async function getFirstProductURL(page) {
  let awaiterr;
  const ret = await page
      .$$eval('.plp-products-wrap', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          eles = eles[0].getElementsByClassName('product');

          if (eles.length > 0) {
            const link = eles[0].getElementsByTagName('a');
            if (link.length > 0) {
              return link[0].href;
            }
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getFirstProductURL.$$eval .plp-products-wrap', awaiterr);

    return '';
  }

  return ret;
}

/**
 * steepandcheapProducts2 - steepandcheap products
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} pageid - pageid, is like 1, 2, 3
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function steepandcheapProducts2(browser, url, pageid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);

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
    log.error('steepandcheapProducts2.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.steepandcheap.com/' + url;
  const furl = 'https://www.steepandcheap.com/' + url + '?sort=-price';

  const waitAllResponse = new WaitAllResponse(page);
  await page
      .goto(furl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProducts2.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    return new Error('steepandcheapProducts2.waitDone timeout.');
  }

  waitAllResponse.reset();

  awaiterr = await closeDialog(page);
  if (awaiterr) {
    log.error('steepandcheapProducts2.closeDialog ', awaiterr);

    await page.close();

    return {
      error: 'steepandcheapProducts2.closeDialog ' + awaiterr.toString(),
    };
  }

  // await sleep(3 * 1000);

  let maxpageret = await getMaxPages(page, timeout);
  if (maxpageret.error) {
    log.error('steepandcheapProducts2.getMaxPages ', maxpageret.error);

    await page.close();

    return {
      error:
        'steepandcheapProducts2.getMaxPages ' + maxpageret.error.toString(),
    };
  }

  const lst = [];
  for (let ci = 0; ci < maxpageret.pages; ++ci) {
    const firsturl = await getFirstProductURL(page);

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
                const stocklevelarr = stocklevel[0].innerText
                    .trim()
                    .split(' ', -1);
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

              const lowprice = curele.getElementsByClassName(
                  'ui-pl-pricing-low-price',
              );
              if (lowprice.length > 0) {
                const lowpricearr = lowprice[0].innerText.split('$', -1);
                if (lowpricearr.length != 2) {
                  console.log('invalid low price ' + lowprice[0].innerText);
                } else {
                  try {
                    curret.curPrice = parseFloat(
                        lowpricearr[1].split(',').join(''),
                    );
                  } catch (err) {
                    console.log('invalid low price ' + lowprice[0].innerText);
                  }
                }
              }

              const highprice = curele.getElementsByClassName(
                  'ui-pl-pricing-high-price',
              );
              if (highprice.length > 0) {
                const highpricearr = highprice[0].innerText.split('$', -1);
                if (highpricearr.length != 2) {
                  console.log('invalid high price ' + highprice[0].innerText);
                } else {
                  try {
                    curret.price = parseFloat(
                        highpricearr[1].split(',').join(''),
                    );
                  } catch (err) {
                    console.log('invalid high price ' + highprice[0].innerText);
                  }
                }
              }

              const ratingbase = curele.getElementsByClassName('rating-base');
              if (ratingbase.length > 0) {
                try {
                  curret.ratingValue = parseInt(
                      ratingbase[0].children[0].innerText,
                  );
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
      log.error('steepandcheapProducts2.$$eval .product', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    lst.push(...ret);

    if (ci < maxpageret.pages - 1) {
      const err = await nextPage(page, baseurl, firsturl, timeout);
      if (err) {
        log.error('steepandcheapProducts2.nextPage', err);

        await page.close();

        return {error: err.toString()};
      }

      const isok = await waitAllResponse.waitDone(timeout);
      if (!isok) {
        return new Error('steepandcheapProducts2.waitDone timeout.');
      }

      waitAllResponse.reset();

      maxpageret = await getMaxPages(page, timeout);
    }
  }

  await page.close();

  for (let i = 0; i < lst.length; ++i) {
    lst[i].url = parseURL(lst[i].url);
  }

  return {ret: {maxPage: maxpageret.pages, products: lst}};
}

exports.steepandcheapProducts2 = steepandcheapProducts2;
