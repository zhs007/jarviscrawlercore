// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * tmtpostNews - tmtpost news
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmtpostNews(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthersEx(page, (req) => {
    const url = req.url();
    if (url.indexOf('openx.net') >= 0) {
      return true;
    }

    return false;
  });

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
    log.error('tmtpostNews.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.tmtpost.com/';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmtpostNews.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmtpostNews.waitDone timeout');

    log.error('tmtpostNews.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.post_part.clear', (eles) => {
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curnode = {headimgs: [], tags: []};
          const lsttag = eles[i].getElementsByClassName('tag');
          if (lsttag.length > 0) {
            const lsttaga = lsttag[0].getElementsByTagName('a');
            if (lsttaga.length > 0) {
              curnode.tags.push(lsttaga[0].innerText);
            }
          }

          const lsttitle = eles[i].getElementsByTagName('h3');
          if (lsttitle.length > 0) {
            curnode.title = lsttitle[0].innerText;
            // curnode.url = lsttitle[0].href;
          }

          const lsta = eles[i].getElementsByTagName('a');
          if (lsta.length > 0) {
            curnode.url = lsta[0].href;
          }

          const lstimg = eles[i].getElementsByTagName('img');
          if (lstimg.length > 0) {
            if (lstimg[0].dataset && lstimg[0].dataset.original) {
              curnode.headimgs.push(lstimg[0].dataset.original);
            }
          }

          const lstinfo = eles[i].getElementsByClassName('summary');
          if (lstinfo.length > 0) {
            curnode.summary = lstinfo[0].innerText;
          }

          lst.push(curnode);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmtpostNews.$$eval .post_part.clear', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.tmtpostNews = tmtpostNews;
