const messages = require('../../proto/result_pb');

/**
 * doubanType2str - DoubanType to string
 * @param {DoubanType} doubantype - doubantype
 * @return {string} str - string
 */
function doubanType2str(doubantype) {
  if (doubantype == messages.DoubanType.DBT_BOOK) {
    return 'book';
  }

  return '';
}

/**
 * str2doubanType - DoubanType to string
 * @param {string} str - string
 * @return {DoubanType} doubantype - doubantype
 */
function str2doubanType(str) {
  if (str == 'book') {
    return messages.DoubanType.DBT_BOOK;
  }

  return undefined;
}

/**
 * new newDoubanSubject with object
 * @param {object} obj - DoubanSubject
 * @return {messages.DoubanSubject} result - DoubanSubject
 */
function newDoubanSubject(obj) {
  const result = new messages.DoubanSubject();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.doubanType) {
    result.setDoubantype(str2doubanType(obj.doubanType));
  }

  if (obj.id) {
    result.setId(obj.id);
  }

  return result;
}

/**
 * new newDoubanSearch with object
 * @param {object} obj - DoubanSearch
 * @return {messages.DoubanSearch} result - DoubanSearch
 */
function newDoubanSearch(obj) {
  const result = new messages.DoubanSearch();

  if (obj.text) {
    result.setText(obj.text);
  }

  if (Array.isArray(obj.subjects) && obj.subjects.length > 0) {
    for (let i = 0; i < obj.subjects.length; ++i) {
      result.addSubjects(newDoubanSubject(obj.subjects[i], i));
    }
  }

  if (obj.doubanType) {
    result.setDoubantype(str2doubanType(obj.doubanType));
  }

  return result;
}

/**
 * new newReplyDouban with object
 * @param {number} mode - messages.DoubanMode
 * @param {object} obj - DoubanSearch | DoubanBook
 * @return {messages.ReplyDouban} result - ReplyDouban
 */
function newReplyDouban(mode, obj) {
  const result = new messages.ReplyDouban();

  result.setMode(mode);

  if (mode == messages.DoubanMode.DBM_SEARCH) {
    result.setSearch(newDoubanSearch(obj));
  }

  return result;
}

exports.newReplyDouban = newReplyDouban;

exports.doubanType2str = doubanType2str;
exports.str2doubanType = str2doubanType;
