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

  if (obj.valueid) {
    result.setValueid(obj.valueid);
  }

  if (obj.itemid) {
    result.setItemid(obj.itemid);
  }

  return result;
}

/**
 * new TaobaoRelatedItem with object
 * @param {object} obj - TaobaoRelatedItem object
 * @return {messages.TaobaoRelatedItem} result - TaobaoRelatedItem
 */
function newTaobaoRelatedItem(obj) {
  const result = new messages.TaobaoRelatedItem();

  if (obj.itemID) {
    result.setItemid(obj.itemID);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.isCurrent) {
    result.setIscurrent(obj.isCurrent);
  }

  return result;
}

/**
 * new TaobaoReviewTag with object
 * @param {object} obj - TaobaoReviewTag object
 * @return {messages.TaobaoReviewTag} result - TaobaoReviewTag
 */
function newTaobaoReviewTag(obj) {
  const result = new messages.TaobaoReviewTag();

  if (obj.tag) {
    result.setTag(obj.tag);
  }

  if (obj.times) {
    result.setTimes(obj.times);
  }

  if (obj.type) {
    result.setType(obj.type);
  }

  return result;
}

/**
 * new TaobaoProperty with object
 * @param {object} obj - TaobaoProperty object
 * @return {messages.TaobaoProperty} result - TaobaoProperty
 */
function newTaobaoProperty(obj) {
  const result = new messages.TaobaoProperty();

  if (obj.rootIndex) {
    result.setRootindex(obj.rootIndex);
  }

  if (obj.rootName) {
    result.setRootname(obj.rootName);
  }

  if (obj.key) {
    result.setKey(obj.key);
  }

  if (obj.value) {
    result.setValue(obj.value);
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

  if (obj.userid) {
    result.setUserid(obj.userid);
  }

  if (obj.creditLevel) {
    result.setCreditlevel(obj.creditLevel);
  }

  if (obj.allItemCount) {
    result.setAllitemcount(obj.allItemCount);
  }

  if (obj.newItemCount) {
    result.setNewitemcount(obj.newItemCount);
  }

  if (obj.strFans) {
    result.setStrfans(obj.strFans);
  }

  if (obj.goodRatePercentage) {
    result.setGoodratepercentage(obj.goodRatePercentage);
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

  if (obj.rootCategoryID) {
    result.setRootcategoryid(obj.rootCategoryID);
  }

  if (obj.categoryID) {
    result.setCategoryid(obj.categoryID);
  }

  if (obj.tbItemID) {
    result.setTbitemid(obj.tbItemID);
  }

  if (obj.brandValueID) {
    result.setBrandvalueid(obj.brandValueID);
  }

  if (obj.favCount) {
    result.setFavcount(obj.favCount);
  }

  if (Array.isArray(obj.imgs) && obj.imgs.length > 0) {
    result.setImgsList(obj.imgs);
  }

  if (Array.isArray(obj.reviewTags) && obj.reviewTags.length > 0) {
    for (let i = 0; i < obj.reviewTags.length; ++i) {
      result.addReviewtags(newTaobaoReviewTag(obj.reviewTags[i], i));
    }
  }

  if (Array.isArray(obj.props) && obj.props.length > 0) {
    for (let i = 0; i < obj.props.length; ++i) {
      result.addProps(newTaobaoProperty(obj.props[i], i));
    }
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (Array.isArray(obj.relatedItems) && obj.relatedItems.length > 0) {
    for (let i = 0; i < obj.relatedItems.length; ++i) {
      result.addRelateditems(newTaobaoRelatedItem(obj.relatedItems[i], i));
    }
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

  if (
    mode == messages.TaobaoMode.TBM_PRODUCT ||
    mode == messages.TaobaoMode.TBM_MOBILEPRODUCT
  ) {
    result.setProduct(newTaobaoProduct(obj));
  } else if (mode == messages.TaobaoMode.TBM_SEARCH) {
    result.setSearchresult(newTaobaoSearchResult(obj));
  }

  return result;
}

exports.newReplyTaobao = newReplyTaobao;
