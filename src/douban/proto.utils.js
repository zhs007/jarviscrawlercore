const messages = require('../../pbjs/result_pb');

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
 * new newDoubanBook with object
 * @param {object} obj - DoubanBook
 * @return {messages.DoubanBook} result - DoubanBook
 */
function newDoubanBook(obj) {
  const result = new messages.DoubanBook();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.id) {
    result.setId(obj.id);
  }

  if (obj.cover) {
    result.setCover(obj.cover);
  }

  if (Array.isArray(obj.authors) && obj.authors.length > 0) {
    result.setAuthorsList(obj.authors);
  }

  if (obj.score) {
    result.setScore(obj.score);
  }

  if (obj.ratingNums) {
    result.setRatingnums(obj.ratingNums);
  }

  if (obj.intro) {
    result.setIntro(obj.intro);
  }

  if (Array.isArray(obj.lstLink) && obj.lstLink.length > 0) {
    for (let i = 0; i < obj.lstLink.length; ++i) {
      result.addLstlink(newDoubanSubject(obj.lstLink[i], i));
    }
  }

  if (Array.isArray(obj.tags) && obj.tags.length > 0) {
    result.setTagsList(obj.tags);
  }

  if (Array.isArray(obj.otherTitle) && obj.otherTitle.length > 0) {
    result.setOthertitleList(obj.otherTitle);
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
  } else if (mode == messages.DoubanMode.DBM_BOOK) {
    result.setBook(newDoubanBook(obj));
  }

  return result;
}

/**
 * new RequestDouban for Search
 * @param {string} strType - string for DoubanType
 * @param {string} text - text for search
 * @return {messages.RequestDouban} result - RequestDouban
 */
function newRequestDoubanSearch(strType, text) {
  const result = new messages.RequestDouban();

  result.setMode(messages.DoubanMode.DBM_SEARCH);
  result.setText(text);
  result.setDoubantype(str2doubanType(strType));

  return result;
}

/**
 * new RequestDouban for Book
 * @param {string} id - id
 * @return {messages.RequestDouban} result - RequestDouban
 */
function newRequestDoubanBook(id) {
  const result = new messages.RequestDouban();

  result.setMode(messages.DoubanMode.DBM_BOOK);
  result.setId(id);

  return result;
}

exports.newReplyDouban = newReplyDouban;

exports.newRequestDoubanSearch = newRequestDoubanSearch;
exports.newRequestDoubanBook = newRequestDoubanBook;

exports.doubanType2str = doubanType2str;
exports.str2doubanType = str2doubanType;
