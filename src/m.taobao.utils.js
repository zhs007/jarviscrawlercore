const log = require('../log');
const {parseJSONP} = require('../jsonp.utils');
const {
  string2int,
  percentage2float,
  string2json,
  string2float,
} = require('../string.utils');

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
        const err = new Error('parseSKU invalid skubase.skus');

        log.warn('parseSKU skubase.skus', err);

        return {error: err};
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

exports.parseGetDetailResult = parseGetDetailResult;
exports.parseSKU = parseSKU;
