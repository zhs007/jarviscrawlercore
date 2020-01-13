// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {chgPageDevice} = require('../puppeteer.utils');
const {waitForLocalFunction} = require('../waitutils');
const {fixProduct} = require('./utils');
const {
  parseGetDetailResult,
  parseSKU,
  parseItem,
  parseSeller,
  parseProps,
  parseReviewTags,
} = require('../m.taobao.utils');
const {string2float} = require('../string.utils');

/**
 * tmallDetailMobile - taobao item mobile
 * @param {object} browser - browser
 * @param {string} itemid - itemid
 * @param {string} device - device
 * @param {string} cfgdevice - device in configuration
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmallDetailMobile(browser, itemid, device, cfgdevice, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  let curdevice = device;
  if (!curdevice || curdevice == '') {
    curdevice = cfgdevice;
  }

  awaiterr = await chgPageDevice(page, curdevice);
  if (awaiterr) {
    log.error('tmallDetailMobile.chgPageDevice', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const waitAllResponse = new WaitAllResponse(page);

  let getdetailret;
  let getdetailurl;

  page.on('dialog', async (dlg) => {
    log.warn(dlg.message());
    await dlg.dismiss();
  });

  page.on('response', async (res) => {
    const url = res.url();

    if (
      url.indexOf(
          'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail',
      ) >= 0
    ) {
      getdetailurl = url;

      log.info('response ok', url);

      getdetailret = await res.buffer().catch((err) => {
        log.error('tmallDetailMobile.WaitAllResponse.buffer ' + err);
      });
    }
  });

  await page
      .goto('https://detail.m.tmall.com/item.htm?id=' + itemid, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmallDetailMobile.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmallDetailMobile.waitDone timeout');

    log.error('tmallDetailMobile.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  awaiterr = await waitForLocalFunction(
      page,
      () => {
        return getdetailret != undefined;
      },
      1000,
      timeout,
  );
  if (awaiterr) {
    log.error('tmallDetailMobile.waitForLocalFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const detailobj = parseGetDetailResult(getdetailret, getdetailurl);
  if (detailobj.error) {
    awaiterr = detailobj.error;

    log.error('tmallDetailMobile.parseGetDetailResult', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {
    itemID: itemid,
  };

  ret.price = await page
      .$$eval('.price', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmallDetailMobile.$$eval .price', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret.price == undefined) {
    ret.price = await page
        .$$eval('span.num', (eles) => {
          if (eles.length > 0) {
            return eles[0].innerText;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });
    if (awaiterr) {
      log.error('tmallDetailMobile.$$eval span.num', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }
  }

  if (ret.price) {
    retprice = string2float(ret.price);
    if (retprice.error) {
      awaiterr = retprice.error;

      log.error('tmallDetailMobile.string2float', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.price = retprice.num;
  }

  if (detailobj.obj) {
    parseItem(detailobj.obj, ret);
    parseSeller(detailobj.obj, ret);
    parseProps(detailobj.obj, ret);
    parseReviewTags(detailobj.obj, ret);

    const skuret = parseSKU(detailobj.obj);
    if (skuret.error) {
      awaiterr = skuret.error;

      log.error('tmallDetailMobile.parseSKU', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (skuret.skus == undefined) {
      const cursku = {
        price: ret.price,
        title: ret.title,
      };

      if (Array.isArray(ret.imgs) && ret.imgs.length > 0) {
        cursku.img = ret.imgs[0];
      }

      ret.skus = [cursku];
    }

    ret.skus = skuret.skus;
  }

  // repeated string attributes = 6;
  // TaobaoShopInfo shop = 7;
  // int32 salesVolume = 8;          // 月销量
  // repeated string pay = 9;        // 支付列表，譬如信用卡等
  // repeated string service = 10;   // 服务承诺列表，譬如7天无理由退换等
  // string wl = 11;                 // 物流服务

  await page.close();

  return {ret: fixProduct(ret)};
}

exports.tmallDetailMobile = tmallDetailMobile;
