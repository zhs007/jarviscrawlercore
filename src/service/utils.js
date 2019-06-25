const messages = require('../../proto/result_pb');

/**
 * replyError
 * @param {object} call - call
 * @param {string} error - error
 * @param {bool} isend - is end
 */
function replyError(call, error, isend) {
  console.log(error);

  const reply = new messages.ReplyCrawlerStream();

  reply.setError(error);

  call.write(reply);

  if (isend) {
    call.end();
  }
}

/**
 * replyMsg
 * @param {object} call - call
 * @param {object} msg - ReplyCrawler
 * @param {bool} isend - is end
 */
function replyMsg(call, msg, isend) {
  const reply = new messages.ReplyCrawlerStream();

  reply.setReplycrawler(msg);

  call.write(reply);

  if (isend) {
    call.end();
  }
}

exports.replyError = replyError;
exports.replyMsg = replyMsg;
