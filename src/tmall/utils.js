// const {sleep} = require('../utils');
// const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');

/**
 * closeDialog - close dialog
 * @param {object} page - page
 * @return {error} err - error
 */
async function closeDialog(page) {
  let awaiterr;

  const lstbtn = await page.$$('#sufei-dialog-close').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  if (lstbtn.length > 0) {
    await lstbtn[0].hover();

    await lstbtn[0].click();
  }
  // const frames = await page.frames();
  // for (let i = 0; i < frames.length; ++i) {
  //   if (frames[i]._name == 'sufei-dialog-content') {
  //     const lstbtn = await frames[i].$$('#sufei-dialog-close').catch((err) => {
  //       awaiterr = err;
  //     });
  //     if (awaiterr) {
  //       return awaiterr;
  //     }

  //     if (lstbtn.length > 0) {
  //       await lstbtn[0].hover();

  //       await lstbtn[0].click();
  //     }

  //     return undefined;
  //   }
  // }

  return undefined;
}

/**
 * findSKUType - find skutype
 * @param {object} lstskut - sku type list
 * @param {string} typevalue - typevalue, if value is 5919063:6536025, the typevalue is 5919063
 * @return {object} skuobj - sku object
 */
function findSKUType(lstskut, typevalue) {
  for (let i = 0; i < lstskut.length; ++i) {
    if (lstskut[i].typevalue == typevalue) {
      return lstskut[i];
    }
  }

  return undefined;
}

/**
 * procSKU - 处理SKU数据，支持多种选择
 *    因为可能有多种分类，譬如颜色和套餐，所以这块需要有一点点的逻辑处理
 * @param {object} skus - skus, [{title, value, curimg, img}]
 * @param {object} tshop - tshop
 * @param {object} idobj - idobj, https://mdskip.taobao.com/core/initItemDetail.htm的返回
 * @return {object} ret - {lstskut, lstsku, error}
 */
function procSKU(skus, tshop, idobj) {
  const lstskut = [];
  for (let i = 0; i < skus.length; ++i) {
    if (skus[i].value) {
      const cvarr = skus[i].value.split(':');
      if (cvarr && cvarr.length == 2) {
        let cursku = findSKUType(lstskut, cvarr[0]);
        if (cursku == undefined) {
          cursku = {
            typevalue: cvarr[0],
            skus: [],
          };

          lstskut.push(cursku);
        }

        cursku.skus.push(skus[i]);
      } else {
        log.warn('tmall.procSKU() invalid skus[i].value.split ' + skus[i].value);
        // return {
        //   error: new Error('tmall.procSKU() invalid skus[i].value.split'),
        // };
      }
    } else {
      return {error: new Error('tmall.procSKU() invalid skus[i].value')};
    }
  }

  let lstsku = [];
  if (tshop.valItemInfo && tshop.valItemInfo.skuMap) {
    const skumap = tshop.valItemInfo.skuMap;
    if (lstskut.length == 0) {
      return {lstsku: [], lstskut: []};
    } else if (lstskut.length == 1) {
      lstsku = skus;
    } else if (lstskut.length == 2) {
      for (let i = 0; i < lstskut[0].skus.length; ++i) {
        for (let j = 0; j < lstskut[1].skus.length; ++j) {
          const cskuid =
            lstskut[0].skus[i].value + ';' + lstskut[1].skus[j].value;
          if (skumap[';' + cskuid + ';']) {
            const cv = {value: cskuid};

            if (lstskut[0].skus[i].title && lstskut[1].skus[j].title) {
              cv.title =
                lstskut[0].skus[i].title + ' ' + lstskut[1].skus[j].title;
            } else if (lstskut[0].skus[i].title) {
              cv.title = lstskut[0].skus[i].title;
            } else {
              cv.title = lstskut[1].skus[j].title;
            }

            if (lstskut[0].skus[i].curimg) {
              cv.curimg = lstskut[0].skus[i].curimg;
            } else if (lstskut[1].skus[j].curimg) {
              cv.curimg = lstskut[1].skus[j].curimg;
            }

            if (lstskut[0].skus[i].img) {
              cv.img = lstskut[0].skus[i].img;
            } else if (lstskut[1].skus[j].img) {
              cv.img = lstskut[1].skus[j].img;
            }

            lstsku.push(cv);
          }
        }
      }
    } else {
      // 3个暂时报错，我需要看看数据到底是怎样的
      return {error: new Error('tmall.procSKU() invalid lstskut.length')};
    }

    for (let i = 0; i < lstsku.length; ++i) {
      if (skumap[';' + lstsku[i].value + ';']) {
        lstsku[i].originalPrice = parseFloat(
            skumap[';' + lstsku[i].value + ';'].price,
        );
        lstsku[i].skuid = skumap[';' + lstsku[i].value + ';'].skuId;
        lstsku[i].stock = skumap[';' + lstsku[i].value + ';'].stock;
      }

      if (
        idobj &&
        idobj.defaultModel &&
        idobj.defaultModel.deliveryDO &&
        idobj.defaultModel.deliveryDO.deliverySkuMap &&
        idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid] &&
        Array.isArray(
            idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid],
        ) &&
        idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid].length > 0
      ) {
        if (
          idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid][0]
              .postage
        ) {
          lstsku[i].wlStr =
            idobj.defaultModel.deliveryDO.deliverySkuMap[
                lstsku[i].skuid
            ][0].postage;
        } else if (
          idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid][0]
              .name &&
          idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid][0].money
        ) {
          try {
            lstsku[i].wl =
              idobj.defaultModel.deliveryDO.deliverySkuMap[
                  lstsku[i].skuid
              ][0].name;
            lstsku[i].wlPrice = parseFloat(
                idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid][0]
                    .money,
            );
          } catch (err) {
            return {
              error: new Error(
                  'tmall.procSKU() parseFloat idobj.defaultModel.deliveryDO.deliverySkuMap[lstsku[i].skuid].money ' +
                  err.message,
              ),
            };
          }
        }
      }

      if (
        idobj &&
        idobj.defaultModel &&
        idobj.defaultModel.itemPriceResultDO &&
        idobj.defaultModel.itemPriceResultDO.priceInfo &&
        idobj.defaultModel.itemPriceResultDO.priceInfo[lstsku[i].skuid]
      ) {
        const cpi =
          idobj.defaultModel.itemPriceResultDO.priceInfo[lstsku[i].skuid]
              .promotionList;
        if (Array.isArray(cpi) && cpi.length > 0 && cpi[0].price) {
          try {
            lstsku[i].price = parseFloat(cpi[0].price);
          } catch (err) {
            return {
              error: new Error(
                  'tmall.procSKU() parseFloat idobj.defaultModel.itemPriceResultDO.priceInfo[lstsku[i].skuid].promotionList ' +
                  err.message,
              ),
            };
          }
        }
      }
    }
  }

  return {lstsku: lstsku, lstskut: lstskut};
}

exports.closeDialog = closeDialog;
exports.procSKU = procSKU;
