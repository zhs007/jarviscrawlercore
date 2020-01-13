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
  findCurrentRelatedItem,
  procRelatedItem,
} = require('../m.taobao.utils');
const {string2float} = require('../string.utils');

/**
 * taobaoItemMobile - taobao item mobile
 * @param {object} browser - browser
 * @param {string} itemid - itemid
 * @param {string} device - device
 * @param {string} cfgdevice - device in configuration
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function taobaoItemMobile(browser, itemid, device, cfgdevice, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  let curdevice = device;
  if (!curdevice || curdevice == '') {
    curdevice = cfgdevice;
  }

  awaiterr = await chgPageDevice(page, curdevice);
  if (awaiterr) {
    log.error('taobaoItemMobile.chgPageDevice', awaiterr);

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
        log.error('taobaoItemMobile.WaitAllResponse.buffer ' + err);
      });
    }
  });

  await page
      .goto('https://h5.m.taobao.com/awp/core/detail.htm?id=' + itemid, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('taobaoItemMobile.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('taobaoItemMobile.waitDone timeout');

    log.error('taobaoItemMobile.goto', err);

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
    log.error('taobaoItemMobile.waitForLocalFunction', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const detailobj = parseGetDetailResult(getdetailret, getdetailurl);
  if (detailobj.error) {
    awaiterr = detailobj.error;

    log.error('taobaoItemMobile.parseGetDetailResult', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = {
    itemID: itemid,
  };

  ret.price = await page
      .$$eval('.o-t-price', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoItemMobile.$$eval .o-t-price', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret.price) {
    retprice = string2float(ret.price);
    if (retprice.error) {
      awaiterr = retprice.error;

      log.error('taobaoItemMobile.string2float', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.price = retprice.num;
  }

  ret.relatedItems = await page
      .$$eval('ul.related-list', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lsta = eles[0].getElementsByTagName('a');

          for (let i = 0; i < lsta.length; ++i) {
            const curitem = {url: lsta[i].href, name: lsta[i].innerText};
            if (lsta[i].className == 'current') {
              curitem.isCurrent = true;
            }

            lst.push(curitem);
          }

          return lst;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('taobaoDetailMobile.$$eval ul.related-list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret.relatedItems) {
    procRelatedItem(ret.relatedItems);
  }

  if (detailobj.obj) {
    parseItem(detailobj.obj, ret);
    parseSeller(detailobj.obj, ret);
    parseProps(detailobj.obj, ret);
    parseReviewTags(detailobj.obj, ret);

    const skuret = parseSKU(detailobj.obj);
    if (skuret.error) {
      awaiterr = skuret.error;

      log.error('taobaoItemMobile.parseSKU', awaiterr);

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

      const relatedItem = findCurrentRelatedItem(ret.relatedItems);
      if (relatedItem) {
        cursku.title = relatedItem.name;
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

exports.taobaoItemMobile = taobaoItemMobile;
