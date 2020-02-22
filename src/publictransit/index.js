const {tokyometroLine, tokyometroSubwaymap} = require('../tokyometro/index');
const {kotsumetrotokyoSubways} = require('../kotsumetrotokyo/index');
const {jrailpassSubways} = require('../jrailpass/index');
const {
  newReplyPublicTransit,
  newRequestPTTokyoMetroSubways,
  newRequestPTTokyoMetroLine,
  newRequestPTKotsuMetroTokyoSubways,
  newRequestPTJRailPassSubways,
} = require('./proto.utils');

exports.tokyometroLine = tokyometroLine;
exports.tokyometroSubwaymap = tokyometroSubwaymap;

exports.kotsumetrotokyoSubways = kotsumetrotokyoSubways;

exports.jrailpassSubways = jrailpassSubways;

exports.newReplyPublicTransit = newReplyPublicTransit;

exports.newRequestPTTokyoMetroSubways = newRequestPTTokyoMetroSubways;
exports.newRequestPTTokyoMetroLine = newRequestPTTokyoMetroLine;

exports.newRequestPTKotsuMetroTokyoSubways = newRequestPTKotsuMetroTokyoSubways;

exports.newRequestPTJRailPassSubways = newRequestPTJRailPassSubways;
