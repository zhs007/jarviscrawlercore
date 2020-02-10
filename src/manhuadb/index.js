const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {manhuadbAuthor} = require('./author');
const {newReplyManhuadb, newRequestManhuadbAuthor} = require('./proto.utils');

exports.manhuadbAuthor = manhuadbAuthor;
exports.manhuadbBook = manhuadbBook;
exports.manhuadbManhua = manhuadbManhua;

exports.newReplyManhuadb = newReplyManhuadb;
exports.newRequestManhuadbAuthor = newRequestManhuadbAuthor;
