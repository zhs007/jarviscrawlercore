const log = require('../log');
const {closeAllPagesEx} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');

/**
 * getProductsInBrowser - get products in browser
 * @param {array} eles - elements
 * @return {array} lst - products
 */
function getProductsInBrowser(eles) {
  const lst = [];

  console.log('getProductsInBrowser ' + eles.length);

  for (let i = 0; i < eles.length; ++i) {
    const cp = {};

    if (eles[i].className.indexOf('item-ad') >= 0) {
      cp.isAD = true;
    }

    const lstclickstat = eles[i].getElementsByClassName('J_ClickStat');
    if (lstclickstat.length > 0) {
      for (let j = 0; j < lstclickstat.length; ++j) {
        if (lstclickstat[j].dataset['nid']) {
          cp.itemID = lstclickstat[j].dataset['nid'];

          break;
        }
      }

      cp.url = lstclickstat[0].href;
    }

    const lstimgs = eles[i].getElementsByTagName('img');
    if (lstimgs.length > 0) {
      for (let j = 0; j < lstimgs.length; ++j) {
        if (lstimgs[j].dataset['src']) {
          cp.img = lstimgs[j].dataset['src'];

          break;
        }
      }
    }

    const lsttitle = eles[i].getElementsByClassName('title');
    if (lsttitle.length > 0) {
      cp.title = lsttitle[0].innerText;
    }

    const lstshopname = eles[i].getElementsByClassName(
        'shopname J_MouseEneterLeave J_ShopInfo',
    );
    if (lstshopname.length > 0) {
      cp.shopurl = lstshopname[0].href;
      cp.shopname = lstshopname[0].innerText;

      if (lstshopname[0].dataset['userid']) {
        cp.shopid = lstshopname[0].dataset['userid'];
      }
    }

    const lstlocation = eles[i].getElementsByClassName('location');
    if (lstlocation.length > 0) {
      cp.lstlocation = lstlocation[0].innerText;
    }

    const lstprice = eles[i].getElementsByClassName(
        'price g_price g_price-highlight',
    );
    if (lstprice.length > 0) {
      const lstp = lstprice[0].getElementsByTagName('strong');
      if (lstp.length > 0) {
        cp.price = lstp[0].innerText;
      }
    }

    const lstdeal = eles[i].getElementsByClassName('deal-cnt');
    if (lstdeal.length > 0) {
      cp.strDeal = lstdeal[0].innerText;
    }

    const lsticon = eles[i].getElementsByClassName('icon');
    if (lsticon.length > 0) {
      cp.icons = [];

      for (let j = 0; j < lsticon.length; ++j) {
        const lstspan = lsticon[j].getElementsByTagName('span');
        if (lstspan.length > 0) {
          for (let k = 0; k < lstspan.length; ++k) {
            cp.icons.push(lstspan[k].className);
          }
        }
      }
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
  const lst = await page
      .$$eval('.item.J_MouserOnverReq', getProductsInBrowser)
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: err};
  }

  // for (let i = 0; i < lst.length; ++i) {
  // }

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

  let ct = 0;
  let lstproducts;
  while (true) {
    lstproducts = await page.$$('.item.J_MouserOnverReq').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    if (lstproducts.length > 0) {
      break;
    }

    if (ct >= timeout) {
      return new Error('waitAllProducts timeout.');
    }

    await sleep(1000);
    ct += 1000;
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

/**
 * taobaoSearch - taobao search
 * @param {object} browser - browser
 * @param {string} text - text
 * @param {object} cfg - config
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function taobaoSearch(browser, text, cfg, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = 'https://www.taobao.com/';

  const waitAllResponse = new WaitAllResponse(page);
  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const cururl = frame.url();

    return cururl.indexOf('https://s.taobao.com/search') == 0;
  });

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
    log.error('taobaoSearch.setViewport', awaiterr);

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
    log.error('taobaoSearch.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('taobaoSearch.waitDone timeout.');

    log.error('taobaoSearch.waitDone ', err);

    await page.close();

    return {error: err.toString()};
  }

  waitAllResponse.reset();

  const lstinput = await page.$$('.search-combobox-input').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('taobaoSearch.$$(.search-combobox-input) ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (lstinput.length <= 0) {
    const err = new Error('taobaoSearch.$$(.search-combobox-input) non-input.');

    log.error('taobaoSearch.$$(.search-combobox-input) ', err);

    await page.close();

    return {error: err.toString()};
  }

  await lstinput[0].hover();
  await lstinput[0].type(text, {delay: 10});

  waitchgpage.resetex();
  waitAllResponse.reset();

  await lstinput[0].type(String.fromCharCode(13));

  await waitchgpage.waitDone(timeout);
  await waitAllResponse.waitDone(timeout);

  const retWaitAllProducts = await waitAllProducts(
      page,
      waitAllResponse,
      timeout,
  );
  if (retWaitAllProducts) {
    log.error('taobaoSearch.waitAllProducts ', retWaitAllProducts);

    await page.close();

    return {error: retWaitAllProducts.toString()};
  }

  const ret = await getProducts(page);
  if (ret.error) {
    log.error('taobaoSearch.getProducts ', ret.error);

    await page.close();

    return {error: ret.error.toString()};
  }

  await page.close();

  await closeAllPagesEx(browser, 6);

  return {ret: {text: text, items: ret.lst}};
}

exports.taobaoSearch = taobaoSearch;
