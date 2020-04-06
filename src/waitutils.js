const {sleep} = require('./utils');

/**
 * waitForFunction
 * @param {object} page - page
 * @param {string} selector - selector
 * @param {function} func - function (eles) bool
 * @param {number} offtime - offtime ms
 * @param {number} timeout - timeout ms
 * @return {error} err - error
 */
async function waitForFunction(page, selector, func, offtime, timeout) {
  let awaiterr;
  let ct = 0;
  while (true) {
    const isdone = await page.$$eval(selector, func).catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    if (isdone) {
      return undefined;
    }

    if (ct > timeout) {
      break;
    }

    await sleep(offtime);
    ct += offtime;
  }

  return new Error('waitForFunction ' + selector + ' timeout');
}

/**
 * waitForLocalFunction
 * @param {object} page - page
 * @param {function} func - non-async function () bool
 * @param {number} offtime - offtime ms
 * @param {number} timeout - timeout ms
 * @return {error} err - error
 */
async function waitForLocalFunction(page, func, offtime, timeout) {
  let ct = 0;
  while (true) {
    const isdone = func();

    if (isdone) {
      return undefined;
    }

    if (ct > timeout) {
      break;
    }

    await sleep(offtime);
    ct += offtime;
  }

  return new Error('waitForFunction timeout');
}

exports.waitForFunction = waitForFunction;
exports.waitForLocalFunction = waitForLocalFunction;
