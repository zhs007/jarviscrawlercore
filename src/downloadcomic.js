const {manhuadb} = require('./manhuadb/index');
const {manhuagui} = require('./manhuagui/index');
const {tvbsmh} = require('./tvbsmh/index');

/**
 * downloadComic - download comic
 * @param {boolean} isdebug - is debug mode
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {int} roottype - roottype, -1,0,1...
 * @param {string} rootpath - rootpath
 * @param {string} source - source
 * @param {int} timeout - timeout, default is 30000 (30s)
 * @return {error} err - error
 */
function downloadComic(
    isdebug,
    comicid,
    bookid,
    roottype,
    rootpath,
    source,
    timeout,
) {
  if (source == 'manhuadb') {
    return manhuadb.downloadComic(
        isdebug,
        comicid,
        bookid,
        roottype,
        rootpath,
        timeout,
    );
  } else if (source == 'manhuagui') {
    return manhuagui.downloadComic(
        isdebug,
        comicid,
        bookid,
        roottype,
        rootpath,
        timeout,
    );
  } else if (source == 'tvbsmh') {
    return tvbsmh.downloadComic(
        isdebug,
        comicid,
        bookid,
        roottype,
        rootpath,
        timeout,
    );
  }

  return new Error('downloadComic source ' + source + ' is error!');
}

/**
 * parseComicBookURL - parse book url
 * @param {string} bookurl - bookurl, it's like https://www.manhuagui.com/comic/1769/15446.html?p=123
 * @return {object} ret - {comicid: 1769, bookid: 15446} or error
 */
function parseComicBookURL(bookurl) {
  if (bookurl.indexOf('manhuadb.com') >= 0) {
    return manhuadb.parseBookURL(bookurl);
  } else if (bookurl.indexOf('manhuagui.com') >= 0) {
    return manhuagui.parseBookURL(bookurl);
  } else if (bookurl.indexOf('tvbsmh.com') >= 0) {
    return tvbsmh.parseBookURL(bookurl);
  }

  return new Error('parseComicBookURL ' + bookurl + ' is error!');
}

exports.downloadComic = downloadComic;
exports.parseComicBookURL = parseComicBookURL;
