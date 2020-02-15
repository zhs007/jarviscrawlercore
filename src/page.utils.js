// const log = require('./log');

/**
 * disableDownloadImgs - disable download all images
 * @param {object} page - page
 */
async function disableDownloadImgs(page) {
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });
}

/**
 * disableDownloadOthers - disable download all image/media/font
 * @param {object} page - page
 */
async function disableDownloadOthers(page) {
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    // log.debug('disableDownloadOthers:request', {url: req.url()});

    const rt = req.resourceType();
    if (rt === 'image' || rt == 'media' || rt == 'font') {
      // log.debug('disableDownloadOthers:abort.');

      req.abort();
    } else {
      req.continue();
    }
  });
}

/**
 * disableDownloadOthersEx - disable download all image/media/font
 * @param {object} page - page
 * @param {function} funcIsCancel - bool isCancel(req)
 */
async function disableDownloadOthersEx(page, funcIsCancel) {
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    const rt = req.resourceType();
    if (rt === 'image' || rt == 'media' || rt == 'font') {
      req.abort();
    } else {
      if (funcIsCancel(req)) {
        req.abort();
      } else {
        req.continue();
      }
    }
  });
}

exports.disableDownloadImgs = disableDownloadImgs;
exports.disableDownloadOthers = disableDownloadOthers;
exports.disableDownloadOthersEx = disableDownloadOthersEx;
