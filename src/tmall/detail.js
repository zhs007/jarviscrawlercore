const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');

/**
 * getTShopObj - get tshop object
 * @param {object} page - page
 * @return {object} ret - tshop object
 */
async function getTShopObj(page) {
  let html = await page.mainFrame().content();
  html = html.replace(/\n/g, '');
  html = html.replace(/\t/g, '');
  const ret = /TShop.Setup\((.+?)\)/.exec(html);
  if (ret[1]) {
    try {
      const retobj = JSON.parse(ret[1]);

      return retobj;
    } catch (err) {
      log.error('getTShopObj ', err);
    }
  }

  return undefined;
}

/**
 * tmallDetail - tmall detail
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmallDetail(browser, url, timeout) {
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
    log.error('tmallDetail.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://detail.tmall.com/item.htm?id=' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmallDetail.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmallDetail.waitDone timeout');

    log.error('tmallDetail.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  //   const ret = {};
  const skus = await page
      .$$eval('.tb-sku', (eles) => {
        if (eles.length > 0) {
          const skus = [];
          const lis = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lis.length; ++i) {
            const csku = {
              title: lis[i].getAttribute('title'),
              value: lis[i].dataset['value'],
            };

            if (csku.title && csku.value) {
              const lsta = lis[i].getElementsByTagName('a');
              if (lsta.length > 0) {
                csku.curimg = lsta[0].style['background'];
              }

              skus.push(csku);
            }
          }

          return skus;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmallDetail.$$eval .tb-sku', awaiterr);

    await page.close();

    return {error: awaiterr};
  }

  for (let i = 0; i < skus.length; ++i) {
    const arr = skus[i].curimg.split('("');
    if (arr.length == 2) {
      const arr1 = arr[1].split('")');
      skus[i].img = arr1[0];
      skus[i].img = skus[i].img.replace('40x40q90', '600x600');
    }
  }

  console.log(skus);

  const tshop = await getTShopObj(page);

  await page.close();

  return {ret: ret};
}

exports.tmallDetail = tmallDetail;
