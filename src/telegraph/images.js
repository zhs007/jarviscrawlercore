const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {DownloadList} = require('../request');
const path = require('path');
const fs = require('fs');

/**
 * telegraphImages - telegraph images
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {boolean} isdownloadimgs - isdownloadimgs
 * @param {string} outputpath - outputpath
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function telegraphImages(
    browser,
    url,
    isdownloadimgs,
    outputpath,
    timeout,
) {
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
    log.error('telegraphImages.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = url;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('telegraphImages.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('telegraphImages.waitDone timeout');

    log.error('telegraphImages.goto', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('img', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            lst.push(eles[i].src);
          }
          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('telegraphImages.$$eval select', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {url: baseurl, images: []};

  if (isdownloadimgs) {
    const dl = new DownloadList();

    (async () => {
      await dl.run();
    })();

    for (let i = 0; i < lst.length; ++i) {
      const ci = {url: lst[i]};
      ret.images.push(ci);

      dl.addTask(
          lst[i],
          (buf, param) => {
            fs.writeFileSync(path.join(param.rootpath, param.pi + '.jpg'), buf);
            ret.images[param.pi].buf = buf;
          },
          {rootpath: outputpath, pi: i},
      );
    }

    while (true) {
      if (dl.isFinished()) {
        break;
      }

      await sleep(1000);
    }
  } else {
    for (let i = 0; i < lst.length; ++i) {
      const ci = {url: lst[i]};
      ret.images.push(ci);
    }
  }

  return {ret: ret};
}

exports.telegraphImages = telegraphImages;
