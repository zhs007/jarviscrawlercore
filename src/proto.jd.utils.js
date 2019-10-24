const messages = require('../proto/result_pb');

/**
 * new JDCommentsType with object
 * @param {object} obj - JDCommentsType object
 * @return {messages.JDCommentsType} result - JDCommentsType
 */
function newJDCommentsType(obj) {
  const result = new messages.JDCommentsType();

  if (obj.type) {
    result.setType(obj.type);
  }

  if (obj.nums) {
    result.setNums(obj.nums);
  }

  return result;
}

/**
 * new JDCommentsInfo with object
 * @param {object} obj - JDCommentsInfo object
 * @return {messages.JDCommentsInfo} result - JDCommentsInfo
 */
function newJDCommentsInfo(obj) {
  const result = new messages.JDCommentsInfo();

  if (obj.percent) {
    result.setPercent(obj.percent);
  }

  if (Array.isArray(obj.tags) && obj.tags.length > 0) {
    result.setTagsList(obj.tags);
  }

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newJDCommentsType(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new JDSKUInfo with object
 * @param {object} obj - JDSKUInfo object
 * @return {messages.JDSKUInfo} result - JDSKUInfo
 */
function newJDSKUInfo(obj) {
  const result = new messages.JDSKUInfo();

  if (obj.skuID) {
    result.setSkuid(obj.skuID);
  }

  if (obj.type) {
    result.setType(obj.type);
  }

  if (obj.color) {
    result.setColor(obj.color);
  }

  if (obj.series) {
    result.setSeries(obj.series);
  }

  if (obj.variety) {
    result.setVariety(obj.variety);
  }

  if (obj.size) {
    result.setSize(obj.size);
  }

  if (obj.model) {
    result.setModel(obj.model);
  }

  if (obj.purchase) {
    result.setPurchase(obj.purchase);
  }

  if (obj.disabled) {
    result.setDisabled(obj.disabled);
  }

  if (obj.selected) {
    result.setSelected(obj.selected);
  }

  if (obj.category) {
    result.setCategory(obj.category);
  }

  if (obj.productType) {
    result.setProducttype(obj.productType);
  }

  return result;
}

/**
 * new JDPingou with object
 * @param {object} obj - JDPingou object
 * @return {messages.JDPingou} result - JDPingou
 */
function newJDPingou(obj) {
  const result = new messages.JDPingou();

  if (obj.preOrders) {
    result.setPreorders(obj.preOrders);
  }

  if (obj.strLastTime) {
    result.setStrlasttime(obj.strLastTime);
  }

  if (obj.scheduledPrice) {
    result.setScheduledprice(obj.scheduledPrice);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  return result;
}

/**
 * new JDShangou with object
 * @param {object} obj - JDShangou object
 * @return {messages.JDShangou} result - JDShangou
 */
function newJDShangou(obj) {
  const result = new messages.JDShangou();

  if (obj.oldPrice) {
    result.setOldprice(obj.oldPrice);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (obj.strLastTime) {
    result.setStrlasttime(obj.strLastTime);
  }

  return result;
}

/**
 * new JDPromotional with object
 * @param {object} obj - JDPromotional object
 * @return {messages.JDPromotional} result - JDPromotional
 */
function newJDPromotional(obj) {
  const result = new messages.JDPromotional();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.info) {
    result.setInfo(obj.info);
  }

  return result;
}

/**
 * new JDNormalPrice with object
 * @param {object} obj - JDNormalPrice object
 * @return {messages.JDNormalPrice} result - JDNormalPrice
 */
function newJDNormalPrice(obj) {
  const result = new messages.JDNormalPrice();

  if (obj.oldPrice) {
    result.setOldprice(obj.oldPrice);
  }

  if (obj.price) {
    result.setPrice(obj.price);
  }

  if (Array.isArray(obj.coupons) && obj.coupons.length > 0) {
    result.setCouponsList(obj.coupons);
  }

  if (Array.isArray(obj.promotionals) && obj.promotionals.length > 0) {
    for (let i = 0; i < obj.promotionals.length; ++i) {
      result.addPromotionals(newJDPromotional(obj.promotionals[i], i));
    }
  }

  return result;
}

/**
 * new JDProduct with object
 * @param {object} obj - JDProduct object
 * @return {messages.JDProduct} result - JDProduct
 */
function newJDProduct(obj) {
  const result = new messages.JDProduct();

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (Array.isArray(obj.breadCrumbs) && obj.breadCrumbs.length > 0) {
    result.setBreadcrumbsList(obj.breadCrumbs);
  }

  if (obj.info) {
    result.setInfo(obj.info);
  }

  if (obj.nameTag) {
    result.setNametag(obj.nameTag);
  }

  if (obj.pingou) {
    result.setPingou(newJDPingou(obj.pingou));
  }

  if (obj.summaryService) {
    result.setSummaryservice(obj.summaryService);
  }

  if (obj.strShipTime) {
    result.setStrshiptime(obj.strShipTime);
  }

  if (obj.strWeight) {
    result.setStrweight(obj.strWeight);
  }

  if (obj.brandChs) {
    result.setBrandchs(obj.brandChs);
  }

  if (obj.brandEng) {
    result.setBrandeng(obj.brandEng);
  }

  if (Array.isArray(obj.SKUs) && obj.SKUs.length > 0) {
    for (let i = 0; i < obj.SKUs.length; ++i) {
      result.addSkus(newJDSKUInfo(obj.SKUs[i], i));
    }
  }

  if (obj.comment) {
    result.setComment(newJDCommentsInfo(obj.comment));
  }

  if (obj.price) {
    result.setPrice(newJDNormalPrice(obj.price));
  }

  if (obj.shangou) {
    result.setShangou(newJDShangou(obj.shangou));
  }

  return result;
}

/**
 * new JDActive with object
 * @param {object} obj - JDActive object
 * @return {messages.JDActive} result - JDActive
 */
function newJDActive(obj) {
  const result = new messages.JDActive();

  if (Array.isArray(obj.urlActive) && obj.urlActive.length > 0) {
    result.setUrlactiveList(obj.urlActive);
  }

  if (Array.isArray(obj.urlProduct) && obj.urlProduct.length > 0) {
    result.setUrlproductList(obj.urlProduct);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.title) {
    result.setTitle(obj.title);
  }

  return result;
}

/**
 * new ReplyJD with object
 * @param {number} mode - messages.JDMode
 * @param {object} obj - JDProduct or JDActive object
 * @return {messages.ReplyJD} result - ReplyJD
 */
function newReplyJD(mode, obj) {
  const result = new messages.ReplyJD();

  result.setMode(mode);

  if (mode == messages.JDMode.JDM_PRODUCT) {
    result.setProduct(newJDProduct(obj));
  } else if (
    mode == messages.JDMode.JDM_ACTIVE ||
    mode == messages.JDMode.JDM_ACTIVEPAGE
  ) {
    result.setActive(newJDActive(obj));
  }

  return result;
}

exports.newReplyJD = newReplyJD;
