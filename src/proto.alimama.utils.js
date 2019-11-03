const messages = require('../proto/result_pb');

/**
 * new AlimamaProduct with object
 * @param {object} obj - AlimamaProduct object
 * @return {messages.AlimamaProduct} result - AlimamaProduct
 */
function newAlimamaProduct(obj) {
  const result = new messages.AlimamaProduct();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.shop) {
    result.setShop(obj.shop);
  }

  if (obj.img) {
    result.setImg(obj.img);
  }

  if (obj.lastCoupon) {
    result.setLastcoupon(obj.lastCoupon);
  }

  if (obj.curPrice) {
    result.setCurprice(obj.curPrice);
  }

  if (obj.rebate) {
    result.setRebate(obj.rebate);
  }

  if (obj.commission) {
    result.setCommission(obj.commission);
  }

  if (obj.moneyQuan) {
    result.setMoneyquan(obj.moneyQuan);
  }

  if (Array.isArray(obj.shopType) && obj.shopType.length > 0) {
    result.setShoptypeList(obj.shopType);
  }

  if (obj.salesVolume) {
    result.setSalesvolume(obj.salesVolume);
  }

  if (obj.shopurl) {
    result.setShopurl(obj.shopurl);
  }

  if (obj.salesVolume2) {
    result.setSalesvolume2(obj.salesVolume2);
  }

  if (obj.presale) {
    result.setPresale(obj.presale);
  }

  if (obj.presaleProfit) {
    result.setPresaleprofit(obj.presaleProfit);
  }

  return result;
}

/**
 * new AlimamaTopProducts with object
 * @param {object} obj - AlimamaTopProducts object
 * @return {messages.AlimamaTopProducts} result - AlimamaTopProducts
 */
function newAlimamaTopProducts(obj) {
  const result = new messages.AlimamaTopProducts();

  if (Array.isArray(obj.category) && obj.category.length > 0) {
    result.setCategoryList(obj.category);
  }

  if (Array.isArray(obj.products) && obj.products.length > 0) {
    for (let i = 0; i < obj.products.length; ++i) {
      result.addProducts(newAlimamaProduct(obj.products[i], i));
    }
  }

  return result;
}

/**
 * new AlimamaTopInfo with object
 * @param {object} obj - AlimamaTopInfo object
 * @return {messages.AlimamaTopInfo} result - AlimamaTopInfo
 */
function newAlimamaTopInfo(obj) {
  const result = new messages.AlimamaTopInfo();

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newAlimamaTopProducts(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new AlimamaProducts with object
 * @param {object} obj - AlimamaProducts object
 * @return {messages.AlimamaProducts} result - AlimamaProducts
 */
function newAlimamaProducts(obj) {
  const result = new messages.AlimamaProducts();

  if (obj.text) {
    result.setText(obj.text);
  }

  if (Array.isArray(obj.products) && obj.products.length > 0) {
    for (let i = 0; i < obj.products.length; ++i) {
      result.addProducts(newAlimamaProduct(obj.products[i], i));
    }
  }

  return result;
}

/**
 * new ReplyAlimama with object
 * @param {number} mode - messages.JDMode
 * @param {object} obj - AlimamaProducts or AlimamaTopInfo or undefined object
 * @return {messages.ReplyAlimama} result - ReplyAlimama
 */
function newReplyAlimama(mode, obj) {
  const result = new messages.ReplyAlimama();

  result.setMode(mode);

  if (mode == messages.AlimamaMode.ALIMMM_SEARCH) {
    result.setProducts(newAlimamaProducts(obj));
  } else if (mode == messages.AlimamaMode.ALIMMM_GETTOP) {
    result.setTopinfo(newAlimamaTopInfo(obj));
  }

  return result;
}

exports.newReplyAlimama = newReplyAlimama;
