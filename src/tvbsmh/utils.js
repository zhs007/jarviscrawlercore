/**
 * parseBookURL - parse book url
 * @param {string} bookurl - bookurl, it's like https://www.tvbsmh.com/series-nnnny-496797-5
 * @return {object} ret - {comicid: nnnny, bookid: 496797}
 */
function parseBookURL(bookurl) {
  const arr = bookurl.split('-');
  const ret = {};
  ret.comicid = arr[1];
  ret.bookid = arr[2];
  return ret;
}

/**
 * isValidURL - is a valid url
 * @param {string} url - url
 * @return {boolean} isvalid - is valid url
 */
function isValidURL(url) {
  try {
    const urlo = new URL(url);
    if (urlo) {
      return true;
    }
  } catch (err) {}

  return false;
}

exports.parseBookURL = parseBookURL;
exports.isValidURL = isValidURL;
