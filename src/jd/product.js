// const {sleep} = require('../utils');
const log = require('../log');

/**
 * jdProduct - jd product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdProduct(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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
    log.error('jdProduct.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://item.jd.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {};

  ret.breadCrumbs = await page
      .$$eval('.crumb.fl.clearfix', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lstitems = eles[0].getElementsByClassName('item');
          for (let i = 0; i < lstitems.length; ++i) {
            let isvaliditem = true;
            if (lstitems[i].classList.length > 1) {
              if (lstitems[i].classList[1] == 'sep') {
                isvaliditem = false;
              }
            }

            if (isvaliditem) {
              lst.push(lstitems[i].innerText);
            }
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.crumb.fl.clearfix', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const skunameret = await page
      .$$eval('.sku-name', (eles) => {
        if (eles.length > 0) {
          const skunameret = {name: eles[0].innerText};
          const lstimgs = eles[0].getElementsByTagName('img');
          if (lstimgs.length > 0) {
            skunameret.tag = lstimgs[0].alt;
          }

          return skunameret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.sku-name', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (skunameret != undefined) {
    ret.nameTag = skunameret.tag;
    ret.name = skunameret.name;
  }

  const info = await page
      .$$eval('.news', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.news', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.info = info;

  const bannertype = await page
      .$$eval('.activity-banner', (eles) => {
        if (eles.length > 0) {
          if (eles[0].id == 'pingou-banner') {
            return 'pingou';
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.activity-banner', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (bannertype == 'pingou') {
    const pingouret = await page
        .$$eval('.activity-message', (eles) => {
          if (eles.length > 0) {
            const pingouret = {};
            const lstitem = eles[0].getElementsByClassName('item');
            if (lstitem.length == 2) {
              const lstc = lstitem[0].getElementsByClassName('J-count');
              if (lstc.length > 0) {
                pingouret.preOrders = lstc[0].innerText;
              }

              const lstt = lstitem[1].getElementsByClassName('J-time');
              if (lstt.length > 0) {
                pingouret.lastTime = lstt[0].innerText;
              }
            }
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct.activity-message', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (pingouret != undefined) {
      ret.pingou = {
        preOrders: pingouret.preOrders,
        lastTime: pingouret.lastTime,
      };
    }

    const pingouprice = await page
        .$$eval('.summary-price-wrap', (eles) => {
          if (eles.length > 0) {
            const lst = eles[0].getElementsByClassName('summary-price');
            const pingouprice = {};
            if (lst.length == 2) {
              const jp = lst[0].getElementsByClassName('price J-earnest');
              if (jp.length > 0) {
                pingouprice.scheduledPrice = jp[0].innerText;
              }

              const p = lst[0].getElementsByClassName('price J-presale-price');
              if (p.length > 0) {
                pingouprice.price = p[0].innerText;
              }
            }

            return pingouprice;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct.summary-price-wrap', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (pingouprice != undefined) {
      if (ret.pingou == undefined) {
        ret.pingou = {};
      }

      ret.pingou.scheduledPrice = pingouprice.scheduledPrice;
      ret.pingou.price = pingouprice.price;
    }
  }

  const summaryService = await page
      .$$eval('.summary-service', (eles) => {
        if (eles.length > 0) {
          const lstspan = eles[0].getElementsByTagName('span');
          if (lstspan.length > 0) {
            return lstspan[0].innerText;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.summary-service', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.summaryService = summaryService;

  const shipTime = await page
      .$$eval('#summary-yushou-ship', (eles) => {
        if (eles.length > 0) {
          const lstdd = eles[0].getElementsByClassName('dd');
          if (lstdd.length > 0) {
            return lstdd[0].innerText;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct#summary-yushou-ship', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.shipTime = shipTime;

  const weight = await page
      .$$eval('#summary-weight', (eles) => {
        if (eles.length > 0) {
          const lstdd = eles[0].getElementsByClassName('dd');
          if (lstdd.length > 0) {
            return lstdd[0].innerText;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct#summary-weight', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.weight = weight;

  await page.close();

  return {ret: {}};
}

exports.jdProduct = jdProduct;
