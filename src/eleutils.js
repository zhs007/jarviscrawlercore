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

exports.getElementPropertyString = getElementPropertyString;
