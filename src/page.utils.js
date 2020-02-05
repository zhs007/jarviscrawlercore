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
    const rt = req.resourceType();
    if (rt === 'image' || rt == 'media' || rt == 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });
}

exports.disableDownloadImgs = disableDownloadImgs;
exports.disableDownloadOthers = disableDownloadOthers;
