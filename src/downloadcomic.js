const {manhuadbDownloadComic} = require('./manhuadb/index');
const {manhuaguiDownloadComic} = require('./manhuagui/index');

/**
 * downloadComic - download comic
 * @param {boolean} isdebug - is debug mode
 * @param {string} comicid - comicid
 * @param {string} bookid - bookid
 * @param {int} roottype - roottype, -1,0,1...
 * @param {string} rootpath - rootpath
 * @param {string} source - source
 * @return {error} err - error
 */
function downloadComic(isdebug, comicid, bookid, roottype, rootpath, source) {
  if (source == 'manhuadb') {
    return manhuadbDownloadComic(isdebug, comicid, bookid, roottype, rootpath);
  } else if (source == 'manhuagui') {
    return manhuaguiDownloadComic(isdebug, comicid, bookid, roottype, rootpath);
  }

  return new Error('downloadComic source ' + source + ' is error!');
}

exports.downloadComic = downloadComic;
