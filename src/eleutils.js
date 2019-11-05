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
 * clearInput - clear input
 * @param {object} ele - input element
 * @return {Error} err - error
 */
async function clearInput(ele) {
  let awaiterr;
  await ele.focus();

  while (ele.value && ele.value.length > 0) {
    await page.keyboard.press('Backspace').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    await sleep(10);
  }

  return undefined;
}

exports.clearInput = clearInput;
exports.getElementPropertyString = getElementPropertyString;
