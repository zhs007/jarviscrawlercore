const {tvbsmhManhua} = require('./manhua');
const {tvbsmhBook} = require('./book');
const {tvbsmhDownloadComic} = require('./downloadcomic');
const {parseBookURL} = require('./utils');

exports.tvbsmh = {
  manhua: tvbsmhManhua,
  book: tvbsmhBook,
  downloadComic: tvbsmhDownloadComic,
  parseBookURL: parseBookURL,
};

exports.tvbsmhManhua = tvbsmhManhua;
exports.tvbsmhBook = tvbsmhBook;

exports.tvbsmhDownloadComic = tvbsmhDownloadComic;
