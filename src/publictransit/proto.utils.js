const messages = require('../../pbjs/result_pb');

/**
 * new PublicTransitLine with object
 * @param {object} obj - PublicTransitLine
 * @return {messages.PublicTransitLine} result - PublicTransitLine
 */
function newPublicTransitLine(obj) {
  const result = new messages.PublicTransitLine();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.company) {
    result.setCompany(obj.company);
  }

  if (obj.country) {
    result.setCountry(obj.country);
  }

  if (obj.city) {
    result.setCity(obj.city);
  }

  if (Array.isArray(obj.stations) && obj.stations.length > 0) {
    result.setStationsList(obj.stations);
  }

  return result;
}

/**
 * new PublicTransitLines with object
 * @param {object} obj - PublicTransitLines
 * @return {messages.PublicTransitLines} result - PublicTransitLines
 */
function newPublicTransitLines(obj) {
  const result = new messages.PublicTransitLines();

  if (Array.isArray(obj.lines) && obj.lines.length > 0) {
    for (let i = 0; i < obj.lines.length; ++i) {
      result.addLines(newPublicTransitLine(obj.lines[i], i));
    }
  }

  return result;
}

/**
 * new ReplyPublicTransit with object
 * @param {number} mode - messages.PublicTransitMode
 * @param {object} obj - PublicTransitLines
 * @return {messages.ReplyPublicTransit} result - ReplyPublicTransit
 */
function newReplyPublicTransit(mode, obj) {
  const result = new messages.ReplyPublicTransit();

  result.setMode(mode);

  result.setLines(newPublicTransitLines(obj));

  return result;
}

/**
 * new RequestPublicTransit for tokyoMetro.subways
 * @return {messages.RequestHao6v} result - RequestHao6v
 */
function newRequestPTTokyoMetroSubways() {
  const result = new messages.RequestPublicTransit();

  result.setMode(messages.PublicTransitMode.PTM_TOKYOMETRO_SUBWAYS);

  return result;
}

/**
 * new newRequestPTTokyoMetroLine for tokyoMetro.line
 * @param {string} url - url
 * @return {messages.RequestPublicTransit} result - RequestPublicTransit
 */
function newRequestPTTokyoMetroLine(url) {
  const result = new messages.RequestPublicTransit();

  result.setMode(messages.PublicTransitMode.PTM_TOKYOMETRO_LINE);
  result.setUrl(url);

  return result;
}

/**
 * new RequestPublicTransit for kostumetrotokyo.subways
 * @return {messages.RequestPublicTransit} result - RequestPublicTransit
 */
function newRequestPTKotsuMetroTokyoSubways() {
  const result = new messages.RequestPublicTransit();

  result.setMode(messages.PublicTransitMode.PTM_KOSTUMETROTOKYO_SUBWAYS);

  return result;
}

/**
 * new RequestPublicTransit for jrailpass.subways
 * @return {messages.RequestPublicTransit} result - RequestPublicTransit
 */
function newRequestPTJRailPassSubways() {
  const result = new messages.RequestPublicTransit();

  result.setMode(messages.PublicTransitMode.PTM_JRAILPASS_SUBWAYS);

  return result;
}

exports.newReplyPublicTransit = newReplyPublicTransit;

exports.newRequestPTTokyoMetroSubways = newRequestPTTokyoMetroSubways;
exports.newRequestPTTokyoMetroLine = newRequestPTTokyoMetroLine;

exports.newRequestPTKotsuMetroTokyoSubways = newRequestPTKotsuMetroTokyoSubways;

exports.newRequestPTJRailPassSubways = newRequestPTJRailPassSubways;
