const puppeteer = require('puppeteer');

/**
 * closeAllPagesEx - close all pages if pages > nums
 * @param {object} page - page
 * @param {string} devicename - devicename
 * @return {error} err - error
 */
async function chgPageDevice(page, devicename) {
  if (puppeteer.devices[devicename]) {
    await page.emulate(puppeteer.devices[devicename]);

    return undefined;
  }

  return new Error('chgPageDevice no device ' + devicename);
}

exports.chgPageDevice = chgPageDevice;
