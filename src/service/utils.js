const messages = require('../../proto/result_pb');
const log = require('../log');

const MAX_BUFF_LEN = 4 * 1024 * 1024;
const MAX_BLOCK_LEN = 4 * 1024 * 1024 - 1024 * 10;

/**
 * replyError
 * @param {object} call - call
 * @param {string} error - error
 * @param {bool} isend - is end
 */
function replyError(call, error, isend) {
  log.error(error);

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

  const buf = reply.serializeBinary();
  if (buf.byteLength < MAX_BUFF_LEN) {
    call.write(reply);
  } else {
    const buf1 = msg.serializeBinary();
    for (let s = 0; s < buf1.byteLength; s += MAX_BLOCK_LEN) {
      const cr = new messages.ReplyCrawlerStream();
      cr.setTotallength(buf1.byteLength);
      cr.setCurstart(s);

      const cl = MAX_BLOCK_LEN;
      if (s + MAX_BLOCK_LEN > buf1.byteLength) {
        cr.setCurlength(buf1.byteLength - s);

        cr.setTotalhashdata(hashMD5(buf1));
      }

      cr.setCurlength(cl);

      const curbuf = buf1.slice(s, cl);
      cr.setHashdata(hashMD5(curbuf));

      cr.setData(curbuf);

      call.write(cr);
    }
  }

  // call.write(reply);

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
  } else if (crawlerType == messages.CrawlerType.CT_CB_COMPANY) {
    req.setCbcompany(msg);
  } else if (crawlerType == messages.CrawlerType.CT_DTDATA) {
    req.setDtdata(msg);
  } else if (crawlerType == messages.CrawlerType.CT_ANALYZEPAGE) {
    req.setAnalyzepage(msg);
  } else if (crawlerType == messages.CrawlerType.CT_GEOIP) {
    req.setGeoip(msg);
  } else if (crawlerType == messages.CrawlerType.CT_TECHINASIA) {
    req.setTechinasia(msg);
  } else if (crawlerType == messages.CrawlerType.CT_STEEPANDCHEAP) {
    req.setSteepandcheap(msg);
  } else if (crawlerType == messages.CrawlerType.CT_JRJ) {
    req.setJrj(msg);
  } else if (crawlerType == messages.CrawlerType.CT_JD) {
    req.setJd(msg);
  } else if (crawlerType == messages.CrawlerType.CT_ALIMAMA) {
    req.setAlimama(msg);
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
      } else if (crawlerType == messages.CrawlerType.CT_CB_COMPANY) {
        if (!reply.getCbcompany()) {
          cb('no crunchbase company');

          isend = true;

          return;
        }

        cb(undefined, reply.getCbcompany());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_DTDATA) {
        if (!reply.getDtdata()) {
          cb('no dtdata reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getDtdata());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_ANALYZEPAGE) {
        if (!reply.getAnalyzepage()) {
          cb('no analyzepage reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getAnalyzepage());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_GEOIP) {
        if (!reply.getGeoip()) {
          cb('no geoip reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getGeoip());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_TECHINASIA) {
        if (!reply.getTechinasia()) {
          cb('no techinasia reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getTechinasia());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_STEEPANDCHEAP) {
        if (!reply.getSteepandcheap()) {
          cb('no steepandcheap reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getSteepandcheap());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_JRJ) {
        if (!reply.getJrj()) {
          cb('no jrj reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getJrj());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_JD) {
        if (!reply.getJd()) {
          cb('no jd reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getJd());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_ALIMAMA) {
        if (!reply.getAlimama()) {
          cb('no alimama reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getAlimama());

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
  } else if (crawlerType == messages.CrawlerType.CT_DTDATA) {
    reply.setDtdata(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_ANALYZEPAGE) {
    reply.setAnalyzepage(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_GEOIP) {
    reply.setGeoip(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_TECHINASIA) {
    reply.setTechinasia(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_STEEPANDCHEAP) {
    reply.setSteepandcheap(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_JRJ) {
    reply.setJrj(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_JD) {
    reply.setJd(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_ALIMAMA) {
    reply.setAlimama(val);
    reply.setCrawlertype(crawlerType);
  }
}

exports.replyError = replyError;
exports.replyMsg = replyMsg;
exports.requestCrawler = requestCrawler;
exports.setReplyCrawler = setReplyCrawler;
