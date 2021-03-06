// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {closeDialog, procSKU} = require('./utils');
const {waitForLocalFunction, waitForFunction} = require('../waitutils');
const {getJSONStr} = require('../string.utils');

/**
 * getTShopObj - get tshop object
 * @param {object} page - page
 * @return {object} ret - tshop object
 */
async function getTShopObj(page) {
  let html = await page.mainFrame().content();
  html = html.replace(/\n/g, '');
  html = html.replace(/\t/g, '');
  const si = html.indexOf('TShop.Setup(');
  if (si >= 0) {
    const jstr = getJSONStr(html, si + 'TShop.Setup('.length);
    if (jstr) {
      try {
        const retobj = JSON.parse(jstr);

        return retobj;
      } catch (err) {
        log.error('getTShopObj ', err);
      }
    }
  }

  return undefined;
}

/**
 * getInitItemDetailObj - get InitItemDetail object
 * @param {string} res - res
 * @return {object} ret - InitItemDetail object
 */
function getInitItemDetailObj(res) {
  // 返回的是utf8，所以直接toString，如果是utf16，则需要用 String.fromCharCode
  res = res.toString(); // String.fromCharCode.apply(null, res);

  res = res.replace(/\n/g, '');
  res = res.replace(/\t/g, '');
  let jstr;
  let si = res.indexOf('setMdskip(');
  if (si >= 0) {
    jstr = getJSONStr(res, si + 'setMdskip('.length);
  } else {
    si = res.indexOf('onMdskip(');
    jstr = getJSONStr(res, si + 'onMdskip('.length);
  }

  if (jstr) {
    try {
      const retobj = JSON.parse(jstr);

      return retobj;
    } catch (err) {
      log.error('getInitItemDetailObj ', err);
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

  let inititemdetail;
  page.on('response', async (res) => {
    const url = res.url();

    if (url.indexOf('https://mdskip.taobao.com/core/initItemDetail.htm') == 0) {
      // log.info('response', url);

      inititemdetail = await res.buffer().catch((err) => {
        log.error('tmallDetail.WaitAllResponse.buffer ' + err);
      });
    }
  });

  let noretry = 0;
  page.on('framenavigated', (f) => {
    if (f == page.mainFrame()) {
      if (
        f
            .url()
            .indexOf('https://huodong.taobao.com/wow/malldetail/act/guide-tb?') ==
        0
      ) {
        noretry = 1;
      }
    }
  });

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

  // console.log(skus);

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
              (eles[0].getElementsByClassName('rate-tag-box').length > 0 ||
                eles[0].getElementsByClassName('rate-graph').length > 0)
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

    if (reviewret.tags) {
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
  }

  if (noretry > 0) {
    if (noretry == 1) {
      awaiterr = new Error(
          'noretry:needmobile ' + 'https://detail.tmall.com/item.htm?id=' + url,
      );
    } else {
      awaiterr = new Error(
          'noretry:' + noretry + ' https://detail.tmall.com/item.htm?id=' + url,
      );
    }

    log.error('tmallDetail.noretry ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const tshop = await getTShopObj(page);

  awaiterr = await waitForLocalFunction(
      page,
      () => {
        return inititemdetail != undefined;
      },
      1000,
      timeout,
  );
  if (awaiterr) {
    log.error('tmallDetail.waitForLocalFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const idobj = getInitItemDetailObj(inititemdetail);
  if (idobj == undefined) {
    awaiterr = new Error('getInitItemDetailObj err! ' + inititemdetail);

    log.error('tmallDetail.getInitItemDetailObj', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let skus = await page
      .$$eval('.tb-sku', (eles) => {
        if (eles.length > 0) {
          const skus = [];
          const lis = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lis.length; ++i) {
            if (lis[i].dataset['value']) {
              const csku = {
                title: lis[i].getAttribute('title'),
                value: lis[i].dataset['value'],
              };

              const lsta = lis[i].getElementsByTagName('a');
              if (lsta.length > 0) {
                csku.curimg = lsta[0].style['background'];

                if (!csku.title) {
                  csku.title = lsta[0].innerText;
                }
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

    return {error: awaiterr.toString()};
  }

  if (skus) {
    for (let i = 0; i < skus.length; ++i) {
      const arr = skus[i].curimg.split('("');
      if (arr.length == 2) {
        const arr1 = arr[1].split('")');
        skus[i].img = arr1[0];
        skus[i].img = skus[i].img.replace('40x40q90', '600x600');
        skus[i].img = 'https:' + skus[i].img;
      }
    }
  }

  if (tshop) {
    if (tshop.itemDO) {
      ret.brand = tshop.itemDO.brand;
      ret.brandID = tshop.itemDO.brandId;
      ret.categoryID = tshop.itemDO.categoryId;
      ret.itemID = tshop.itemDO.itemId;
    }

    if (
      idobj &&
      idobj.defaultModel &&
      idobj.defaultModel.sellCountDO &&
      idobj.defaultModel.sellCountDO.sellCount
    ) {
      ret.strSellCount = idobj.defaultModel.sellCountDO.sellCount;
    }

    const skuret = procSKU(skus, tshop, idobj);
    if (skuret.error) {
      log.error('tmallDetail.procSKU', skuret.error);

      await page.close();

      return {error: skuret.error.toString()};
    }

    skus = skuret.lstsku;

    // if (tshop.valItemInfo && tshop.valItemInfo.skuMap) {
    //   const skumap = tshop.valItemInfo.skuMap;
    // for (let i = 0; i < skus.length; ++i) {
    //   if (skumap[';' + skus[i].value + ';']) {
    //     skus[i].originalPrice = parseFloat(
    //         skumap[';' + skus[i].value + ';'].price,
    //     );
    //     skus[i].skuid = skumap[';' + skus[i].value + ';'].skuId;
    //     skus[i].stock = skumap[';' + skus[i].value + ';'].stock;
    //   }

    //   if (
    //     idobj &&
    //     idobj.defaultModel &&
    //     idobj.defaultModel.deliveryDO &&
    //     idobj.defaultModel.deliveryDO.deliverySkuMap &&
    //     idobj.defaultModel.deliveryDO.deliverySkuMap[skus[i].skuid]
    //   ) {
    //     try {
    //       skus[i].wl =
    //         idobj.defaultModel.deliveryDO.deliverySkuMap[skus[i].skuid].name;
    //       skus[i].wlPrice = parseFloat(
    //           idobj.defaultModel.deliveryDO.deliverySkuMap[skus[i].skuid].money,
    //       );
    //     } catch (err) {
    //       log.error(
    //           'tmallDetail.parseFloat idobj.defaultModel.deliveryDO.deliverySkuMap[skus[i].skuid].money',
    //           awaiterr,
    //       );
    //     }
    //   }

    //   if (
    //     idobj &&
    //     idobj.defaultModel &&
    //     idobj.defaultModel.itemPriceResultDO &&
    //     idobj.defaultModel.itemPriceResultDO.priceInfo &&
    //     idobj.defaultModel.itemPriceResultDO.priceInfo[skus[i].skuid]
    //   ) {
    //     const cpi =
    //       idobj.defaultModel.itemPriceResultDO.priceInfo[skus[i].skuid]
    //           .promotionList;
    //     if (Array.isArray(cpi) && cpi.length > 0 && cpi[0].price) {
    //       try {
    //         skus[i].price = parseFloat(cpi[0].price);
    //       } catch (err) {
    //         log.error(
    //             'tmallDetail.parseFloat idobj.defaultModel.itemPriceResultDO.priceInfo[skus[i].skuid].promotionList',
    //             awaiterr,
    //         );
    //       }
    //     }
    //   }
    // }
    // }
  }

  ret.skus = skus;

  await page.close();

  return {ret: ret};
}

exports.tmallDetail = tmallDetail;
