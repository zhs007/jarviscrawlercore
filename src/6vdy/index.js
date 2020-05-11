const {p6vdyMovie} = require('./movie');
const {p6vdyMovies} = require('./movies');
const {
  newReplyP6vdy,
  newRequestP6vdyMovies,
  newRequestP6vdyMovie,
} = require('./proto.utils');

exports.p6vdyMovie = p6vdyMovie;
exports.p6vdyMovies = p6vdyMovies;

exports.newReplyP6vdy = newReplyP6vdy;
exports.newRequestP6vdyMovies = newRequestP6vdyMovies;
exports.newRequestP6vdyMovie = newRequestP6vdyMovie;
