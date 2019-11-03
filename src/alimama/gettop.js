const log = require('../log');
const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const {WaitFrameNavigated} = require('../waitframenavigated');
const {getProducts, waitAllProducts} = require('./utils');

/**
 * procMainCategory2 - process main category2
 * @param {object} page - page
 * @param {int} categoryIndex - index in category
 * @param {int} categoryIndex2 - index in category2
 * @param {object} waitchgpage - WaitFrameNavigated
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function procMainCategory2(
    page,
    categoryIndex,
    categoryIndex2,
    waitchgpage,
    waitAllResponse,
    timeout
) {
  const awaiterr = undefined;
  const lstcategory2 = await page
      .$$eval('.pub-threeiO.pub-threeiS', (eles) => {
        const lstcategory2 = [];
        if (eles.length > 0) {
          const lsta = eles[0].getElementsByTagName('a');
          for (let i = 0; i < lsta.length; ++i) {
            const cc = {
              name: lsta[i].innerText,
              force: false,
            };

            for (let j = 0; j < lsta[i].classList.length; ++j) {
              if (lsta[i].classList[j] == 'pub-threeiK') {
                cc.force = true;
              }
            }

            lstcategory2.push(cc);
          }
        }

        return lstcategory2;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  if (categoryIndex2 >= 0 && categoryIndex2 < lstcategory2.length) {
    if (!lstcategory2[categoryIndex2].force) {
      const lstc = await page.$$('.pub-threeiQ').catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        return {error: awaiterr};
      }

      if (lstc.length <= categoryIndex2) {
        return {
          error: new Error(
              'alimamaGetTop.procMainCategory2 invalid $$(.pub-threeiQ).'
          ),
        };
      }

      await lstc[categoryIndex2].hover();
      await sleep(50);

      waitchgpage.resetex();
      waitAllResponse.reset();

      await lstc[categoryIndex2].click();

      await waitchgpage.waitDone(timeout);
      await waitAllResponse.waitDone(timeout);
    }

    const retWaitAllProducts = await waitAllProducts(
        page,
        waitAllResponse,
        timeout
    );
    if (retWaitAllProducts) {
      await page.close();

      return {erroor: retWaitAllProducts};
    }

    const retp = await getProducts(page);
    if (retp.erroor) {
      return {error: retp.error};
    }

    return {
      ret: {
        category: lstcategory2[categoryIndex2].name,
        products: retp.lst,
      },
    };
  }

  return {error: new Error('alimamaGetTop.procMainCategory2 no data.')};
}

/**
 * procMainCategory - process main category
 * @param {object} page - page
 * @param {int} categoryIndex - index in category
 * @param {object} waitchgpage - WaitFrameNavigated
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function procMainCategory(
    page,
    categoryIndex,
    waitchgpage,
    waitAllResponse,
    timeout
) {
  let awaiterr = undefined;
  const lstcategory = await page
      .$$eval('.pub-threeiI', (eles) => {
        const lstcategory = [];
        for (let i = 0; i < eles.length; ++i) {
          const cc = {
            name: eles[i].innerText,
            force: false,
          };

          for (let j = 0; j < eles[i].classList.length; ++j) {
            if (eles[i].classList[j] == 'pub-threeiK') {
              cc.force = true;
            }
          }

          lstcategory.push(cc);
        }

        return lstcategory;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: awaiterr};
  }

  if (categoryIndex >= 0 && categoryIndex < lstcategory.length) {
    if (!lstcategory[categoryIndex].force) {
      const lstc = await page.$$('.pub-threeiI').catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        return {error: awaiterr};
      }

      if (lstc.length <= categoryIndex) {
        return {
          error: new Error(
              'alimamaGetTop.procMainCategory invalid $$(.pub-threeiI).'
          ),
        };
      }

      await lstc[categoryIndex].hover();
      await sleep(50);

      waitchgpage.resetex();
      waitAllResponse.reset();

      await lstc[categoryIndex].click();

      await waitchgpage.waitDone(timeout);
      await waitAllResponse.waitDone(timeout);
    }

    const maxcategory2 = await page
        .$$eval('.pub-threeiO.pub-threeiS', (eles) => {
          if (eles.length > 0) {
            const lsta = eles[0].getElementsByTagName('a');
            return lsta.length;
          }

          return 0;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      return {error: awaiterr};
    }

    const lst = [];
    for (let i = 0; i < maxcategory2; ++i) {
      const cr = await procMainCategory2(
          page,
          categoryIndex,
          i,
          waitchgpage,
          waitAllResponse,
          timeout
      );
      if (cr.error) {
        return {error: cr.error};
      }

      lst.push({
        category: [lstcategory[categoryIndex].name, cr.ret.category],
        products: cr.ret.products,
      });
    }

    return {ret: lst};
  }

  return {error: new Error('alimamaGetTop.procMainCategory no data.')};
}

/**
 * alimamaGetTop - alimama get top products
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function alimamaGetTop(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  const url = 'https://pub.alimama.com/promo/search/index.htm';
  // checkNeedLogin(page, url);

  const waitAllResponse = new WaitAllResponse(page);
  const mainframe = await page.mainFrame();
  const waitchgpage = new WaitFrameNavigated(page, mainframe, async (frame) => {
    const cururl = frame.url();

    return cururl.indexOf(url) == 0;
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

    return {erroor: err};
  }

  waitAllResponse.reset();

  const maxcategory = await page
      .$$eval('.pub-threeiI', (eles) => {
        return eles.length;
      })
      .catch((err) => {
        awaiterr = err;
      });

  const lst = [];
  for (let i = 0; i < maxcategory; ++i) {
    const cr = await procMainCategory(
        page,
        i,
        waitchgpage,
        waitAllResponse,
        timeout
    );
    if (cr.error) {
      return {error: cr.error};
    }

    lst.push(...cr.ret);
  }

  console.log(lst);

  await page.close();

  return {ret: lst};
}

exports.alimamaGetTop = alimamaGetTop;
