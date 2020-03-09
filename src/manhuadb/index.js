const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {manhuadbAuthor} = require('./author');
const {manhuadbDownloadComic} = require('./downloadcomic');
const {newReplyManhuadb, newRequestManhuadbAuthor} = require('./proto.utils');
const {parseBookURL} = require('./utils');

exports.manhuadb = {
  manhua: manhuadbManhua,
  book: manhuadbBook,
  downloadComic: manhuadbDownloadComic,
  parseBookURL: parseBookURL,
};

exports.manhuadbAuthor = manhuadbAuthor;
exports.manhuadbBook = manhuadbBook;
exports.manhuadbManhua = manhuadbManhua;

exports.manhuadbDownloadComic = manhuadbDownloadComic;

exports.newReplyManhuadb = newReplyManhuadb;
exports.newRequestManhuadbAuthor = newRequestManhuadbAuthor;
