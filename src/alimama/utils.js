const {sleep, isElementVisible} = require('../utils');
const {
  percentage2float,
  string2float,
  split2float,
  string2int,
} = require('../stringutils');

const URLLogin = 'https://www.alimama.com/member/login.htm';

/**
 * procNoCaptcha - procNoCaptcha
 * @param {object} page - page
 * @param {string} frame - frame
 */
async function procNoCaptcha(page, frame) {
  const lstnocaptcha = await frame.$$('#nocaptcha');
  if (lstnocaptcha.length > 0) {
    const isvisible = await isElementVisible(frame, lstnocaptcha[0]);
    if (isvisible) {
      const lstbtn = await frame.$$('.nc_iconfont.btn_slide');

      const bbbox = await lstnocaptcha[0].boundingBox();

      if (lstbtn.length > 0) {
        const bbox = await lstbtn[0].boundingBox();
        const ex = Math.floor(bbbox.x + bbbox.width - Math.random() * 10 - 5);
        let bx = Math.floor(bbox.x + bbox.width / 2 + Math.random() * 10 - 5);

        console.log('bx ', bx);
        console.log('ex ', ex);

        await page.mouse.move(
            bx,
            Math.floor(bbox.y + bbox.height / 2 + Math.random() * 10 - 5)
        );

        await sleep(Math.floor(100 + Math.random() * 50));
        await page.mouse.down();

        const ft = 300;
        const pixeltime = bbbox.width / ft;

        while (bx < ex) {
          bx += Math.floor(30 * pixeltime) + 1;
          // console.log('bx ', bx);
          await page.mouse.move(
              bx,
              Math.floor(bbox.y + bbox.height / 2 + Math.random() * 10 - 5)
          );
          await sleep(30);
        }

        await page.mouse.up();
      }
    }
  }
}

/**
 * login - login
 * @param {object} page - page
 * @param {string} username - username
 * @param {string} passwd - passwd
 */
async function login(page, username, passwd) {
  if (page.url().indexOf(URLLogin) == 0) {
    const frame = page
        .frames()
        .find((frame) => frame.name() === 'taobaoLoginIfr');

    const isneedchg2input = await frame.evaluate(() => {
      const lstb = document.getElementsByClassName('forget-pwd J_Quick2Static');
      if (lstb.length > 0) {
        if (lstb[0].innerText == '密码登录') {
          return true;
        }
      }

      return false;
    });

    if (isneedchg2input) {
      const lstbtn = await frame.$$('.forget-pwd.J_Quick2Static');
      if (lstbtn.length > 0) {
        await lstbtn[0].hover();

        await lstbtn[0].click();

        const lstuname = await frame.$$('#TPL_username_1');
        const lstpasswd = await frame.$$('#TPL_password_1');
        const lstsubmit = await frame.$$('#J_SubmitStatic');
        if (
          lstuname.length > 0 &&
          lstpasswd.length > 0 &&
          lstsubmit.length > 0
        ) {
          await lstuname[0].hover();
          await lstuname[0].type(username, {delay: 100});

          await lstpasswd[0].hover();
          await lstpasswd[0].type(passwd, {delay: 100});

          await procNoCaptcha(page, frame);

          console.log('end!');
        }
      }
    }
  }
}

/**
 * checkNeedLogin - check if page is need login
 * @param {object} page - page
 * @param {string} url - url
 * @param {string} waitAllResponse - waitAllResponse
 */
function checkNeedLogin(page, url, waitAllResponse) {
  page.on('framenavigated', async (frame) => {
    if (frame == page.mainFrame()) {
      // waitAllResponse.reset();

      if (frame.url().indexOf(url) == 0) {
        return;
      }

      if (
        frame.url().indexOf('https://www.alimama.com/member/login.htm') == 0
      ) {
        return;
      }
    }
  });
}

/**
 * getProductsInBrowser - get products in browser
 * @param {array} eles - elements
 * @return {array} lst - products
 */
function getProductsInBrowser(eles) {
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
      cp.shopType = [];

      const lsttmall = lstfr[0].getElementsByClassName('tag-tmall');
      if (lsttmall.length > 0) {
        cp.shopType.push('tmall');
      }

      const lstjhs = lstfr[0].getElementsByClassName('tag-jhs');
      if (lstjhs.length > 0) {
        cp.shopType.push('jhs');
      }

      const lstyushou = lstfr[0].getElementsByClassName('tag-yushou');
      if (lstyushou.length > 0) {
        cp.shopType.push('yushou');
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

    const lstsellnum = eles[i].getElementsByClassName('sell-overview-num');
    if (lstsellnum.length > 0) {
      cp.salesVolume2 = lstsellnum[0].innerText;
    }

    const lstpresalenum = eles[i].getElementsByClassName('pre-sale-num');
    if (lstpresalenum.length > 0) {
      cp.presale = lstpresalenum[0].innerText;
    }

    const lstpresaleprofit = eles[i].getElementsByClassName('pre-sale-profit');
    if (lstpresaleprofit.length > 0) {
      cp.presaleProfit = lstpresaleprofit[0].innerText;
    }

    lst.push(cp);
  }

  return lst;
}

/**
 * getProducts - get products
 * @param {object} page - page
 * @return {object} ret - {error, lst}
 */
async function getProducts(page) {
  let awaiterr = undefined;
  let lst = await page
      .$$eval('.common-product-box', getProductsInBrowser)
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: err};
  }

  if (lst.length == 0) {
    lst = await page
        .$$eval('.hot-product-box', getProductsInBrowser)
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      return {error: err};
    }
  }

  if (lst.length == 0) {
    lst = await page
        .$$eval('.preSale-product-box', getProductsInBrowser)
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      return {error: err};
    }
  }

  for (let i = 0; i < lst.length; ++i) {
    if (lst[i].lastCoupon) {
      const retCoupon = percentage2float(lst[i].lastCoupon);
      if (retCoupon.error) {
        return {error: retCoupon.error};
      }
      lst[i].lastCoupon = retCoupon.num;
    }

    if (lst[i].curPrice) {
      const retCurPrice = string2float(lst[i].curPrice);
      if (retCurPrice.error) {
        return {error: retCurPrice.error};
      }
      lst[i].curPrice = retCurPrice.num;
    }

    if (lst[i].rebate) {
      const retRebate = percentage2float(lst[i].rebate);
      if (retRebate.error) {
        return {error: retRebate.error};
      }
      lst[i].rebate = retRebate.num;
    }

    if (lst[i].commission) {
      const retCommission = string2float(lst[i].commission);
      if (retCommission.error) {
        return {error: retCommission.error};
      }
      lst[i].commission = retCommission.num;
    }

    if (lst[i].moneyQuan) {
      const retMoneyQuan = split2float(lst[i].moneyQuan, 0, '元');
      if (retMoneyQuan.error) {
        return {error: retMoneyQuan.error};
      }
      lst[i].moneyQuan = retMoneyQuan.num;
    }

    if (lst[i].salesVolume) {
      const retSalesVolume = split2float(lst[i].salesVolume, 1, ' ');
      if (retSalesVolume.error) {
        return {error: retSalesVolume.error};
      }
      lst[i].salesVolume = retSalesVolume.num;
    }

    if (lst[i].salesVolume2) {
      const retSalesVolume2 = string2int(lst[i].salesVolume2);
      if (retSalesVolume2.error) {
        return {error: retSalesVolume2.error};
      }
      lst[i].salesVolume2 = retSalesVolume2.num;
    }

    if (lst[i].presale) {
      const arr = lst[i].presale.split('定金');
      if (arr.length == 2) {
        const ret = split2float(arr[1], 0, '元');
        if (ret.error) {
          return {error: ret.error};
        }
        lst[i].presale = ret.num;
      }
    }

    if (lst[i].presaleProfit) {
      const arr = lst[i].presaleProfit.split('立减');
      if (arr.length == 2) {
        const ret = split2float(arr[1], 0, '元');
        if (ret.error) {
          return {error: ret.error};
        }
        lst[i].presaleProfit = ret.num;
      }
    }
  }

  return {lst: lst};
}

/**
 * waitAllProducts - wait all products
 * @param {object} page - page
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {int} timeout - timeout
 * @return {Error} err - error
 */
async function waitAllProducts(page, waitAllResponse, timeout) {
  let awaiterr = undefined;
  let lstproducts = await page.$$('.common-product-box').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  if (lstproducts.length == 0) {
    lstproducts = await page.$$('.hot-product-box').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }
  }

  if (lstproducts.length == 0) {
    lstproducts = await page.$$('.preSale-product-box').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }
  }

  waitAllResponse.reset();
  for (let i = 0; i < lstproducts.length; i += 4) {
    await lstproducts[i].hover().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }
  }

  await waitAllResponse.waitDone(timeout).catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  return undefined;
}

exports.checkNeedLogin = checkNeedLogin;
exports.login = login;
exports.getProducts = getProducts;
exports.waitAllProducts = waitAllProducts;
