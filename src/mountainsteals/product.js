const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');

/**
 * mountainstealsProduct - mountainsteals product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function mountainstealsProduct(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const waitAllResponse = new WaitAllResponse(page);

  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('mountainstealsProduct.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://www.mountainsteals.com/product/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('mountainstealsProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('mountainstealsProduct.waitDone timeout');

    log.error('mountainstealsProduct.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.category = await page
      .$$eval('#breadcrumb', (eles) => {
        if (eles.length > 0) {
          const category = [];
          for (let i = 0; i < eles[0].children.length; ++i) {
            category.push(eles[0].children[i].innerText);
          }

          return category;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval #breadcrumb',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  const productname = await page
      .$$eval('#product_name', (eles) => {
        if (eles.length > 0) {
          const productname = {};
          for (let i = 0; i < eles[0].childNodes.length; ++i) {
            if (eles[0].childNodes[i].nodeName == 'SPAN') {
              productname.brand = eles[0].childNodes[i].innerText;
            } else if (eles[0].childNodes[i].nodeName == '#text') {
              if (eles[0].childNodes[i].nodeValue.trim() != '') {
                productname.name = eles[0].childNodes[i].nodeValue.trim();
              }
            }
          }

          return productname;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval #product_name',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  if (productname) {
    ret.brand = productname.brand;
    ret.name = productname.name;
  }

  ret.rating = await page
      .$$eval('.RatingAddtlInfo', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval .RatingAddtlInfo',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  const lstcolorsize = await page
      .$$eval('div[itemprop="offers"]', (eles) => {
        if (eles.length > 0) {
          const lstcolorsize = [];
          for (let i = 0; i < eles.length; ++i) {
            const curoffer = eles[i];
            const cs = {};
            for (let j = 0; j < curoffer.children.length; ++j) {
              if (curoffer.children[j].tagName == 'META') {
                if (curoffer.children[j].getAttribute('itemprop') == 'price') {
                  cs.price = curoffer.children[j].getAttribute('content');
                } else if (
                  curoffer.children[j].getAttribute('itemprop') == 'sku'
                ) {
                  cs.sku = curoffer.children[j].getAttribute('content');
                }
              } else if (
                curoffer.children[j].tagName == 'DIV' &&
              curoffer.children[j].getAttribute('itemprop') == 'itemOffered'
              ) {
                const cc = curoffer.children[j];
                for (let k = 0; k < cc.children.length; ++k) {
                  if (
                    cc.children[k].tagName == 'META' &&
                  cc.children[k].getAttribute('itemprop') == 'color'
                  ) {
                    const ccc = cc.children[k].getAttribute('content');
                    if (ccc) {
                      const arr = ccc.split(',');
                      if (arr.length == 2) {
                        cs.color = arr[0].trim();
                        cs.size = arr[1].trim();
                      }
                    }
                  }
                }
              }
            }

            lstcolorsize.push(cs);
          }

          return lstcolorsize;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval div[itemprop="offers"]',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.images = await page
      .$$eval('.alt-color-img-box', (eles) => {
        const imgs = [];
        for (let i = 0; i < eles.length; ++i) {
          const lstimg = eles[i].getElementsByTagName('img');
          if (lstimg.length > 0) {
            imgs.push(lstimg[0].src);
          }
        }

        return imgs;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval .alt-color-img-box',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.details = await page
      .$$eval('#product-details', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerHTML;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval #product-details',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.spec = await page
      .$$eval('#productSpecTechParent', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerHTML;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval #productSpecTechParent',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.ratingCount = await page
      .$$eval('.bv-inline-histogram-ratings-bar', (eles) => {
        if (eles.length == 5) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            lst.push(eles[i].getAttribute('data-bv-histogram-rating-count'));
          }
          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval .bv-inline-histogram-ratings-bar',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.mapRating = await page
      .$$eval('.bv-secondary-rating-summary-bars-container', (eles) => {
        if (eles.length > 0) {
          const mapRating = {};
          for (let i = 0; i < eles.length; ++i) {
            let n = undefined;
            const cn = eles[i].getElementsByClassName(
                'bv-secondary-rating-summary-id bv-td'
            );
            if (cn.length > 0) {
              n = cn[0].innerText;
            }

            if (n == 'Fit') {
              const cv = eles[i].getElementsByClassName('bv-off-screen');
              if (cv.length > 0) {
                const arr = cv[0].innerText.split('average rating value is');
                if (arr == 2) {
                  const arr1 = arr[1].split('of 5');
                  if (arr1.length == 2) {
                    mapRating[n] = arr1[0].trim();
                  }
                }
              }
            } else {
              const cv = eles[i].getElementsByClassName(
                  'bv-secondary-rating-summary-rating'
              );
              if (cv.length > 0) {
                mapRating[n] = cv[0].innerText;
              }
            }
          }

          return mapRating;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval .bv-secondary-rating-summary-bars-container',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  ret.sizeGiud = await page
      .$$eval('#SizeGuide', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerHTML;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval #SizeGuide',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  const hascolor = await page
      .$$eval('.po-link.po-size-link.js-po-link-selectColor', (eles) => {
        if (eles.length > 0) {
          return true;
        }

        return false;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error(
        'mountainstealsProduct.waitForSelector $$eval .po-link.po-size-link.js-po-link-selectColor',
        awaiterr
    );

    await page.close();

    return {error: awaiterr};
  }

  if (hascolor) {
    await page.waitForSelector('#color-select').catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error(
          'mountainstealsProduct.waitForSelector #color-select',
          awaiterr
      );

      await page.close();

      return {error: awaiterr.toString()};
    }

    const csimgs = await page
        .$$eval('#color-select', (eles) => {
          if (eles.length > 0) {
            const csimgs = [];
            const items = eles[0].getElementsByClassName('po-row');
            for (let i = 0; i < items.length; ++i) {
              const cs = {};
              const lstcn = items[i].getElementsByClassName(
                  'po-color-name js-color-name'
              );
              if (lstcn.length > 0) {
                cs.colorname = lstcn[0].innerText;
              }

              const imgs = items[i].getElementsByTagName('img');
              if (imgs.length > 0) {
                cs.img = imgs[0].dataset.yoSrc;
              }

              csimgs.push(cs);
            }
            return csimgs;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });
    if (awaiterr) {
      log.error(
          'mountainstealsProduct.waitForSelector $$eval #color-select',
          awaiterr
      );

      await page.close();

      return {error: awaiterr};
    }

    if (csimgs) {
      for (let i = 0; i < lstcolorsize.length; ++i) {
        for (let j = 0; j < csimgs.length; ++j) {
          if (lstcolorsize[i].color == csimgs[j].colorname) {
            lstcolorsize[i].img = csimgs[j].img;
            break;
          }
        }
      }
    }
  }

  ret.colorSize = lstcolorsize;

  await page.close();

  return {ret: ret};
}

exports.mountainstealsProduct = mountainstealsProduct;
