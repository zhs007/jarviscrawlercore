const fs = require('fs');
const path = require('path');

/**
     * replaceAll
     * @param {string} str - browser
     * @param {string} src - game code
     * @param {string} dest - output path
     * @return {error} newstr - newstr
     */
function replaceAll(str, src, dest) {
  while (true) {
    nstr = str.replace(src, dest);
    if (nstr == str) {
      return str;
    }

    str = nstr;
  }
}

/**
     * yccompanies
     * @param {object} browser - browser
     * @param {string} gamecode - game code
     * @param {string} outputpath - output path
     */
async function blobimg(browser, gamecode, outputpath) {
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  page.on('response', async (response) => {
    if (!response) {
      return;
    }

    const url = response.url();
    if (url.indexOf('blob:') == 0) {
      fn = replaceAll(url, ':', '_');
      fn = replaceAll(fn, '/', '_');

      buf = await response.buffer();
      fs.writeFileSync(path.join(outputpath, fn), buf);
    }
  });

  await page.goto('https://www.playngo.com/games#' + gamecode, {
    waitUntil: 'networkidle0',
    timeout: 0,
  });
}

exports.blobimg = blobimg;


