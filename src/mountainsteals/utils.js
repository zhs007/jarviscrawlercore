/**
 * getURLCode - get url code,
 *    https://www.mountainsteals.com/product/the-north-face-women-s-apex-bionic-2-jacket_10316935 -> the-north-face-women-s-apex-bionic-2-jacket_10316935
 * @param {string} furl - full url
 * @return {string} urlcode - urlcode
 */
function getURLCode(furl) {
  const arr = furl.split('https://www.mountainsteals.com/product/');
  if (arr.length > 1) {
    return arr[1];
  }

  return furl;
}

exports.getURLCode = getURLCode;
