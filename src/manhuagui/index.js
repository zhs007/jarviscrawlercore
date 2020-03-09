const {manhuaguiManhua} = require('./manhua');
const {manhuaguiBook} = require('./book');
const {manhuaguiDownloadComic} = require('./downloadcomic');
const {parseBookURL} = require('./utils');

exports.manhuagui = {
  manhua: manhuaguiManhua,
  book: manhuaguiBook,
  downloadComic: manhuaguiDownloadComic,
  parseBookURL: parseBookURL,
};

exports.manhuaguiManhua = manhuaguiManhua;
exports.manhuaguiBook = manhuaguiBook;

exports.manhuaguiDownloadComic = manhuaguiDownloadComic;
