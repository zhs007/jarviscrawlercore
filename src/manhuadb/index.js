const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {manhuadbAuthor} = require('./author');
const {manhuadbDownloadComic} = require('./src/manhuadb/downloadcomic');
const {newReplyManhuadb, newRequestManhuadbAuthor} = require('./proto.utils');

exports.manhuadbAuthor = manhuadbAuthor;
exports.manhuadbBook = manhuadbBook;
exports.manhuadbManhua = manhuadbManhua;

exports.manhuadbDownloadComic = manhuadbDownloadComic;

exports.newReplyManhuadb = newReplyManhuadb;
exports.newRequestManhuadbAuthor = newRequestManhuadbAuthor;
