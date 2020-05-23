// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * p6vdyMovie - 6vdy movie
 * @param {object} browser - browser
 * @param {string} urlPage - url for page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function p6vdyMovie(browser, urlPage, timeout) {
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
    log.error('p6vdyMovie.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = urlPage;
  let noretry = false;

  page.on('response', (res)=>{
    if (res.url() == baseurl) {
      if (res.status() >= 400 && res.status() < 500) {
        noretry = true;
      }
    }
  });

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('p6vdyMovie.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('p6vdyMovie.waitDone timeout');

    log.error('p6vdyMovie.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.widget.box.row', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            const lsta = eles[i].getElementsByTagName('a');
            if (
              lsta.length > 0 &&
            lsta[0].href.indexOf('/e/DownSys/play/?') > 0
            ) {
              for (let j = 0; j < lsta.length; ++j) {
                const curnode = {
                  name: lsta[j].innerText,
                  url: lsta[0].href,
                };

                lst.push(curnode);
              }

              if (lst.length > 0) {
                break;
              }
            }
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('p6vdyMovie.$$eval .widget.box.row', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (noretry) {
    awaiterr = new Error(
        'noretry:404 ' + baseurl,
    );

    log.error('p6vdyMovie noretry ', awaiterr);

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

exports.p6vdyMovie = p6vdyMovie;
