const {startBrowser} = require('../browser');
const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const log = require('../log');

/**
 * downloadComic - download comic
 * @param {boolean} isdebug - is debug mode
 * @param {string} comicid - comicid
 * @param {string} rootpath - rootpath
 * @return {error} err - error
 */
async function downloadComic(isdebug, comicid, rootpath) {
  const browser = await startBrowser(!isdebug);

  return undefined;
}

exports.downloadComic = downloadComic;
