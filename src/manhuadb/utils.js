/**
 * parseBookURL - parse book url
 * @param {string} bookurl - bookurl, it's like https://www.manhuadb.com/manhua/154/522_5654.html
 * @return {object} ret - {comicid: 154, bookid: 522_5654}
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
