const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {closeDialog} = require('./utils');
const {waitForFunction} = require('../waitutils');

/**
 * getTShopObj - get tshop object
 * @param {object} page - page
 * @return {object} ret - tshop object
 */
async function getTShopObj(page) {
  let html = await page.mainFrame().content();
  html = html.replace(/\n/g, '');
  html = html.replace(/\t/g, '');
  const ret = /TShop.Setup\((.+?)\)/.exec(html);
  if (ret[1]) {
    try {
      const retobj = JSON.parse(ret[1]);

      return retobj;
    } catch (err) {
      log.error('getTShopObj ', err);
    }
  }

  return undefined;
}

/**
 * tmallDetail - tmall detail
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmallDetail(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const waitAllResponse = new WaitAllResponse(page);

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
    log.error('tmallDetail.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://detail.tmall.com/item.htm?id=' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmallDetail.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmallDetail.waitDone timeout');

    log.error('tmallDetail.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  awaiterr = await closeDialog(page);
  if (awaiterr) {
    log.error('tmallDetail.closeDialog', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {};

  const titleinfo = await page
      .$$eval('.tb-detail-hd', (eles) => {
        if (eles.length > 0) {
          if (eles[0].children.length == 2) {
            return {
              title: eles[0].children[0].innerText,
              newinfo: eles[0].children[1].innerText,
            };
          }

          const lsth1 = eles[0].getElementsByTagName('h1');
          if (lsth1.length > 0) {
            return {
              title: lsth1[0].innerText,
            };
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmallDetail.$$eval .tb-detail-hd', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (titleinfo) {
    ret.title = titleinfo.title;
    ret.newinfo = titleinfo.newinfo;
  }

  //   const ret = {};
  const skus = await page
      .$$eval('.tb-sku', (eles) => {
        if (eles.length > 0) {
          const skus = [];
          const lis = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lis.length; ++i) {
            const csku = {
              title: lis[i].getAttribute('title'),
              value: lis[i].dataset['value'],
            };

            if (csku.title && csku.value) {
              const lsta = lis[i].getElementsByTagName('a');
              if (lsta.length > 0) {
                csku.curimg = lsta[0].style['background'];
              }

              skus.push(csku);
            }
          }

          return skus;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmallDetail.$$eval .tb-sku', awaiterr);

    await page.close();

    return {error: awaiterr};
  }

  for (let i = 0; i < skus.length; ++i) {
    const arr = skus[i].curimg.split('("');
    if (arr.length == 2) {
      const arr1 = arr[1].split('")');
      skus[i].img = arr1[0];
      skus[i].img = skus[i].img.replace('40x40q90', '600x600');
      skus[i].img = 'https:' + skus[i].img;
    }
  }

  console.log(skus);

  const lstreviews = await page.$$('#J_Reviews');
  if (lstreviews.length > 0) {
    await lstreviews[0].hover();

    awaiterr = await waitForFunction(page, '#J_Reviews', (eles) => {
      if (eles.length > 0) {
        const lsth4 = eles[0].getElementsByTagName('h4');
        if (lsth4.length > 0) {
          const lstem = lsth4[0].getElementsByTagName('em');
          if (lstem.length > 0) {
            return (
              eles[0].getElementsByClassName('rate-score').length > 0 &&
              eles[0].getElementsByClassName('rate-tag-box').length > 0
            );
          }
        }
      }

      return false;
    });
  }

  const reviewret = await page
      .$$eval('#J_Reviews', (eles) => {
        if (eles.length > 0) {
          const reviewret = {};

          const lsth4 = eles[0].getElementsByTagName('h4');
          if (lsth4.length > 0) {
            const lstem = lsth4[0].getElementsByTagName('em');
            if (lstem.length > 0) {
              reviewret.reviews = lstem[0].innerText;
            }
          }

          const ratescore = eles[0].getElementsByClassName('rate-score');
          if (ratescore.length > 0) {
            const strong = ratescore[0].getElementsByTagName('strong');
            if (strong.length > 0) {
              reviewret.rating = strong[0].innerText;
            }
          }

          const tags = eles[0].getElementsByClassName('tag-posi');
          if (tags.length > 0) {
            reviewret.tags = [];
            for (let i = 0; i < tags.length; ++i) {
              reviewret.tags.push(tags[i].innerText);
            }
          }

          return reviewret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmallDetail.$$eval #J_Reviews', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (reviewret) {
    ret.reviews = parseInt(reviewret.reviews);
    ret.rating = parseFloat(reviewret.rating);

    ret.reviewTags = [];
    for (let i = 0; i < reviewret.tags.length; ++i) {
      const arr = reviewret.tags[i].split('(');
      if (arr.length == 2) {
        const arr1 = arr[1].split(')');
        if (arr1.length == 2) {
          ret.reviewTags.push({
            tag: arr[0],
            times: parseInt(arr1[0]),
          });
        }
      }
    }
  }

  const tshop = await getTShopObj(page);
  if (tshop) {
    if (tshop.itemDO) {
      ret.brand = tshop.itemDO.brand;
      ret.brandID = tshop.itemDO.brandId;
      ret.categoryID = tshop.itemDO.categoryId;
      ret.itemID = tshop.itemDO.itemId;
    }

    if (tshop.valItemInfo && tshop.valItemInfo.skuMap) {
      const skumap = tshop.valItemInfo.skuMap;
      for (let i = 0; i < skus.length; ++i) {
        if (skumap[';' + skus[i].value + ';']) {
          skus[i].price = parseFloat(skumap[';' + skus[i].value + ';'].price);
          skus[i].skuid = skumap[';' + skus[i].value + ';'].skuId;
          skus[i].stock = skumap[';' + skus[i].value + ';'].stock;
        }
      }
    }
  }

  ret.skus = skus;

  await page.close();

  return {ret: ret};
}

exports.tmallDetail = tmallDetail;
