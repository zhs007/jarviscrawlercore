// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {chgPageDevice} = require('../puppeteer.utils');
const {parseJSONP} = require('../jsonp.utils');
const {waitForLocalFunction} = require('../waitutils');
const {
  string2int,
  percentage2float,
  string2json,
  string2float,
} = require('../string.utils');
const {fixProduct} = require('./utils');

/**
 * parseGetDetailResult - parse getdetail result
 * @param {buffer} result - result buffer
 * @param {string} url - url
 * @return {object} ret - {error, obj}
 */
function parseGetDetailResult(result, url) {
  try {
    const str = result.toString();

    const urlret = new URL(url);
    const urltype = urlret.searchParams.get('type');
    if (urltype == 'jsonp') {
      const urlcallback = urlret.searchParams.get('callback');

      return parseJSONP(str, urlcallback);
    } else {
      return {
        error: new Error('parseGetDetailResult invalid urltype ' + url),
      };
    }
  } catch (err) {
    log.warn('parseGetDetailResult', err);

    return {error: new Error('parseGetDetailResult ' + err)};
  }
}

/**
 * findInSKUs - find in skus
 * @param {array} lstskuid - lstskuid
 * @param {string} value - value, is like 1627207:28321;5919063:3266781
 * @return {string} skuid - skuid
 */
function findInSKUs(lstskuid, value) {
  for (let i = 0; i < lstskuid.length; ++i) {
    if (lstskuid[i].propPath == value) {
      return lstskuid[i].skuId;
    }
  }

  return undefined;
}

/**
 * parseSKU - parse sku
 * @param {object} obj - obj
 * @return {object} ret - {error, skus}
 */
function parseSKU(obj) {
  try {
    if (obj && obj.data && obj.data.skuBase) {
      const skubase = obj.data.skuBase;
      if (!(Array.isArray(skubase.skus) && skubase.skus.length > 0)) {
        const err = new Error('parseSKU invalid skubase.skus');

        log.warn('parseSKU skubase.skus', err);

        return {error: err};
      }

      const strmock = obj.data.mockData;
      let mapsku = {};
      if (strmock) {
        const mock = string2json(strmock);
        if (mock.error) {
          log.warn('parseSKU string2json obj.data.mockData', mock.error);
        } else if (mock.obj && mock.obj.skuCore && mock.obj.skuCore.sku2info) {
          mapsku = mock.obj.skuCore.sku2info;
        } else {
          const err = new Error('parseSKU no skuCore.sku2info');

          log.warn('parseSKU skuCore.sku2info', err);
        }
      }

      if (Array.isArray(skubase.props) && skubase.props.length > 0) {
        if (skubase.props.length == 1) {
          if (
            skubase.props[0] &&
            Array.isArray(skubase.props[0].values) &&
            skubase.props[0].values.length > 0
          ) {
            const skus = [];
            for (let i = 0; i < skubase.props[0].values.length; ++i) {
              const sku = {};
              const cv = skubase.props[0].values[i];

              if (cv.name) {
                sku.title = cv.name;
              }

              if (cv.vid) {
                sku.valueid = skubase.props[0].pid + ':' + cv.vid;
              }

              if (cv.image) {
                sku.img = cv.image;
              }

              const skuid = findInSKUs(skubase.skus, sku.valueid);
              if (skuid) {
                sku.skuid = skuid;
              }

              if (
                mapsku[skuid] &&
                mapsku[skuid].price &&
                mapsku[skuid].price.priceText
              ) {
                const pt = string2float(mapsku[skuid].price.priceText);
                if (pt.error) {
                  log.warn(
                      'parseSKU string2float mapsku[skuid].price.priceText',
                      pt.error,
                  );
                } else {
                  sku.price = pt.num;
                }
              }

              // const skuidr = string2int(skuid);
              // if (skuidr.error) {
              //   log.warn('parseSKU string2int skuid', skuidr.error);
              // } else {
              //   if (
              //     mapsku[skuidr.num] &&
              //     mapsku[skuidr.num].price &&
              //     mapsku[skuidr.num].price.priceText
              //   ) {
              //     const pt = string2float(mapsku[skuidr.num].priceText);
              //     if (pt.error) {
              //       log.warn(
              //           'parseSKU string2float mapsku[skuid].priceText',
              //           pt.error,
              //       );
              //     } else {
              //       ret.price = pt.num;
              //     }
              //   }
              // }

              skus.push(sku);

              // int32 stock = 5;
            }

            return {skus: skus};
          } else {
            const err = new Error('parseSKU invalid skubase.props[0].values');

            log.warn('parseSKU', err);

            return {error: err};
          }
        } else if (skubase.props.length == 2) {
          if (
            skubase.props[0] &&
            Array.isArray(skubase.props[0].values) &&
            skubase.props[0].values.length > 0 &&
            skubase.props[1] &&
            Array.isArray(skubase.props[1].values) &&
            skubase.props[1].values.length > 0
          ) {
            const skus = [];
            for (let i = 0; i < skubase.props[0].values.length; ++i) {
              for (let j = 0; j < skubase.props[1].values.length; ++j) {
                const sku = {
                  title: '',
                  valueid: '',
                };
                const cv0 = skubase.props[0].values[i];
                const cv1 = skubase.props[1].values[j];

                if (cv0.name) {
                  sku.title += cv0.name;
                }

                if (cv1.name) {
                  sku.title += cv1.name;
                }

                if (cv0.vid) {
                  sku.valueid += skubase.props[0].pid + ':' + cv0.vid;
                }

                if (cv1.vid) {
                  if (sku.valueid != '') {
                    sku.valueid += ';';
                  }

                  sku.valueid += skubase.props[1].pid + ':' + cv1.vid;
                }

                if (cv0.image) {
                  sku.img = cv0.image;
                }

                if (cv1.image) {
                  sku.img = cv1.image;
                }

                const skuid = findInSKUs(skubase.skus, sku.valueid);
                if (skuid) {
                  sku.skuid = skuid;
                }

                if (
                  mapsku[skuid] &&
                  mapsku[skuid].price &&
                  mapsku[skuid].price.priceText
                ) {
                  const pt = string2float(mapsku[skuid].price.priceText);
                  if (pt.error) {
                    log.warn(
                        'parseSKU string2float mapsku[skuid].price.priceText',
                        pt.error,
                    );
                  } else {
                    sku.price = pt.num;
                  }
                }

                skus.push(sku);

                // int32 stock = 5;
              }
            }

            return {skus: skus};
          } else {
            const err = new Error(
                'parseSKU invalid skubase.props[0].values skubase.props[1].values',
            );

            log.warn('parseSKU', err);

            return {error: err};
          }
        } else {
          const err = new Error(
              'parseSKU invalid skubase.props.length ' + skubase.props.length,
          );

          log.warn('parseSKU', err);

          return {error: err};
        }
      }
    }
  } catch (err) {
    log.warn('parseSKU', err);

    return {error: err};
  }
}

/**
 * tmallDetailMobile - taobao item mobile
 * @param {object} browser - browser
 * @param {string} itemid - itemid
 * @param {string} device - device
 * @param {string} cfgdevice - device in configuration
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmallDetailMobile(browser, itemid, device, cfgdevice, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  let curdevice = device;
  if (!curdevice || curdevice == '') {
    curdevice = cfgdevice;
  }

  awaiterr = await chgPageDevice(page, curdevice);
  if (awaiterr) {
    log.error('tmallDetailMobile.chgPageDevice', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const waitAllResponse = new WaitAllResponse(page);

  let getdetailret;
  let getdetailurl;

  page.on('dialog', async (dlg) => {
    log.warn(dlg.message());
    await dlg.dismiss();
  });

  page.on('response', async (res) => {
    const url = res.url();

    if (
      url.indexOf(
          'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail',
      ) >= 0
    ) {
      getdetailurl = url;

      log.info('response ok', url);

      getdetailret = await res.buffer().catch((err) => {
        log.error('tmallDetailMobile.WaitAllResponse.buffer ' + err);
      });
    }
  });

  await page
      .goto('https://detail.m.tmall.com/item.htm?id=' + itemid, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmallDetailMobile.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmallDetailMobile.waitDone timeout');

    log.error('tmallDetailMobile.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  awaiterr = await waitForLocalFunction(
      page,
      () => {
        return getdetailret != undefined;
      },
      1000,
      timeout,
  );
  if (awaiterr) {
    log.error('tmallDetailMobile.waitForLocalFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const detailobj = parseGetDetailResult(getdetailret, getdetailurl);
  if (detailobj.error) {
    awaiterr = detailobj.error;

    log.error('tmallDetailMobile.parseGetDetailResult', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {
    itemID: itemid,
  };

  if (detailobj.obj && detailobj.obj.data && detailobj.obj.data.item) {
    const curitem = detailobj.obj.data.item;

    if (curitem.title) {
      ret.title = curitem.title;
    }

    if (curitem.commentCount) {
      const cc = string2int(curitem.commentCount);
      if (cc.error) {
        log.warn('tmallDetailMobile.string2int commentCount', cc.error);
      } else {
        ret.reviews = cc.num;
      }
    }

    if (curitem.itemId) {
      ret.tbItemID = curitem.itemId;
    }

    if (curitem.rootCategoryId) {
      ret.rootCategoryID = curitem.rootCategoryId;
    }

    if (curitem.categoryId) {
      ret.categoryID = curitem.categoryId;
    }

    if (curitem.brandValueId) {
      ret.brandValueID = curitem.brandValueId;
    }

    if (curitem.favcount) {
      const fc = string2int(curitem.favcount);
      if (fc.error) {
        log.warn('tmallDetailMobile.string2int favcount', fc.error);
      } else {
        ret.favCount = fc.num;
      }
    }

    if (curitem.images) {
      ret.imgs = curitem.images;
    }
  }

  if (detailobj.obj && detailobj.obj.data && detailobj.obj.data.seller) {
    const seller = detailobj.obj.data.seller;
    ret.shop = {};

    if (seller.shopName) {
      ret.shop.name = seller.shopName;
    }

    if (seller.shopId) {
      ret.shop.shopid = seller.shopId;
    }

    if (seller.userId) {
      ret.shop.userid = seller.userId;
    }

    if (seller.creditLevel) {
      const cl = string2int(seller.creditLevel);
      if (cl.error) {
        log.warn('tmallDetailMobile.string2int seller.creditLevel', cl.error);
      } else {
        ret.shop.creditLevel = cl.num;
      }
    }

    if (seller.allItemCount) {
      const aic = string2int(seller.allItemCount);
      if (aic.error) {
        log.warn('tmallDetailMobile.string2int seller.allItemCount', aic.error);
      } else {
        ret.shop.allItemCount = aic.num;
      }
    }

    if (seller.newItemCount) {
      const nic = string2int(seller.newItemCount);
      if (nic.error) {
        log.warn('tmallDetailMobile.string2int seller.newItemCount', nic.error);
      } else {
        ret.shop.newItemCount = nic.num;
      }
    }

    if (seller.fans) {
      ret.shop.strFans = seller.fans;
    }

    if (seller.goodRatePercentage) {
      const grp = percentage2float(seller.goodRatePercentage);
      if (grp.error) {
        log.warn(
            'tmallDetailMobile.percentage2float seller.goodRatePercentage',
            grp.error,
        );
      } else {
        ret.shop.goodRatePercentage = grp.num;
      }
    }

    // bool gold = 2;
    // string url = 3;
    // string rank = 4;    // cap/gold ...
    // int32 rating = 5;   // 3/4/5 ...
    // repeated int32 rateLevel = 6;   // 描述、服务、物流，-1表示低，0表示等于，1表示高
    // repeated float rateScore = 7;   // 描述、服务、物流，具体分数
  }

  if (detailobj.obj) {
    const skuret = parseSKU(detailobj.obj);
    if (skuret.error) {
      awaiterr = skuret.error;

      log.error('tmallDetailMobile.parseSKU', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.skus = skuret.skus;
  }

  // repeated string attributes = 6;
  // TaobaoShopInfo shop = 7;
  // int32 salesVolume = 8;          // 月销量
  // repeated string pay = 9;        // 支付列表，譬如信用卡等
  // repeated string service = 10;   // 服务承诺列表，譬如7天无理由退换等
  // string wl = 11;                 // 物流服务

  await page.close();

  return {ret: fixProduct(ret)};
}

exports.tmallDetailMobile = tmallDetailMobile;
