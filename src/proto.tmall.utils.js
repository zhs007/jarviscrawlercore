const messages = require('../proto/result_pb');

/**
 * new TmallSKUInfo with object
 * @param {object} obj - TmallSKUInfo object
 * @return {messages.TmallSKUInfo} result - TmallSKUInfo
 */
function newTmallSKUInfo(obj) {
  const result = new messages.TmallSKUInfo();

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

  if (obj.originalPrice) {
    result.setOriginalprice(obj.originalPrice);
  }

  if (obj.wl) {
    result.setWl(obj.wl);
  }

  if (obj.wlPrice) {
    result.setWlprice(obj.wlPrice);
  }

  if (obj.wlStr) {
    result.setWlstr(obj.wlStr);
  }

  return result;
}

/**
 * new TmallReviewTag with object
 * @param {object} obj - TmallReviewTag object
 * @return {messages.TmallReviewTag} result - TmallReviewTag
 */
function newTmallReviewTag(obj) {
  const result = new messages.TmallReviewTag();

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
 * new TmallProperty with object
 * @param {object} obj - TmallProperty object
 * @return {messages.TmallProperty} result - TmallProperty
 */
function newTmallProperty(obj) {
  const result = new messages.TmallProperty();

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
 * new TmallShopInfo with object
 * @param {object} obj - TmallShopInfo object
 * @return {messages.TmallShopInfo} result - TmallShopInfo
 */
function newTmallShopInfo(obj) {
  const result = new messages.TmallShopInfo();

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
 * new TmallProduct with object
 * @param {object} obj - TmallProduct object
 * @return {messages.TmallProduct} result - TmallProduct
 */
function newTmallProduct(obj) {
  const result = new messages.TmallProduct();

  if (obj.itemID) {
    result.setItemid(obj.itemID);
  }

  if (obj.brand) {
    result.setBrand(obj.brand);
  }

  if (obj.brandID) {
    result.setBrandid(obj.brandID);
  }

  if (obj.categoryID) {
    result.setCategoryid(obj.categoryID);
  }

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.newinfo) {
    result.setNewinfo(obj.newinfo);
  }

  if (obj.reviews) {
    result.setReviews(obj.reviews);
  }

  if (obj.rating) {
    result.setRating(obj.rating);
  }

  if (Array.isArray(obj.skus) && obj.skus.length > 0) {
    for (let i = 0; i < obj.skus.length; ++i) {
      result.addSkus(newTmallSKUInfo(obj.skus[i], i));
    }
  }

  if (Array.isArray(obj.reviewTags) && obj.reviewTags.length > 0) {
    for (let i = 0; i < obj.reviewTags.length; ++i) {
      result.addReviewtags(newTmallReviewTag(obj.reviewTags[i], i));
    }
  }

  if (obj.sellCount) {
    result.setSellcount(obj.sellCount);
  }

  if (obj.strSellCount) {
    result.setStrsellcount(obj.strSellCount);
  }

  if (obj.rootCategoryID) {
    result.setRootcategoryid(obj.rootCategoryID);
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

  if (obj.shop) {
    result.setShop(newTmallShopInfo(obj.shop));
  }

  if (Array.isArray(obj.props) && obj.props.length > 0) {
    for (let i = 0; i < obj.props.length; ++i) {
      result.addProps(newTmallProperty(obj.props[i], i));
    }
  }

  return result;
}

/**
 * new newReplyTmall with object
 * @param {number} mode - messages.TmallMode
 * @param {object} obj - TmallProduct
 * @return {messages.ReplyTmall} result - ReplyTmall
 */
function newReplyTmall(mode, obj) {
  const result = new messages.ReplyTmall();

  result.setMode(mode);

  if (
    mode == messages.TmallMode.TMM_PRODUCT ||
    mode == messages.TmallMode.TMM_MOBILEPRODUCT
  ) {
    result.setProduct(newTmallProduct(obj));
  }

  return result;
}

exports.newReplyTmall = newReplyTmall;
