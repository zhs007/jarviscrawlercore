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
  }

  return result;
}

exports.newReplyTaobao = newReplyTaobao;
