// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {closeDialog, procSKU} = require('./utils');
const {waitForLocalFunction} = require('../waitutils');
// const {getJSONStr} = require('../string.utils');

/**
 * tvbsmhManhua - tcbsmh manhua
 * @param {object} browser - browser
 * @param {string} comicid - comicid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tvbsmhManhua(browser, comicid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
  // await page.setRequestInterception(true);
  const waitAllResponse = new WaitAllResponse(page);

  // page.on('request', (req) => {
  //   if (req.resourceType() === 'image') {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });

  let lstmsg = [];

  page.on('response', async (res) => {
    const url = res.url();
    if (url == 'https://www.tvbsmh.com/comicinfo-ajaxgetchapter.html') {
      const buf = await res.buffer();
      const cb = JSON.parse(buf.toString());
      lstmsg.push(cb);
    }
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
    log.error('tvbsmhManhua.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.tvbsmh.com/comic-' + comicid;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tvbsmhManhua.goto ' + baseurl, awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tvbsmhManhua.waitDone timeout');

    log.error('tvbsmhManhua.waitDone ' + baseurl, err);

    await page.close();

    return {error: err.toString()};
  }

  const ret = {};

  ret.name = await page
      .$$eval('.bookms', (eles) => {
        if (eles.length > 0) {
          const lstname = eles[0].getElementsByClassName('bookname');
          if (lstname.length > 0) {
            return lstname[0].innerText;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tvbsmhManhua.$$eval .bookms > .bookname', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // ret.authors = await page
  //     .$$eval('.book-detail.pr.fr', (eles) => {
  //       if (eles.length > 0) {
  //         const lsta = eles[0].getElementsByTagName('a');
  //         const lst = [];
  //         for (let i = 0; i < lsta.length; ++i) {
  //           if (lsta[i].href.indexOf('https://www.manhuagui.com/author/') == 0) {
  //             lst.push(lsta[i].innerText);
  //           }
  //         }

  //         return lst;
  //       }

  //       return undefined;
  //     })
  //     .catch((err) => {
  //       awaiterr = err;
  //     });
  // if (awaiterr) {
  //   log.error('tvbsmhManhua.$$eval .book-detail.pr.fr', awaiterr);

  //   await page.close();

  //   return {error: awaiterr.toString()};
  // }

  const lstrootname = await page
      .$$eval('.seejilu', (eles) => {
        if (eles.length > 0) {
          const lsta = eles[0].getElementsByTagName('a');
          if (lsta.length > 0) {
            const lst = [];
            for (let i = 0; i < lsta.length; ++i) {
              lst.push(lsta[i].innerText);
            }

            return lst;
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tvbsmhManhua.$$eval .seejilu > a', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const lstcontinueread = await page.$$('.light.continue_read').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('tvbsmhManhua.$$ .light.continue_read', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (lstcontinueread.length > 0) {
    const canclickread = await page
        .$$eval('.usertips.is_adult', (eles) => {
          if (eles.length > 0) {
            if (eles[0].style.display == 'none') {
              return false;
            }
          }

          return true;
        })
        .catch((err) => {
          awaiterr = err;
        });
    if (awaiterr) {
      log.error('tvbsmhManhua.$$eval .usertips.is_adult', awaiterr);
    }

    if (canclickread) {
      await lstcontinueread[0].hover();
      await lstcontinueread[0].click();
    }
  }

  // while (lstmsg.length == 0) {
  //   await sleep(1000);
  // }

  await waitForLocalFunction(
      page,
      () => {
        return lstmsg.length > 0;
      },
      1000,
      timeout,
  );

  if (lstmsg[0].msg.length == 0) {
    lstmsg = [];

    const lsta = await page.$$('.light.chapter_type');
    if (lsta.length >= 1) {
      for (let i = 0; i < lsta.length; ++i) {
        await lsta[i].hover();
        await lsta[i].click();

        await waitForLocalFunction(
            page,
            () => {
              return lstmsg.length >= i + 1;
            },
            1000,
            timeout,
        );
        // while (lstmsg.length < i + 1) {
        //   await sleep(1000);
        // }
      }
    }
  } else {
    const lsta = await page.$$('.light.chapter_type');
    if (lsta.length > 1) {
      for (let i = 1; i < lsta.length; ++i) {
        await lsta[i].hover();
        await lsta[i].click();

        await waitForLocalFunction(
            page,
            () => {
              return lstmsg.length >= i + 1;
            },
            1000,
            timeout,
        );
        // while (lstmsg.length < i + 1) {
        //   await sleep(1000);
        // }
      }
    }
  }

  ret.books = [];
  for (let i = 0; i < lstmsg.length; ++i) {
    for (let j = 0; j < lstmsg[i].msg.length; ++j) {
      ret.books.push({
        title: lstmsg[i].msg[j].system.title,
        url:
          'https://www.tvbsmh.com/series-' +
          lstmsg[i].msg[j].system.cartoon_id +
          '-' +
          lstmsg[i].msg[j].system.chapter_id +
          '-1',
        name: lstmsg[i].msg[j].system.title,
        rootType: lstmsg[i].msg[j].system.chapter_type - 1,
        rootName: lstrootname[lstmsg[i].msg[j].system.chapter_type - 1],
      });
    }
  }

  // ret.books = await page
  //     .$$eval('#chapter-list-0', (eles) => {
  //       if (eles.length > 0) {
  //         const lst = [];
  //         for (let i = 0; i < eles.length; ++i) {
  //           const lsta = eles[i].getElementsByTagName('a');
  //           for (let j = 0; j < lsta.length; ++j) {
  //             lst.push({
  //               title: lsta[j].title,
  //               url: lsta[j].href,
  //               name: lsta[j].title,
  //               rootType: i,
  //             });
  //           }
  //         }

  //         return lst;
  //       }

  //       return undefined;
  //     })
  //     .catch((err) => {
  //       awaiterr = err;
  //     });
  // if (awaiterr) {
  //   log.error('tvbsmhManhua.$$eval #chapter-list-0', awaiterr);

  //   await page.close();

  //   return {error: awaiterr.toString()};
  // }

  // if (ret.books && lstrootname) {
  //   for (let i = 0; i < ret.books.length; ++i) {
  //     ret.books[i].rootName = lstrootname[ret.books[i].rootType];
  //   }
  // }

  await page.close();

  return {ret: ret};
}

exports.tvbsmhManhua = tvbsmhManhua;
