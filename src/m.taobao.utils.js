const log = require('./log');
const {parseJSONP} = require('./jsonp.utils');
const {
  string2int,
  percentage2float,
  string2json,
  string2float,
} = require('./string.utils');

/**
 * parseGetDetailResult - parse getdetail result
 * @param {buffer} result - result buffer
 * @param {string} url - url
 * @return {object} ret - {error, obj}
 */
function parseGetDetailResult(result, url) {
  try {
    const str = result.toString();

    const urlret = new URL(url);
    const urltype = urlret.searchParams.get('type');
    if (urltype == 'jsonp') {
      const urlcallback = urlret.searchParams.get('callback');

      return parseJSONP(str, urlcallback);
    } else {
      return {
        error: new Error('parseGetDetailResult invalid urltype ' + url),
      };
    }
  } catch (err) {
    log.warn('parseGetDetailResult', err);

    return {error: new Error('parseGetDetailResult ' + err)};
  }
}

/**
 * parseItem - parse item
 * @param {object} obj - object
 * @param {string} ret - ret
 */
function parseItem(obj, ret) {
  if (obj.data && obj.data.item) {
    const curitem = obj.data.item;

    if (curitem.title) {
      ret.title = curitem.title;
    }

    if (curitem.commentCount) {
      const cc = string2int(curitem.commentCount);
      if (cc.error) {
        log.warn('parseItem.string2int commentCount', cc.error);
      } else {
        ret.reviews = cc.num;
      }
    }

    if (curitem.itemId) {
      ret.tbItemID = curitem.itemId;
    }

    if (curitem.rootCategoryId) {
      ret.rootCategoryID = curitem.rootCategoryId;
    }

    if (curitem.categoryId) {
      ret.categoryID = curitem.categoryId;
    }

    if (curitem.brandValueId) {
      ret.brandValueID = curitem.brandValueId;
    }

    if (curitem.favcount) {
      const fc = string2int(curitem.favcount);
      if (fc.error) {
        log.warn('parseItem.string2int favcount', fc.error);
      } else {
        ret.favCount = fc.num;
      }
    }

    if (curitem.images) {
      ret.imgs = curitem.images;
    }
  }
}

/**
 * parseSeller - parse seller
 * @param {object} obj - object
 * @param {string} ret - ret
 */
function parseSeller(obj, ret) {
  if (obj.data && obj.data.seller) {
    const seller = obj.data.seller;
    ret.shop = {};

    if (seller.shopName) {
      ret.shop.name = seller.shopName;
    }

    if (seller.shopId) {
      ret.shop.shopid = seller.shopId;
    }

    if (seller.userId) {
      ret.shop.userid = seller.userId;
    }

    if (seller.creditLevel) {
      const cl = string2int(seller.creditLevel);
      if (cl.error) {
        log.warn('parseSeller.string2int seller.creditLevel', cl.error);
      } else {
        ret.shop.creditLevel = cl.num;
      }
    }

    if (seller.allItemCount) {
      const aic = string2int(seller.allItemCount);
      if (aic.error) {
        log.warn('parseSeller.string2int seller.allItemCount', aic.error);
      } else {
        ret.shop.allItemCount = aic.num;
      }
    }

    if (seller.newItemCount) {
      const nic = string2int(seller.newItemCount);
      if (nic.error) {
        log.warn('parseSeller.string2int seller.newItemCount', nic.error);
      } else {
        ret.shop.newItemCount = nic.num;
      }
    }

    if (seller.fans) {
      ret.shop.strFans = seller.fans;
    }

    if (seller.goodRatePercentage) {
      const grp = percentage2float(seller.goodRatePercentage);
      if (grp.error) {
        log.warn(
            'parseSeller.percentage2float seller.goodRatePercentage',
            grp.error,
        );
      } else {
        ret.shop.goodRatePercentage = grp.num;
      }
    }

    // bool gold = 2;
    // string url = 3;
    // string rank = 4;    // cap/gold ...
    // int32 rating = 5;   // 3/4/5 ...
    // repeated int32 rateLevel = 6;   // 描述、服务、物流，-1表示低，0表示等于，1表示高
    // repeated float rateScore = 7;   // 描述、服务、物流，具体分数
  }
}

/**
 * findInSKUs - find in skus
 * @param {array} lstskuid - lstskuid
 * @param {string} value - value, is like 1627207:28321;5919063:3266781
 * @return {string} skuid - skuid
 */
function findInSKUs(lstskuid, value) {
  for (let i = 0; i < lstskuid.length; ++i) {
    if (lstskuid[i].propPath == value) {
      return lstskuid[i].skuId;
    }
  }

  return undefined;
}

/**
 * parseSKU - parse sku
 * @param {object} obj - obj
 * @return {object} ret - {error, skus}
 */
function parseSKU(obj) {
  try {
    if (obj && obj.data && obj.data.skuBase) {
      const skubase = obj.data.skuBase;
      if (!(Array.isArray(skubase.skus) && skubase.skus.length > 0)) {
        // const err = new Error('parseSKU invalid skubase.skus');

        log.warn('parseSKU invalid skubase.skus');

        return {};
      }

      const strmock = obj.data.mockData;
      let mapsku = {};
      if (strmock) {
        const mock = string2json(strmock);
        if (mock.error) {
          log.warn('parseSKU string2json obj.data.mockData', mock.error);
        } else if (mock.obj && mock.obj.skuCore && mock.obj.skuCore.sku2info) {
          mapsku = mock.obj.skuCore.sku2info;
        } else {
          const err = new Error('parseSKU no skuCore.sku2info');

          log.warn('parseSKU skuCore.sku2info', err);
        }
      }

      if (Array.isArray(skubase.props) && skubase.props.length > 0) {
        if (skubase.props.length == 1) {
          if (
            skubase.props[0] &&
            Array.isArray(skubase.props[0].values) &&
            skubase.props[0].values.length > 0
          ) {
            const skus = [];
            for (let i = 0; i < skubase.props[0].values.length; ++i) {
              const sku = {};
              const cv = skubase.props[0].values[i];

              if (cv.name) {
                sku.title = cv.name;
              }

              if (cv.vid) {
                sku.valueid = skubase.props[0].pid + ':' + cv.vid;
              }

              if (cv.image) {
                sku.img = cv.image;
              }

              const skuid = findInSKUs(skubase.skus, sku.valueid);
              if (skuid) {
                sku.skuid = skuid;
              }

              if (
                mapsku[skuid] &&
                mapsku[skuid].price &&
                mapsku[skuid].price.priceText
              ) {
                const pt = string2float(mapsku[skuid].price.priceText);
                if (pt.error) {
                  log.warn(
                      'parseSKU string2float mapsku[skuid].price.priceText',
                      pt.error,
                  );
                } else {
                  sku.price = pt.num;
                }
              }

              // const skuidr = string2int(skuid);
              // if (skuidr.error) {
              //   log.warn('parseSKU string2int skuid', skuidr.error);
              // } else {
              //   if (
              //     mapsku[skuidr.num] &&
              //     mapsku[skuidr.num].price &&
              //     mapsku[skuidr.num].price.priceText
              //   ) {
              //     const pt = string2float(mapsku[skuidr.num].priceText);
              //     if (pt.error) {
              //       log.warn(
              //           'parseSKU string2float mapsku[skuid].priceText',
              //           pt.error,
              //       );
              //     } else {
              //       ret.price = pt.num;
              //     }
              //   }
              // }

              skus.push(sku);

              // int32 stock = 5;
            }

            return {skus: skus};
          } else {
            const err = new Error('parseSKU invalid skubase.props[0].values');

            log.warn('parseSKU', err);

            return {error: err};
          }
        } else if (skubase.props.length == 2) {
          if (
            skubase.props[0] &&
            Array.isArray(skubase.props[0].values) &&
            skubase.props[0].values.length > 0 &&
            skubase.props[1] &&
            Array.isArray(skubase.props[1].values) &&
            skubase.props[1].values.length > 0
          ) {
            const skus = [];
            for (let i = 0; i < skubase.props[0].values.length; ++i) {
              for (let j = 0; j < skubase.props[1].values.length; ++j) {
                const sku = {
                  title: '',
                  valueid: '',
                };
                const cv0 = skubase.props[0].values[i];
                const cv1 = skubase.props[1].values[j];

                if (cv0.name) {
                  sku.title += cv0.name;
                }

                if (cv1.name) {
                  sku.title += cv1.name;
                }

                if (cv0.vid) {
                  sku.valueid += skubase.props[0].pid + ':' + cv0.vid;
                }

                if (cv1.vid) {
                  if (sku.valueid != '') {
                    sku.valueid += ';';
                  }

                  sku.valueid += skubase.props[1].pid + ':' + cv1.vid;
                }

                if (cv0.image) {
                  sku.img = cv0.image;
                }

                if (cv1.image) {
                  sku.img = cv1.image;
                }

                const skuid = findInSKUs(skubase.skus, sku.valueid);
                if (skuid) {
                  sku.skuid = skuid;
                }

                if (
                  mapsku[skuid] &&
                  mapsku[skuid].price &&
                  mapsku[skuid].price.priceText
                ) {
                  const pt = string2float(mapsku[skuid].price.priceText);
                  if (pt.error) {
                    log.warn(
                        'parseSKU string2float mapsku[skuid].price.priceText',
                        pt.error,
                    );
                  } else {
                    sku.price = pt.num;
                  }
                }

                skus.push(sku);

                // int32 stock = 5;
              }
            }

            return {skus: skus};
          } else {
            const err = new Error(
                'parseSKU invalid skubase.props[0].values skubase.props[1].values',
            );

            log.warn('parseSKU', err);

            return {error: err};
          }
        } else {
          const err = new Error(
              'parseSKU invalid skubase.props.length ' + skubase.props.length,
          );

          log.warn('parseSKU', err);

          return {error: err};
        }
      }
    }
  } catch (err) {
    log.warn('parseSKU', err);

    return {error: err};
  }
}

/**
 * parseProps - parse props
 * @param {object} obj - object
 * @param {string} ret - ret
 */
function parseProps(obj, ret) {
  if (
    obj.data &&
    obj.data.props &&
    Array.isArray(obj.data.props.groupProps) &&
    obj.data.props.groupProps.length > 0
  ) {
    ret.props = [];
    for (let i = 0; i < obj.data.props.groupProps.length; ++i) {
      const cgp = obj.data.props.groupProps[i];

      for (const k in cgp) {
        if (Object.prototype.hasOwnProperty.call(cgp, k)) {
          for (let j = 0; j < cgp[k].length; ++j) {
            const cp = cgp[k][j];

            for (const k1 in cp) {
              if (Object.prototype.hasOwnProperty.call(cp, k1)) {
                const curprop = {
                  rootIndex: i,
                  rootName: k,
                  key: k1,
                  value: cp[k1],
                };

                ret.props.push(curprop);

                break;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * parseReviewTags - parse reviewTags
 * @param {object} obj - object
 * @param {string} ret - ret
 */
function parseReviewTags(obj, ret) {
  if (
    obj.data &&
    obj.data.rate &&
    Array.isArray(obj.data.rate.keywords) &&
    obj.data.rate.keywords.length > 0
  ) {
    ret.reviewTags = [];
    for (let i = 0; i < obj.data.rate.keywords.length; ++i) {
      const ck = obj.data.rate.keywords[i];
      const currt = {
        tag: ck.word,
      };

      const ckc = string2int(ck.count);
      if (ckc.error) {
        log.warn('parseReviewTags.string2int count', ckc.error);
      } else {
        currt.times = ckc.num;
      }

      const ckt = string2int(ck.type);
      if (ckt.error) {
        log.warn('parseReviewTags.string2int type', ckt.error);
      } else {
        currt.type = ckt.num;
      }

      ret.reviewTags.push(currt);
    }
  }
}

exports.parseGetDetailResult = parseGetDetailResult;
exports.parseSKU = parseSKU;
exports.parseItem = parseItem;
exports.parseSeller = parseSeller;
exports.parseProps = parseProps;
exports.parseReviewTags = parseReviewTags;
