const messages = require('../proto/result_pb');

/**
 * new MountainStealsColorSize with object
 * @param {object} obj - MountainStealsColorSize object
 * @return {messages.MountainStealsColorSize} result - MountainStealsColorSize
 */
function newMountainStealsColorSize(obj) {
  const result = new messages.MountainStealsColorSize();

  if (obj.color) {
    result.setColor(obj.color);
  }

  if (obj.size) {
    result.setSize(obj.size);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.img) {
    result.setImg(obj.img);
  }

  if (obj.sku) {
    result.setSku(obj.sku);
  }

  return result;
}

/**
 * new MountainStealsProduct with object
 * @param {object} obj - MountainStealsProduct object
 * @return {messages.MountainStealsProduct} result - MountainStealsProduct
 */
function newMountainStealsProduct(obj) {
  const result = new messages.MountainStealsProduct();

  if (obj.code) {
    result.setCode(obj.code);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (Array.isArray(obj.category) && obj.category.length > 0) {
    result.setCategoryList(obj.category);
  }

  if (obj.brand) {
    result.setBrand(obj.brand);
  }

  if (obj.rating) {
    result.setRating(obj.rating);
  }

  if (Array.isArray(obj.colorSize) && obj.colorSize.length > 0) {
    for (let i = 0; i < obj.colorSize.length; ++i) {
      result.addColorsize(newMountainStealsColorSize(obj.colorSize[i], i));
    }
  }

  if (Array.isArray(obj.images) && obj.images.length > 0) {
    result.setImagesList(obj.images);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.minPrice) {
    result.setMinprice(obj.minPrice);
  }

  if (obj.maxPrice) {
    result.setMaxprice(obj.maxPrice);
  }

  if (obj.details) {
    result.setDetails(obj.details);
  }

  if (obj.spec) {
    result.setSpec(obj.spec);
  }

  if (Array.isArray(obj.ratingCount) && obj.ratingCount.length > 0) {
    result.setRatingcountList(obj.ratingCount);
  }

  if (obj.mapRading && typeof obj.mapRading == 'object') {
    mapRading = result.getMapradingMap();
    for (const k in obj.mapRading) {
      if (Object.prototype.hasOwnProperty.call(obj.mapRading, k)) {
        mapRading.set(k, obj.mapRading[k]);
      }
    }
  }

  if (obj.sizeGiud) {
    result.setSizegiud(obj.sizeGiud);
  }

  return result;
}

/**
 * new MountainStealsSale with object
 * @param {object} obj - MountainStealsSale object
 * @return {messages.MountainStealsSale} result - MountainStealsSale
 */
function newMountainStealsSale(obj) {
  const result = new messages.MountainStealsSale();

  if (Array.isArray(obj.products) && obj.products.length > 0) {
    result.setProductsList(obj.products);
  }

  if (obj.saleurl) {
    result.setSaleurl(obj.saleurl);
  }

  return result;
}

/**
 * new ReplyMountainSteals with object
 * @param {number} mode - messages.MountainStealsMode
 * @param {object} obj - MountainStealsProduct or MountainStealsSale object
 * @return {messages.ReplyMountainSteals} result - ReplyMountainSteals
 */
function newReplyMountainSteals(mode, obj) {
  const result = new messages.ReplyMountainSteals();

  result.setMode(mode);

  if (mode == messages.MountainStealsMode.MSM_SALE) {
    result.setSale(newMountainStealsSale(obj));
  } else if (mode == messages.MountainStealsMode.MSM_PRODUCT) {
    result.setProduct(newMountainStealsProduct(obj));
  }

  return result;
}

exports.newReplyMountainSteals = newReplyMountainSteals;
