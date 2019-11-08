const messages = require('../proto/result_pb');

/**
 * new SteepAndCheapColorSize2 with object
 * @param {object} obj - SteepAndCheapColorSize2 object
 * @return {messages.SteepAndCheapColorSize2} result - SteepAndCheapColorSize2
 */
function newSteepAndCheapColorSize2(obj) {
  const result = new messages.SteepAndCheapColorSize2();

  if (obj.color) {
    result.setColor(obj.color);
  }

  if (obj.size) {
    result.setSize(obj.size);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  return result;
}

/**
 * new SteepAndCheapColorSize with object
 * @param {object} obj - SteepAndCheapColorSize object
 * @return {messages.SteepAndCheapColorSize} result - SteepAndCheapColorSize
 */
function newSteepAndCheapColorSize(obj) {
  const result = new messages.SteepAndCheapColorSize();

  if (obj.color) {
    result.setColor(obj.color);
  }

  if (Array.isArray(obj.size) && obj.size.length > 0) {
    result.setSizeList(obj.size);
  }

  if (Array.isArray(obj.sizeValid) && obj.sizeValid.length > 0) {
    result.setSizevalidList(obj.sizeValid);
  }

  return result;
}


/**
 * new SteepAndCheapUser with object
 * @param {object} obj - SteepAndCheapUser object
 * @return {messages.SteepAndCheapUser} result - SteepAndCheapUser
 */
function newSteepAndCheapUser(obj) {
  const result = new messages.SteepAndCheapUser();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.photo) {
    result.setPhoto(obj.photo);
  }

  if (obj.height) {
    result.setHeight(obj.height);
  }

  if (obj.weight) {
    result.setWeight(obj.weight);
  }

  return result;
}

/**
 * new SteepAndCheapReview with object
 * @param {object} obj - SteepAndCheapReview object
 * @return {messages.SteepAndCheapReview} result - SteepAndCheapReview
 */
function newSteepAndCheapReview(obj) {
  const result = new messages.SteepAndCheapReview();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.createTime) {
    result.setCreatetime(obj.createTime);
  }

  if (obj.rating) {
    result.setRating(obj.rating);
  }

  if (obj.familiarity) {
    result.setFamiliarity(obj.familiarity);
  }

  if (obj.fit) {
    result.setFit(obj.fit);
  }

  if (obj.sizeBought) {
    result.setSizebought(obj.sizeBought);
  }

  if (Array.isArray(obj.imgs) && obj.imgs.length > 0) {
    result.setImgsList(obj.imgs);
  }

  if (obj.description) {
    result.setDescription(obj.description);
  }

  if (obj.user) {
    result.setUser(newSteepAndCheapUser(obj.user));
  }

  return result;
}

/**
 * new SteepAndCheapProduct with object
 * @param {object} obj - SteepAndCheapProduct object
 * @return {messages.SteepAndCheapProduct} result - SteepAndCheapProduct
 */
function newSteepAndCheapProduct(obj) {
  const result = new messages.SteepAndCheapProduct();

  if (obj.brandName) {
    result.setBrandname(obj.brandName);
  }

  if (obj.skuid) {
    result.setSkuid(obj.skuid);
  }

  if (Array.isArray(obj.productName) && obj.productName.length > 0) {
    result.setProductnameList(obj.productName);
  }

  if (obj.stockLevel) {
    result.setStocklevel(obj.stockLevel);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.curPrice) {
    result.setCurprice(obj.curPrice);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.reviews) {
    result.setReviews(obj.reviews);
  }

  if (obj.ratingValue) {
    result.setRatingvalue(obj.ratingValue);
  }

  if (obj.currency) {
    result.setCurrency(obj.currency);
  }

  if (obj.isNew) {
    result.setIsnew(obj.isNew);
  }

  if (Array.isArray(obj.category) && obj.category.length > 0) {
    result.setCategoryList(obj.category);
  }

  if (Array.isArray(obj.imgs) && obj.imgs.length > 0) {
    result.setImgsList(obj.imgs);
  }

  if (Array.isArray(obj.color) && obj.color.length > 0) {
    for (let i = 0; i < obj.color.length; ++i) {
      result.addColor(newSteepAndCheapColorSize(obj.color[i], i));
    }
  }

  if (obj.material) {
    result.setMaterial(obj.material);
  }

  if (obj.fit) {
    result.setFit(obj.fit);
  }

  if (obj.style) {
    result.setStyle(obj.style);
  }

  if (obj.ratingUPF) {
    result.setRatingupf(obj.ratingUPF);
  }

  if (obj.claimedWeight) {
    result.setClaimedweight(obj.claimedWeight);
  }

  if (obj.weightUnit) {
    result.setWeightunit(obj.weightUnit);
  }

  if (Array.isArray(obj.recommendedUse) && obj.recommendedUse.length > 0) {
    result.setRecommendeduseList(obj.recommendedUse);
  }

  if (obj.manufacturerWarranty) {
    result.setManufacturerwarranty(obj.manufacturerWarranty);
  }

  if (obj.strWeight) {
    result.setStrweight(obj.strWeight);
  }

  if (obj.infomation) {
    result.setInfomation(obj.infomation);
  }

  if (obj.sizeChart) {
    result.setSizechart(obj.sizeChart);
  }

  if (Array.isArray(obj.lstReview) && obj.lstReview.length > 0) {
    for (let i = 0; i < obj.lstReview.length; ++i) {
      result.addLstreview(newSteepAndCheapReview(obj.lstReview[i], i));
    }
  }

  if (Array.isArray(obj.linkProducts) && obj.linkProducts.length > 0) {
    result.setLinkproductsList(obj.linkProducts);
  }

  if (Array.isArray(obj.offers) && obj.offers.length > 0) {
    for (let i = 0; i < obj.offers.length; ++i) {
      result.addOffers(newSteepAndCheapColorSize2(obj.offers[i], i));
    }
  }

  return result;
}

/**
 * new SteepAndCheapProducts with object
 * @param {object} obj - SteepAndCheapProducts object
 * @return {messages.SteepAndCheapProducts} result - SteepAndCheapProducts
 */
function newSteepAndCheapProducts(obj) {
  const result = new messages.SteepAndCheapProducts();

  if (obj.maxPage) {
    result.setMaxpage(obj.maxPage);
  }

  if (Array.isArray(obj.products) && obj.products.length > 0) {
    for (let i = 0; i < obj.products.length; ++i) {
      result.addProducts(newSteepAndCheapProduct(obj.products[i], i));
    }
  }

  return result;
}

/**
 * new ReplySteepAndCheap with object
 * @param {number} mode - messages.SteepAndCheapMode
 * @param {object} obj - SteepAndCheapProducts or SteepAndCheapProduct object
 * @return {messages.ReplySteepAndCheap} result - ReplySteepAndCheap
 */
function newReplySteepAndCheap(mode, obj) {
  const result = new messages.ReplySteepAndCheap();

  result.setMode(mode);

  if (mode == messages.SteepAndCheapMode.SACM_PRODUCTS) {
    result.setProducts(newSteepAndCheapProducts(obj));
  } else if (mode == messages.SteepAndCheapMode.SACM_PRODUCT) {
    result.setProduct(newSteepAndCheapProduct(obj));
  }

  return result;
}

exports.newReplySteepAndCheap = newReplySteepAndCheap;
