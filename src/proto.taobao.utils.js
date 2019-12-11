const messages = require('../proto/result_pb');

/**
 * new TaobaoSKUInfo with object
 * @param {object} obj - TaobaoSKUInfo object
 * @return {messages.TaobaoSKUInfo} result - TaobaoSKUInfo
 */
function newTaobaoSKUInfo(obj) {
  const result = new messages.TaobaoSKUInfo();

  if (obj.skuid) {
    result.setSkuid(obj.skuid);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.img) {
    result.setImg(obj.img);
  }

  if (obj.stock) {
    result.setStock(obj.stock);
  }

  return result;
}

/**
 * new TaobaoShopInfo with object
 * @param {object} obj - TaobaoShopInfo object
 * @return {messages.TaobaoShopInfo} result - TaobaoShopInfo
 */
function newTaobaoShopInfo(obj) {
  const result = new messages.TaobaoShopInfo();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.gold) {
    result.setGold(obj.gold);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.rank) {
    result.setRank(obj.rank);
  }

  if (obj.rating) {
    result.setRating(obj.rating);
  }

  if (Array.isArray(obj.rateLevel) && obj.rateLevel.length > 0) {
    result.setRatelevelList(obj.rateLevel);
  }

  if (Array.isArray(obj.rateScore) && obj.rateScore.length > 0) {
    result.setRatescoreList(obj.rateScore);
  }

  if (obj.shopid) {
    result.setShopid(obj.shopid);
  }

  return result;
}

/**
 * new TaobaoProduct with object
 * @param {object} obj - TaobaoProduct object
 * @return {messages.TaobaoProduct} result - TaobaoProduct
 */
function newTaobaoProduct(obj) {
  const result = new messages.TaobaoProduct();

  if (obj.itemID) {
    result.setItemid(obj.itemID);
  }

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.reviews) {
    result.setReviews(obj.reviews);
  }

  if (obj.salesVolume) {
    result.setSalesvolume(obj.salesVolume);
  }

  if (obj.shop) {
    result.setShop(newTaobaoShopInfo(obj.shop));
  }

  if (Array.isArray(obj.skus) && obj.skus.length > 0) {
    for (let i = 0; i < obj.skus.length; ++i) {
      result.addSkus(newTaobaoSKUInfo(obj.skus[i], i));
    }
  }

  if (Array.isArray(obj.attributes) && obj.attributes.length > 0) {
    result.setAttributesList(obj.attributes);
  }

  if (Array.isArray(obj.pay) && obj.pay.length > 0) {
    result.setPayList(obj.pay);
  }

  if (Array.isArray(obj.service) && obj.service.length > 0) {
    result.setServiceList(obj.service);
  }

  if (obj.wl) {
    result.setWl(obj.wl);
  }

  return result;
}

/**
 * new TaobaoItem with object
 * @param {object} obj - TaobaoItem object
 * @return {messages.TaobaoItem} result - TaobaoItem
 */
function newTaobaoItem(obj) {
  const result = new messages.TaobaoItem();

  if (obj.itemID) {
    result.setItemid(obj.itemID);
  }

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.img) {
    result.setImg(obj.img);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.shopname) {
    result.setShopname(obj.shopname);
  }

  if (obj.shopid) {
    result.setShopid(obj.shopid);
  }

  if (obj.shopurl) {
    result.setShopurl(obj.shopurl);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.deal) {
    result.setDeal(obj.deal);
  }

  if (Array.isArray(obj.icons) && obj.icons.length > 0) {
    result.setIconsList(obj.icons);
  }

  if (obj.isAD) {
    result.setIsad(obj.isAD);
  }

  if (obj.strDeal) {
    result.setStrdeal(obj.strDeal);
  }

  return result;
}

/**
 * new TaobaoSearchResult with object
 * @param {object} obj - TaobaoSearchResult object
 * @return {messages.TaobaoSearchResult} result - TaobaoSearchResult
 */
function newTaobaoSearchResult(obj) {
  const result = new messages.TaobaoSearchResult();

  if (Array.isArray(obj.items) && obj.items.length > 0) {
    for (let i = 0; i < obj.items.length; ++i) {
      result.addItems(newTaobaoItem(obj.items[i], i));
    }
  }

  if (obj.text) {
    result.setText(obj.text);
  }

  return result;
}

/**
 * new newReplyTaobao with object
 * @param {number} mode - messages.TaobaoMode
 * @param {object} obj - TaobaoProduct
 * @return {messages.ReplyTmall} result - ReplyTaobao
 */
function newReplyTaobao(mode, obj) {
  const result = new messages.ReplyTaobao();

  result.setMode(mode);

  if (mode == messages.TaobaoMode.TBM_PRODUCT) {
    result.setProduct(newTaobaoProduct(obj));
  } else if (mode == messages.TaobaoMode.TBM_SEARCH) {
    result.setSearchresult(newTaobaoSearchResult(obj));
  }

  return result;
}

exports.newReplyTaobao = newReplyTaobao;
