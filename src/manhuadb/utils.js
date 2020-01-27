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

exports.parseBookURL = parseBookURL;
