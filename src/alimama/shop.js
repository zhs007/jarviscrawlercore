const log = require('../log');
const {closeAllPagesEx} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
// const {WaitFrameNavigated} = require('../waitframenavigated');
const {
  // getProducts,
  // waitAllProducts,
  checkNeedLogin,
  login,
} = require('./utils');

/**
 * getShopInfo - get shop infomation
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getShopInfo(page, timeout) {
  const awaiterr = undefined;
  const shopinfo = {};

  shopinfo.name = await page
      .$$eval('h2.title', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  shopinfo.boss = await page
      .$$eval('.extNick', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  shopinfo.sellerTitle = await page
      .$$eval('.sellerTitle', (eles) => {
        if (eles.length > 0) {
          const arr = [];
          for (let i = 0; i < eles.length; ++i) {
            const attrs = eles[i].attributes;
            for (let j = 0; j < attrs.length; ++j) {
              if (attrs[j].name == 'title') {
                arr.push(attrs[i].value);

                break;
              }
            }
          }

          return arr;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  const sellerSum = await page
      .$$eval('.sellerSum', (eles) => {
        if (eles.length > 0) {
          const lstspan = eles[0].parentElement.getElementsByTagName('span');
          const sellerSum = {};

          if (lstspan.length >= 2) {
            sellerSum.credit = lstspan[0].innerText;
            const lstimgs = lstspan[0].getElementsByTagName('img');
            if (lstimgs.length > 0) {
              sellerSum.sellerSum = lstimgs[0].src;
            }
          }

          return sellerSum;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  if (sellerSum) {
    if (sellerSum.credit) {
      shopinfo.credit = sellerSum.credit;
    }

    if (sellerSum.sellerSum) {
      shopinfo.sellerSum = sellerSum.sellerSum;
    }
  }

  shopinfo.salesVolume = await page
      .$$eval('div.num', (eles) => {
        if (eles.length > 0) {
          const lstspan = eles[0].getElementsByTagName('span');
          if (lstspan.length > 0) {
            return lstspan[0].innerText;
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  const si = await page
      .$$eval('div.shop', (eles) => {
        if (eles.length == 2) {
          const lstspan = eles[0].getElementsByTagName('span');
          const si = {};

          if (lstspan.length == 4) {
            si.majorBusiness = lstspan[0].innerText;
            si.serviceVolume = [
              lstspan[0].innerText,
              lstspan[1].innerText,
              lstspan[2].innerText,
            ];
          }

          const lstspan2 = eles[1].getElementsByTagName('span');
          if (lstspan2.length == 6) {
            si.serviceOther = [
              lstspan[1].innerText,
              lstspan[3].innerText,
              lstspan[5].innerText,
            ];

            si.serviceOther2 = [
              lstspan[1].className,
              lstspan[3].className,
              lstspan[5].className,
            ];
          }

          return si;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  if (si) {
    if (si.majorBusiness) {
      shopinfo.majorBusiness = si.majorBusiness;
    }

    if (si.serviceVolume) {
      shopinfo.serviceVolume = si.serviceVolume;
    }

    if (si.serviceOther) {
      shopinfo.serviceOther = si.serviceOther;
    }

    if (si.serviceOther2) {
      shopinfo.serviceOther2 = si.serviceOther2;
    }
  }

  return {ret: shopinfo};
}

/**
 * alimamaGetShop - alimama get shop
 * @param {object} browser - browser
 * @param {string} shopurl - shop url
 * @param {object} cfg - alimama config
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function alimamaGetShop(browser, shopurl, cfg, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = shopurl; // 'https://pub.alimama.com/promo/search/index.htm';
  checkNeedLogin(page, url);

  const waitAllResponse = new WaitAllResponse(page);
  // const mainframe = await page.mainFrame();
  // const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
  //   const cururl = frame.url();

  //   return cururl.indexOf(url) == 0;
  // });

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
    log.error('alimamaGetTop.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto(url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('alimamaGetTop.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('alimamaGetTop.waitDone timeout.');

    log.error('alimamaGetTop.waitDone ', err);

    await page.close();

    return {error: err};
  }

  waitAllResponse.reset();

  if (cfg) {
    const loginret = await login(page, cfg.username, cfg.password);
    if (loginret.err) {
      log.error('alimamaGetTop.login ', loginret.err);

      await page.close();

      return {error: loginret.err};
    }

    const isok = await waitAllResponse.waitDone(timeout);
    if (!isok) {
      const err = new Error('alimamaGetTop.waitDone timeout.');

      log.error('alimamaGetTop.waitDone ', err);

      await page.close();

      return {error: err};
    }

    waitAllResponse.reset();
  }

  const si = await getShopInfo(page, timeout);
  if (si.error) {
    log.error('alimamaGetTop.waitDone ', si.error);

    await page.close();

    return {error: si.error};
  }

  console.log(si);

  await page.close();

  await closeAllPagesEx(browser, 6);

  return {ret: si.ret};
}

exports.alimamaGetShop = alimamaGetShop;
