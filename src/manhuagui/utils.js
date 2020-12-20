/**
 * parseBookURL - parse book url
 * @param {string} bookurl - bookurl, it's like https://www.manhuagui.com/comic/1769/15446.html?p=123
 * @return {object} ret - {comicid: 1769, bookid: 15446}
 */
function parseBookURL(bookurl) {
  const arr = bookurl.split('/');
  const ret = {};
  ret.comicid = arr[arr.length - 2];
  const arr1 = arr[arr.length - 1].split('.');
  ret.bookid = arr1[0];
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

/**
 * fixComicName - fix comic name
 * @param {string} name - name
 * @return {string} name - name
 */
function fixComicName(name) {
  return name.replace(/\//g, '');
}

exports.parseBookURL = parseBookURL;
exports.isValidURL = isValidURL;
exports.fixComicName = fixComicName;
