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

  if (mode == messages.TmallMode.TMM_PRODUCT) {
    result.setProduct(newTmallProduct(obj));
  }

  return result;
}

exports.newReplyTmall = newReplyTmall;
