// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * com36krNews - 36kr news
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function com36krNews(browser, timeout) {
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
    log.error('com36krNews.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://36kr.com/information/web_news';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('com36krNews.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('com36krNews.waitDone timeout');

    log.error('com36krNews.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.kr-flow-article-item', (eles) => {
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curnode = {headimgs: [], tags: []};
          const lsttag = eles[i].getElementsByClassName('article-item-channel');
          if (lsttag.length > 0) {
            if (lsttag[0].innerText != '推荐' && lsttag[0].innerText != '其他') {
              curnode.tags.push(lsttag[0].innerText);
            }
          }

          const lsttag2 = eles[i].getElementsByClassName('kr-flow-bar-motif');
          if (lsttag2.length > 0) {
            const lsttag2a = lsttag2[0].getElementsByTagName('a');
            if (lsttag2a.length > 0) {
              if (lsttag2a[0].innerText != '其他') {
                curnode.tags.push(lsttag2a[0].innerText);
              }
            }
          }

          const lsttitle = eles[i].getElementsByClassName('article-item-title');
          if (lsttitle.length > 0) {
            curnode.title = lsttitle[0].innerText;
            curnode.url = lsttitle[0].href;
          }

          const lstimg = eles[i].getElementsByTagName('img');
          if (lstimg.length > 0) {
            curnode.headimgs.push(lstimg[0].src);
          }

          const lstinfo = eles[i].getElementsByClassName(
              'article-item-description',
          );
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
    log.error('com36krNews.$$eval .kr-flow-article-item', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.com36krNews = com36krNews;
