const {startBrowser} = require('./src/browser');
const {
  manhuadbManhua,
  manhuadbBook,
  manhuadbDownloadComic,
} = require('./src/manhuadb/index');
const {
  manhuaguiManhua,
  manhuaguiBook,
  manhuaguiDownloadComic,
} = require('./src/manhuagui/index');
const log = require('./src/log');
const {downloadComic} = require('./src/downloadcomic');

exports.startBrowser = startBrowser;

exports.manhuadbManhua = manhuadbManhua;
exports.manhuadbBook = manhuadbBook;
exports.manhuadbDownloadComic = manhuadbDownloadComic;

exports.manhuaguiManhua = manhuaguiManhua;
exports.manhuaguiBook = manhuaguiBook;
exports.manhuaguiDownloadComic = manhuaguiDownloadComic;

exports.log = log;

exports.downloadComic = downloadComic;
