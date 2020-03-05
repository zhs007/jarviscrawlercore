// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * lieyunwangNews - lieyunwang news
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function lieyunwangNews(browser, timeout) {
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
    log.error('lieyunwangNews.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.lieyunwang.com/archives';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('lieyunwangNews.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('lieyunwangNews.waitDone timeout');

    log.error('lieyunwangNews.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.article-bar.clearfix', (eles) => {
        console.log(eles);
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curnode = {headimgs: [], tags: []};
          // const lsttag = eles[i].getElementsByClassName('tag');
          // if (lsttag.length > 0) {
          //   const lsttaga = lsttag[0].getElementsByTagName('a');
          //   if (lsttaga.length > 0) {
          //     curnode.tags.push(lsttaga[0].innerText);
          //   }
          // }

          const lsttitle = eles[i].getElementsByTagName('h2');
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
            if (lstimg[0].dataset && lstimg[0].dataset.src) {
              curnode.headimgs.push(lstimg[0].dataset.src);
            }
          }

          const lstinfo = eles[i].getElementsByClassName('article-digest mt10');
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
    log.error('lieyunwangNews.$$eval .post_part.clear', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.lieyunwangNews = lieyunwangNews;
