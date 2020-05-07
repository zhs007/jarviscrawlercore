const {p6vdyMovie} = require('./movie');
const {p6vdyMovies} = require('./movies');
const {
  newReply6vdy,
  newRequest6vdyMovies,
  newRequest6vdyMovie,
} = require('./proto.utils');

exports.p6vdyMovie = p6vdyMovie;
exports.p6vdyMovies = p6vdyMovies;

exports.newReply6vdy = newReply6vdy;
exports.newRequest6vdyMovies = newRequest6vdyMovies;
exports.newRequest6vdyMovie = newRequest6vdyMovie;
