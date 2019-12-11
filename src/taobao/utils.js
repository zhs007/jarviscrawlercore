const {holdBarMove} = require('../captcha.js');

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
 * nocaptcha - nocaptcha
 * @param {object} page - page
 * @return {object} ret - {isnocaptcha, error}
 */
async function nocaptcha(page) {
  let awaiterr;
  const frames = await page.frames();
  for (let i = 0; i < frames.length; ++i) {
    if (frames[i]._name == 'sufei-dialog-content') {
      const lstnocaptcha = await frames[i].$$('#nocaptcha').catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return {error: awaiterr};
      }

      if (lstnocaptcha.length > 0) {
        const lstcoscale = await frames[i].$$('.nc_scale').catch((err) => {
          awaiterr = err;
        });
        if (awaiterr) {
          return {error: awaiterr};
        }

        const lstslide = await frames[i]
            .$$('.nc_iconfont.btn_slide')
            .catch((err) => {
              awaiterr = err;
            });
        if (awaiterr) {
          return {error: awaiterr};
        }

        if (lstslide.length > 0 && lstcoscale.length > 0) {
          const bbbox0 = await lstslide[0].boundingBox();
          const bbbox1 = await lstcoscale[0].boundingBox();

          await holdBarMove(page, bbbox0, bbbox1, 500, Math.floor(1000 / 60));

          return {isnocaptcha: true};
        }
      }
    }
  }

  return {isnocaptcha: false};
}

/**
 * findSKUType - find skutype
 * @param {object} lstskut - sku type list
 * @param {string} typevalue - typevalue, if value is 5919063:6536025, the typevalue is 5919063
 * @return {object} skutypeobj - skutype object
 */
function findSKUType(lstskut, typevalue) {
  for (let i = 0; i < lstskut.length; ++i) {
    if (lstskut[i].typevalue == typevalue) {
      return lstskut[i];
    }
  }

  return undefined;
}

// /**
//  * findSKU - find sku
//  * @param {object} lstsku - sku list
//  * @param {string} value - value, if value like 5919063:6536025
//  * @return {object} skuobj - sku object
//  */
// function findSKU(lstsku, value) {
//   for (let i = 0; i < lstsku.length; ++i) {
//     if (lstsku[i].value == value) {
//       return lstsku[i];
//     }
//   }

//   return undefined;
// }

/**
 * procSKU - 处理SKU数据，支持多种选择
 *    因为可能有多种分类，譬如颜色和套餐，所以这块需要有一点点的逻辑处理
 * @param {object} skus - skus, [{value, curimg}]
 * @param {object} tbtxt - tbtxt from .tb-txt, map[value] => title
 * @param {object} skusret - skusret from Hub
 * @param {object} sibobj - sibobj, sib.htm onSibRequestSuccess的返回
 * @return {object} ret - {lstskut, lstsku, error}
 */
function procSKU(skus, tbtxt, skusret, sibobj) {
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
        return {
          error: new Error('taobao.procSKU() invalid skus[i].value.split'),
        };
      }
    } else {
      return {error: new Error('taobao.procSKU() invalid skus[i].value')};
    }
  }

  for (let i = 0; i < skus.length; ++i) {
    if (skus[i].curimg) {
      const arr = skus[i].curimg.split('("');
      if (arr.length == 2) {
        const arr1 = arr[1].split('")');
        skus[i].img = arr1[0];
        skus[i].img = skus[i].img.replace('30x30', '600x600');
        skus[i].img = 'https:' + skus[i].img;
      }
    }

    if (skusret && skusret.mapTitle[skus[i].value]) {
      skus[i].title = skusret.mapTitle[skus[i].value];
    }

    if (tbtxt && tbtxt[skus[i].value]) {
      skus[i].title = tbtxt[skus[i].value];
    }
  }

  let lstsku = [];
  if (lstskut.length == 0) {
    return {lstsku: [], lstskut: []};
  } else if (lstskut.length == 1) {
    lstsku = skus;
  } else if (lstskut.length == 2) {
    for (let i = 0; i < lstskut[0].skus.length; ++i) {
      for (let j = 0; j < lstskut[1].skus.length; ++j) {
        const cskuid =
          lstskut[0].skus[i].value + ';' + lstskut[1].skus[j].value;
        if (skusret.mapID[';' + cskuid + ';']) {
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
    return {error: new Error('taobao.procSKU() invalid lstskut.length')};
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
        if (k != 'def' && Array.isArray(sibobj.data.promotion.promoData[k])) {
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

  for (let i = 0; i < lstsku.length; ++i) {
    try {
      if (mapStock[';' + lstsku[i].value + ';']) {
        lstsku[i].stock = parseInt(mapStock[';' + lstsku[i].value + ';']);
      }

      if (mapPrice[';' + lstsku[i].value + ';']) {
        lstsku[i].price = parseFloat(mapPrice[';' + lstsku[i].value + ';']);
      } else if (sibobj.data && sibobj.data.price) {
        lstsku[i].price = parseFloat(sibobj.data.price);
      }

      if (skusret && skusret.mapID[';' + lstsku[i].value + ';']) {
        lstsku[i].skuid = skusret.mapID[';' + lstsku[i].value + ';'];
      }
    } catch (err) {
      return {
        error: new Error('taobao.procSKU() parse lstsku value ' + err.message),
      };
    }
  }

  return {lstsku: lstsku, lstskut: lstskut};
}

exports.closeDialog = closeDialog;
exports.nocaptcha = nocaptcha;
exports.procSKU = procSKU;
