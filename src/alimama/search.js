const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {login, checkNeedLogin} = require('./utils');

/**
 * alimamaSearch - alimama search
 * @param {object} browser - browser
 * @param {string} text - text
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function alimamaSearch(browser, text, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = 'https://pub.alimama.com/promo/search/index.htm';
  checkNeedLogin(page, url);

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
    log.error('jdActive.setViewport', awaiterr);

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
    log.error('jdActive.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('jdActive.waitDone timeout.');

    log.error('jdActive.waitDone ', err);

    await page.close();

    return {erroor: err};
  }

  waitAllResponse.reset();

  const lst = await page.$$eval('.common-product-container', (eles) => {
    const lst = [];

    for (let i = 0; i < eles.length; ++i) {
      const cp = {};

      const lstimgs = eles[i].getElementsByTagName('img');
      if (lstimgs.length > 0) {
        cp.img = lstimgs[0].src;
      }

      const lsttitle = eles[i].getElementsByClassName('color-m content-title');
      if (lsttitle.length > 0) {
        cp.name = lsttitle[0].innerText;
        cp.url = lsttitle[0].href;
      }

      const lstquan = eles[i].getElementsByClassName('pub-threecn');
      if (lstquan.length > 0) {
        cp.lastCoupon = lstquan[0].style.width;
      }

      const lstprice = eles[i].getElementsByClassName('price-info-num');
      if (lstprice.length == 3) {
        cp.curPrice = lstprice[0].innerText;
        cp.rebate = lstprice[1].innerText;
        cp.commission = lstprice[2].innerText;
      }

      const lstfl = eles[i].getElementsByClassName('tag-coupon fl');
      if (lstfl.length > 0) {
        const lstmoney = lstfl[0].getElementsByClassName('money');
        if (lstmoney.length > 0) {
          cp.moneyQuan = lstmoney[0].innerText;
        }
      }

      const lstfr = eles[i].getElementsByClassName('tags-container fr');
      if (lstfr.length > 0) {
        const lsttmall = lstfr[0].getElementsByClassName('tag-tmall');
        if (lsttmall.length > 0) {
          cp.shopType = 'tmall';
        }
      }

      const lstshopinfo = eles[i].getElementsByClassName('box-shop-info');
      if (lstshopinfo.length > 0) {
        if (lstshopinfo[0].children.length == 2) {
          cp.salesVolume = lstshopinfo[0].children[1].innerText;
        }

        const lsta = lstshopinfo[0].getElementsByTagName('a');
        if (lsta.length > 0) {
          cp.shop = lsta[0].innerText;
          cp.shopurl = lsta[0].href;
        }
      }

      lst.push(cp);
    }

    return lst;
  });

  console.log(lst);
  // await login(page, 'aaa', 'bbb');

  await page.close();

  return {ret: lst};
}

exports.alimamaSearch = alimamaSearch;
