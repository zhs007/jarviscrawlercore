const {sleep} = require('./utils');

/**
 * getElementPropertyString - get element property string
 * @param {object} ele - element
 * @param {string} prop - property
 * @return {object} ret - {error, str}
 */
async function getElementPropertyString(ele, prop) {
  let awaiterr;
  const val = await ele.getProperty(prop).catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return {error: awaiterr};
  }

  jsonval = await val.jsonValue().catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return {error: awaiterr};
  }

  return {str: jsonval.toString()};
}

/**
 * getElementProperty - get ElementHandle property
 * @param {object} ele - element
 * @param {string} prop - property name
 * @return {string} str - string
 */
async function getElementProperty(ele, prop) {
  const pv = await ele.getProperty(prop);
  return await pv.jsonValue();
}

/**
 * clearInput - clear input
 * @param {object} page - page
 * @param {object} ele - input element
 * @return {Error} err - error
 */
async function clearInput(page, ele) {
  let awaiterr;
  await ele.focus();

  let val = await getElementProperty(ele, 'value');
  while (val && val.length > 0) {
    await page.keyboard.press('Backspace').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    await sleep(10);

    val = await getElementProperty(ele, 'value');
  }

  return undefined;
}

/**
 * isElementVisible
 * @param {object} page - page
 * @param {object} ele - element
 * @return {bool} isvisible - is visible
 */
async function isElementVisible(page, ele) {
  const isVisibleHandle = await page.evaluateHandle((e) => {
    const style = window.getComputedStyle(e);
    return (
      style &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }, ele);
  const visible = await isVisibleHandle.jsonValue();
  const box = await ele.boxModel();
  if (visible && box) {
    return true;
  }
  return false;
}

exports.clearInput = clearInput;
exports.getElementPropertyString = getElementPropertyString;
exports.isElementVisible = isElementVisible;
exports.getElementProperty = getElementProperty;
