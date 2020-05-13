const messages = require('../../pbjs/result_pb');

/**
 * new ManhuaDBBook with object
 * @param {object} obj - ManhuaDBBook
 * @return {messages.ManhuaDBBook} result - ManhuaDBBook
 */
function newManhuaDBBook(obj) {
  const result = new messages.ManhuaDBBook();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.rootType) {
    result.setRoottype(obj.rootType);
  }

  if (obj.rootName) {
    result.setRootname(obj.rootName);
  }

  return result;
}

/**
 * new ManhuaDBManhua with object
 * @param {object} obj - ManhuaDBManhua
 * @return {messages.ManhuaDBManhua} result - ManhuaDBManhua
 */
function newManhuaDBManhua(obj) {
  const result = new messages.ManhuaDBManhua();

  if (obj.comicid) {
    result.setComicid(obj.comicid);
  }

  if (obj.name) {
    result.setName(obj.name);
  }

  if (Array.isArray(obj.books) && obj.books.length > 0) {
    for (let i = 0; i < obj.books.length; ++i) {
      result.addBooks(newManhuaDBBook(obj.books[i], i));
    }
  }

  if (Array.isArray(obj.authors) && obj.authors.length > 0) {
    result.setAuthorsList(obj.authors);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.cover) {
    result.setCover(obj.cover);
  }

  return result;
}

/**
 * new ManhuaDBAuthor with object
 * @param {object} obj - ManhuaDBAuthor
 * @return {messages.ManhuaDBAuthor} result - ManhuaDBAuthor
 */
function newManhuaDBAuthor(obj) {
  const result = new messages.ManhuaDBAuthor();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (Array.isArray(obj.otherName) && obj.otherName.length > 0) {
    result.setOthernameList(obj.otherName);
  }

  if (obj.detail) {
    result.setDetail(obj.detail);
  }

  if (Array.isArray(obj.manhua) && obj.manhua.length > 0) {
    for (let i = 0; i < obj.manhua.length; ++i) {
      result.addManhua(newManhuaDBManhua(obj.manhua[i], i));
    }
  }

  if (obj.authorid) {
    result.setAuthorid(obj.authorid);
  }

  return result;
}

/**
 * new ReplyManhuadb with object
 * @param {number} mode - messages.ReplyManhuadb
 * @param {object} obj - ManhuaDBAuthor
 * @return {messages.ReplyManhuadb} result - ReplyManhuadb
 */
function newReplyManhuadb(mode, obj) {
  const result = new messages.ReplyManhuaDB();

  result.setMode(mode);

  if (mode == messages.ManhuaDBMode.MHDB_AUTHOR) {
    result.setAuthor(newManhuaDBAuthor(obj));
  }

  return result;
}

/**
 * new RequestManhuadb for Author
 * @param {string} authorid - authorid
 * @return {messages.RequestManhuaDB} result - RequestManhuaDB
 */
function newRequestManhuadbAuthor(authorid) {
  const result = new messages.RequestManhuaDB();

  result.setMode(messages.ManhuaDBMode.MHDB_AUTHOR);
  result.setAuthorid(authorid);

  return result;
}

exports.newReplyManhuadb = newReplyManhuadb;

exports.newRequestManhuadbAuthor = newRequestManhuadbAuthor;
