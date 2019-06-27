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
  // console.log('replyMsg');

  const reply = new messages.ReplyCrawlerStream();

  reply.setReplycrawler(msg);

  call.write(reply);

  if (isend) {
    call.end();
  }
}

/**
 * requestCrawler
 * @param {object} client - client
 * @param {string} token - token
 * @param {number} crawlerType - crawler type
 * @param {object} msg - message
 * @param {function} cb - func(err, msg)
 */
function requestCrawler(client, token, crawlerType, msg, cb) {
  // console.log('requestCrawler ' + token + ' ' + crawlerType);

  const req = new messages.RequestCrawler();

  req.setToken(token);
  req.setCrawlertype(crawlerType);

  if (crawlerType == messages.CrawlerType.CT_TRANSLATE2) {
    req.setTranslate2(msg);
  }

  let isend = false;

  const call = client.requestCrawler(req);
  call.on('data', (res) => {
    if (isend) {
      return;
    }

    const err = res.getError();
    if (err != '') {
      cb(err);

      isend = true;

      return;
    }

    if (res.hasReplycrawler()) {
      const reply = res.getReplycrawler();

      if (reply.getCrawlertype() != crawlerType) {
        cb('invalid crawlerType');

        isend = true;

        return;
      }

      if (crawlerType == messages.CrawlerType.CT_TRANSLATE2) {
        if (!reply.hasTranslateresult()) {
          cb('no translateresult');

          isend = true;

          return;
        }

        cb(undefined, reply.getTranslateresult());

        isend = true;

        return;
      }
    }
  });

  call.on('end', () => {
    if (!isend) {
      cb('not recv reply');

      isend = true;

      return;
    }
  });

  call.on('error', (err) => {
    cb(err);

    isend = true;

    return;
  });
}

/**
 * setReplyCrawler
 * @param {object} reply - reply
 * @param {number} crawlerType - CrawlerType
 * @param {object} val - value
 */
function setReplyCrawler(reply, crawlerType, val) {
  if (crawlerType == messages.CrawlerType.CT_TRANSLATE2) {
    reply.setTranslateresult(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_CB_COMPANY) {
    reply.setCbcompany(val);
    reply.setCrawlertype(crawlerType);
  }
}

exports.replyError = replyError;
exports.replyMsg = replyMsg;
exports.requestCrawler = requestCrawler;
exports.setReplyCrawler = setReplyCrawler;
