const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {closeDialog} = require('./utils');
const {waitForLocalFunction} = require('../waitutils');

/**
 * getSibResponseObj - get SibResponse object
 * @param {string} res - res
 * @return {object} ret - SibResponse object
 */
function getSibResponseObj(res) {
  res = String.fromCharCode.apply(null, res);

  res = res.replace(/\n/g, '');
  res = res.replace(/\t/g, '');
  const ret = /onSibRequestSuccess\((.+?)\)/.exec(res);
  if (ret[1]) {
    try {
      const retobj = JSON.parse(ret[1]);

      return retobj;
    } catch (err) {
      log.error('getSibResponseObj ', err);
    }
  }

  return undefined;
}

/**
 * taobaoItem - taobao item
 * @param {object} browser - browser
 * @param {string} itemid - itemid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function taobaoItem(browser, itemid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const waitAllResponse = new WaitAllResponse(page);

  let sibret;

  page.on('dialog', async (dlg) => {
    log.warn(dlg.message());
    await dlg.dismiss();
  });

  page.on('response', async (res) => {
    const url = res.url();

    if (url.indexOf('sib.htm') >= 0) {
      log.info('response', url);

      if (url.indexOf('onSibRequestSuccess') >= 0) {
        sibret = await res.buffer().catch((err) => {
          log.error('taobaoItem.WaitAllResponse.buffer ' + err);
        });
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
    log.error('taobaoItem.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://item.taobao.com/item.htm?id=' + itemid, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('taobaoItem.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('taobaoItem.waitDone timeout');

    log.error('taobaoItem.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  awaiterr = await closeDialog(page);
  if (awaiterr) {
    log.error('taobaoItem.closeDialog', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await waitForLocalFunction(
      page,
      () => {
        return sibret != undefined;
      },
      1000,
      timeout
  );
  if (awaiterr) {
    log.error('taobaoItem.waitForLocalFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const sibobj = getSibResponseObj(sibret);
  if (sibobj == undefined) {
    awaiterr = new Error('getSibResponseObj err! ' + sibret);

    log.error('taobaoItem.getSibResponseObj', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const mapStock = {};
  if (sibobj.data && sibobj.data.dynStock && sibobj.data.dynStock.sku) {
    for (const k in sibobj.data.dynStock.sku) {
      if (Object.prototype.hasOwnProperty.call(sibobj.data.dynStock.sku, k)) {
        mapStock[k] = sibobj.data.dynStock.sku[k].stock;
      }
    }
  }

  const mapPrice = {};
  let hasprice = false;
  if (sibobj.data && sibobj.data.promotion && sibobj.data.promotion.promoData) {
    for (const k in sibobj.data.promotion.promoData) {
      if (
        Object.prototype.hasOwnProperty.call(sibobj.data.promotion.promoData, k)
      ) {
        if (k != 'def') {
          mapPrice[k] = sibobj.data.promotion.promoData[k][0].price;

          hasprice = true;
        }
      }
    }
  }

  if (!hasprice && sibobj.data && sibobj.data.originalPrice) {
    for (const k in sibobj.data.originalPrice) {
      if (Object.prototype.hasOwnProperty.call(sibobj.data.originalPrice, k)) {
        if (k != 'def') {
          mapPrice[k] = sibobj.data.originalPrice[k].price;

          hasprice = true;
        }
      }
    }
  }

  const pay = [];
  if (
    sibobj.data &&
    sibobj.data.tradeContract &&
    sibobj.data.tradeContract.pay
  ) {
    for (let i = 0; i < sibobj.data.tradeContract.pay.length; ++i) {
      pay.push(
          unescape(sibobj.data.tradeContract.pay[i].title.replace(/\u/g, '%u'))
      );
    }
  }

  const service = [];
  if (
    sibobj.data &&
    sibobj.data.tradeContract &&
    sibobj.data.tradeContract.service
  ) {
    for (let i = 0; i < sibobj.data.tradeContract.service.length; ++i) {
      service.push(
          unescape(sibobj.data.tradeContract.service[i].title.replace(/\u/g, '%u'))
      );
    }
  }

  const skusret1 = await page
      .evaluate(() => {
        const skusret1 = {};

        if (
          Hub &&
        Hub.config &&
        Hub.config.config &&
        Hub.config.config.sku &&
        Hub.config.config.sku.valItemInfo &&
        Hub.config.config.sku.valItemInfo.propertyMemoMap
        ) {
          const mapTitle = {};

          for (const k in Hub.config.config.sku.valItemInfo.propertyMemoMap) {
            if (
              Object.prototype.hasOwnProperty.call(
                  Hub.config.config.sku.valItemInfo.propertyMemoMap,
                  k
              )
            ) {
              mapTitle[k] = Hub.config.config.sku.valItemInfo.propertyMemoMap[k];
            }
          }

          skusret1.mapTitle = mapTitle;
        }

        if (
          Hub &&
        Hub.config &&
        Hub.config.config &&
        Hub.config.config.sku &&
        Hub.config.config.sku.valItemInfo &&
        Hub.config.config.sku.valItemInfo.skuMap
        ) {
          const mapID = {};

          for (const k in Hub.config.config.sku.valItemInfo.skuMap) {
            if (
              Object.prototype.hasOwnProperty.call(
                  Hub.config.config.sku.valItemInfo.skuMap,
                  k
              )
            ) {
              mapID[k] = Hub.config.config.sku.valItemInfo.skuMap[k].skuId;
            }
          }

          skusret1.mapID = mapID;
        }

        return skusret1;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.evaluate Hub.config ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {};

  ret.title = await page
      .$$eval('.tb-main-title', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval .tb-main-title', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  //   const ret = {};
  const skus = await page
      .$$eval('.tb-skin', (eles) => {
        if (eles.length > 0) {
          const skus = [];
          const lis = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lis.length; ++i) {
            const csku = {
              value: lis[i].dataset['value'],
            };

            if (csku.value) {
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
    log.error('taobaoItem.$$eval .tb-skin', awaiterr);

    await page.close();

    return {error: awaiterr};
  }

  for (let i = 0; i < skus.length; ++i) {
    const arr = skus[i].curimg.split('("');
    if (arr.length == 2) {
      const arr1 = arr[1].split('")');
      skus[i].img = arr1[0];
      skus[i].img = skus[i].img.replace('30x30', '600x600');
      skus[i].img = 'https:' + skus[i].img;
    }

    if (mapStock[';' + skus[i].value + ';']) {
      skus[i].stock = parseInt(mapStock[';' + skus[i].value + ';']);
    }

    if (mapPrice[';' + skus[i].value + ';']) {
      skus[i].price = parseFloat(mapPrice[';' + skus[i].value + ';']);
    } else if (sibobj.data.price) {
      skus[i].price = parseFloat(sibobj.data.price);
    }

    if (skusret1 && skusret1.mapTitle[skus[i].value]) {
      skus[i].title = skusret1.mapTitle[skus[i].value];
    }

    if (skusret1 && skusret1.mapID[';' + skus[i].value + ';']) {
      skus[i].skuid = skusret1.mapID[';' + skus[i].value + ';'];
    }
  }

  console.log(skus);

  ret.reviews = await page
      .$$eval('#J_RateCounter', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval #J_RateCounter', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.salesVolume = await page
      .$$eval('#J_SellCounter', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval #J_SellCounter', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.attributes = await page
      .$$eval('.attributes-list', (eles) => {
        if (eles.length > 0) {
          const lstli = eles[0].getElementsByTagName('li');
          if (lstli.length > 0) {
            const attributes = [];

            for (let i = 0; i < lstli.length; ++i) {
              attributes.push(lstli[i].innerText);
            }

            return attributes;
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval #J_SellCounter', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const shopinfo = await page
      .$$eval('#J_ShopInfo', (eles) => {
        if (eles.length > 0) {
          const shopinfo = {};

          const lstname = eles[0].getElementsByClassName('tb-shop-name');
          if (lstname.length > 0) {
            shopinfo.name = lstname[0].innerText;
          }

          const lstrank = eles[0].getElementsByClassName('tb-shop-rank');
          if (lstrank.length > 0) {
            for (let i = 0; i < lstrank[0].classList.length; ++i) {
              if (lstrank[0].classList[i].indexOf('tb-rank-') >= 0) {
                const arr = lstrank[0].classList[i].split('tb-rank-');
                if (arr.length == 2) {
                  shopinfo.rank = arr[1];
                }
              }
            }

            shopinfo.rating = lstrank[0].getElementsByTagName('i').length;
          }

          const lstrate = eles[0].getElementsByClassName('tb-shop-rate');
          if (lstrate.length > 0) {
            shopinfo.lstlevel = [];
            shopinfo.lstscore = [];
            const lstdd = lstrate[0].getElementsByTagName('dd');
            for (let i = 0; i < lstdd.length; ++i) {
              shopinfo.lstlevel.push(lstdd[i].classList[0]);

              shopinfo.lstscore.push(lstdd[i].innerText);
            }
          }

          if (eles[0].getElementsByClassName('tb-gold-icon').length > 0) {
            shopinfo.gold = true;
          }

          return shopinfo;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval #J_ShopInfo', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.wl = await page
      .$$eval('#J_WlServiceTitle', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItem.$$eval #J_WlServiceTitle', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (shopinfo) {
    if (shopinfo.lstlevel && shopinfo.lstscore) {
      shopinfo.rateLevel = [];
      for (let i = 0; i < shopinfo.lstlevel.length; ++i) {
        if (shopinfo.lstlevel[i] == 'tb-rate-equal') {
          shopinfo.rateLevel.push(0);
        } else if (shopinfo.lstlevel[i] == 'tb-rate-lower') {
          shopinfo.rateLevel.push(-1);
        } else if (shopinfo.lstlevel[i] == 'tb-rate-higher') {
          shopinfo.rateLevel.push(1);
        }
      }

      shopinfo.rateScore = [];
      for (let i = 0; i < shopinfo.lstscore.length; ++i) {
        shopinfo.rateScore.push(parseFloat(shopinfo.lstscore[i]));
      }
    }
  }

  ret.shop = shopinfo;
  ret.skus = skus;
  ret.pay = pay;
  ret.service = service;

  await page.close();

  return {ret: ret};
}

exports.taobaoItem = taobaoItem;
