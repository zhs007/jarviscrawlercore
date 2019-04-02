
/**
 * export article to a jpg file
 * @param {object} page - page
 * @param {string} outputfile - output file
 * @param {int} jpgquality - jpg quality
 */
async function exportJPG(page, outputfile, jpgquality) {
  await page.waitForNavigation({waitUntil: 'networkidle2'}).catch((err) => {
    console.log('exportJPG.waitForNavigation:networkidle2', err);
  });

  await page.screenshot({
    path: outputfile,
    type: 'jpeg',
    quality: jpgquality,
    fullPage: true,
  });
}

exports.exportJPG = exportJPG;
