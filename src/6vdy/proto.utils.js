const messages = require('../../pbjs/result_pb');

/**
 * new P6vdyResInfo with object
 * @param {object} obj - P6vdyResInfo
 * @return {messages.P6vdyResInfo} result - P6vdyResInfo
 */
function newP6vdyResInfo(obj) {
  const result = new messages.P6vdyResInfo();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  return result;
}

/**
 * new P6vdyMovie with object
 * @param {object} obj - P6vdyMovie
 * @return {messages.P6vdyMovie} result - P6vdyMovie
 */
function newP6vdyMovie(obj) {
  const result = new messages.P6vdyMovie();

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

  if (Array.isArray(obj.lst) && obj.lst.length > 0) {
    for (let i = 0; i < obj.lst.length; ++i) {
      result.addLst(newP6vdyResInfo(obj.lst[i], i));
    }
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
      result.addLst(newP6vdyMovie(obj.lst[i]), i);
    }
  }

  return result;
}

/**
 * new ReplyP6vdy with object
 * @param {number} mode - messages.P6vdyMode
 * @param {object} obj - ReplyP6vdy
 * @return {messages.ReplyP6vdy} result - ReplyP6vdy
 */
function newReplyP6vdy(mode, obj) {
  const result = new messages.ReplyP6vdy();

  result.setMode(mode);

  if (mode == messages.P6vdyMode.P6VDY_MOVIES) {
    result.setMovies(newP6vdyMovies(obj));
  } else if (mode == messages.P6vdyMode.P6VDY_MOVIE) {
    result.setMovie(newP6vdyMovie(obj));
  }

  return result;
}

/**
 * new RequestP6vdy for newpage
 * @param {string} url - url
 * @return {messages.RequestP6vdy} result - RequestP6vdy
 */
function newRequestP6vdyMovies(url) {
  const result = new messages.RequestP6vdy();

  result.setMode(messages.P6vdyMode.P6VDY_MOVIES);
  result.setUrl(url);

  return result;
}

/**
 * new RequestP6vdy for respage
 * @param {string} url - url
 * @return {messages.RequestP6vdy} result - RequestP6vdy
 */
function newRequestP6vdyMovie(url) {
  const result = new messages.RequestP6vdy();

  result.setMode(messages.P6vdyMode.P6VDY_MOVIE);
  result.setUrl(url);

  return result;
}

exports.newReplyP6vdy = newReplyP6vdy;

exports.newRequestP6vdyMovies = newRequestP6vdyMovies;
exports.newRequestP6vdyMovie = newRequestP6vdyMovie;
