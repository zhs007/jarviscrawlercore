// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * baijingappNews - baijingapp news
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function baijingappNews(browser, timeout) {
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
    log.error('baijingappNews.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'http://www.baijingapp.com/';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('baijingappNews.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('baijingappNews.waitDone timeout');

    log.error('baijingappNews.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.articleSingle', (eles) => {
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

          const lsttitle = eles[i].getElementsByTagName('h1');
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
            const imgurl = lstimg[0].getAttribute('data-original');
            if (imgurl) {
            // const furl = new URL(imgurl, baseurl);
              curnode.headimgs.push(imgurl);
            }
          }

          const lstinfo = eles[i].getElementsByClassName('articleSingle-content');
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
    log.error('baijingappNews.$$eval .post_part.clear', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  for (let i = 0; i < lst.length; ++i) {
    for (let j = 0; j < lst[i].headimgs.length; ++j) {
      const furl = new URL(lst[i].headimgs[j], baseurl);
      lst[i].headimgs[j] = furl.toString();
    }
  }

  const ret = {lst: lst};

  return {ret: ret};
}

exports.baijingappNews = baijingappNews;
