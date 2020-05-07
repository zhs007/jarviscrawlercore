const messages = require('../../proto/result_pb');

/**
 * new P6vdyResInfo with object
 * @param {object} obj - P6vdyResInfo
 * @return {messages.P6vdyResInfo} result - P6vdyResInfo
 */
function newP6vdyResInfo(obj) {
  const result = new messages.P6vdyResInfo();

  if (obj.fullname) {
    result.setFullname(obj.fullname);
  }

  if (obj.resid) {
    result.setResid(obj.resid);
  }

  if (Array.isArray(obj.title) && obj.title.length > 0) {
    result.setTitleList(obj.title);
  }

  if (Array.isArray(obj.director) && obj.director.length > 0) {
    result.setDirectorList(obj.director);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.cover) {
    result.setCover(obj.cover);
  }

  if (obj.fulldirector) {
    result.setFulldirector(obj.fulldirector);
  }

  if (obj.category) {
    result.setCategory(obj.category);
  }

  if (obj.season) {
    result.setSeason(obj.season);
  }

  if (obj.episode) {
    result.setEpisode(obj.episode);
  }

  return result;
}

/**
 * new P6vdyMovies with object
 * @param {object} obj - P6vdyMovies
 * @return {messages.P6vdyMovies} result - P6vdyMovies
 */
function newP6vdyMovies(obj) {
  const result = new messages.P6vdyMovies();

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newP6vdyResInfo(obj.lst[i], i));
    }
  }

  return result;
}

/**
 * new Reply6vdy with object
 * @param {number} mode - messages.P6vdyMode
 * @param {object} obj - Reply6vdy
 * @return {messages.Reply6vdy} result - Reply6vdy
 */
function newReply6vdy(mode, obj) {
  const result = new messages.Reply6vdy();

  result.setMode(mode);

  if (mode == messages.P6vdyMode.P6VDY_MOVIES) {
    result.setMovies(newP6vdyMovies(obj));
  } else if (mode == messages.P6vdyMode.P6VDY_MOVIE) {
    result.setMovie(newP6vdyResInfo(obj));
  }

  return result;
}

/**
 * new Request6vdy for newpage
 * @param {string} url - url
 * @return {messages.Request6vdy} result - Request6vdy
 */
function newRequest6vdyMovies(url) {
  const result = new messages.Request6vdy();

  result.setMode(messages.P6vdyMode.P6VDY_MOVIES);
  result.setUrl(url);

  return result;
}

/**
 * new Request6vdy for respage
 * @param {string} url - url
 * @return {messages.Request6vdy} result - Request6vdy
 */
function newRequest6vdyMovie(url) {
  const result = new messages.Request6vdy();

  result.setMode(messages.P6vdyMode.P6VDY_MOVIE);
  result.setUrl(url);

  return result;
}

exports.newReply6vdy = newReply6vdy;

exports.newRequest6vdyMovies = newRequest6vdyMovies;
exports.newRequest6vdyMovie = newRequest6vdyMovie;
