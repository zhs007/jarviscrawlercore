const {startBrowser} = require('./src/browser');
const {manhuadbManhua} = require('./src/manhuadb/manhua');
const {manhuadbBook} = require('./src/manhuadb/book');
const {downloadComic} = require('./src/manhuadb/downloadcomic');
const log = require('./src/log');

exports.startBrowser = startBrowser;

exports.manhuadbManhua = manhuadbManhua;
exports.manhuadbBook = manhuadbBook;
exports.downloadComic = downloadComic;

exports.log = log;
