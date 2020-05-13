// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * p6vdyMovies - 6vdy movies
 * @param {object} browser - browser
 * @param {string} urlPage - url for page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function p6vdyMovies(browser, urlPage, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
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
    log.error('p6vdyMovies.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = urlPage;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('p6vdyMovies.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('p6vdyMovies.waitDone timeout');

    log.error('p6vdyMovies.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('#post_container', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lstli = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lstli.length; ++i) {
            const curnode = {};

            const lsta = lstli[i].getElementsByClassName('zoom');
            if (lsta.length > 0) {
              curnode.fullname = lsta[0].title;
              curnode.title = lsta[0].title;
              curnode.url = lsta[0].href;
            }

            const lstimg = lstli[i].getElementsByTagName('img');
            if (lstimg.length > 0) {
              curnode.cover = lstimg[0].src;
            }

            lst.push(curnode);
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('p6vdyMovies.$$eval #post_container', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  // for (let i = 0; i < lst.length; ++i) {
  //   const ci = {
  //     fullname: lst[i].name,
  //     url: lst[i].url,
  //     resid: parseID(lst[i].url),
  //   };

  //   ret.lst.push(ci);
  // }

  return {ret: ret};
}

exports.p6vdyMovies = p6vdyMovies;
