const messages = require('../proto/result_pb');

/**
 * new ReplyAlimama with object
 * @param {number} mode - messages.JDMode
 * @param {object} obj - AlimamaProducts or AlimamaTopInfo or undefined object
 * @return {messages.ReplyAlimama} result - ReplyAlimama
 */
function newReplyAlimama(mode, obj) {
  const result = new messages.ReplyAlimama();

  result.setMode(mode);

  // if (mode == messages.JDMode.JDM_PRODUCT) {
  //   result.setProduct(newJDProduct(obj));
  // } else if (
  //   mode == messages.JDMode.JDM_ACTIVE ||
  //   mode == messages.JDMode.JDM_ACTIVEPAGE
  // ) {
  //   result.setActive(newJDActive(obj));
  // }

  return result;
}

exports.newReplyAlimama = newReplyAlimama;
