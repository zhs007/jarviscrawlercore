const messages = require('../../pbjs/result_pb');
const log = require('../log');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('./package.json'));
const VERSION = package.version;

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

  reply.setVersion(VERSION);
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
  // msg.setVersion(VERSION);

  const reply = new messages.ReplyCrawlerStream();

  reply.setVersion(VERSION);
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
  } else if (crawlerType == messages.CrawlerType.CT_TMALL) {
    req.setTmall(msg);
  } else if (crawlerType == messages.CrawlerType.CT_TAOBAO) {
    req.setTaobao(msg);
  } else if (crawlerType == messages.CrawlerType.CT_MOUNTAINSTEALS) {
    req.setMountainsteals(msg);
  } else if (crawlerType == messages.CrawlerType.CT_DOUBAN) {
    req.setDouban(msg);
  } else if (crawlerType == messages.CrawlerType.CT_MANHUADB) {
    req.setManhuadb(msg);
  } else if (crawlerType == messages.CrawlerType.CT_OABT) {
    req.setOabt(msg);
  } else if (crawlerType == messages.CrawlerType.CT_HAO6V) {
    req.setHao6v(msg);
  } else if (crawlerType == messages.CrawlerType.CT_PUBLICTRANSIT) {
    req.setPublictransit(msg);
  } else if (crawlerType == messages.CrawlerType.CT_6VDY) {
    req.setP6vdy(msg);
  } else if (crawlerType == messages.CrawlerType.CT_INVESTING) {
    req.setInvesting(msg);
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
      } else if (crawlerType == messages.CrawlerType.CT_TMALL) {
        if (!reply.getTmall()) {
          cb('no tmall reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getTmall());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_TAOBAO) {
        if (!reply.getTaobao()) {
          cb('no taobao reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getTaobao());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_MOUNTAINSTEALS) {
        if (!reply.getMountainsteals()) {
          cb('no mountainsteals reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getMountainsteals());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_DOUBAN) {
        if (!reply.getDouban()) {
          cb('no douban reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getDouban());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_MANHUADB) {
        if (!reply.getManhuadb()) {
          cb('no manhuadb reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getManhuadb());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_OABT) {
        if (!reply.getOabt()) {
          cb('no oabt reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getOabt());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_HAO6V) {
        if (!reply.getHao6v()) {
          cb('no hao6v reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getHao6v());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_6VDY) {
        if (!reply.getP6vdy()) {
          cb('no 6vdy reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getP6vdy());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_INVESTING) {
        if (!reply.getInvesting()) {
          cb('no investing reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getInvesting());

        isend = true;

        return;
      } else if (crawlerType == messages.CrawlerType.CT_PUBLICTRANSIT) {
        if (!reply.getPublictransit()) {
          cb('no publictransit reply');

          isend = true;

          return;
        }

        cb(undefined, reply.getPublictransit());

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
  } else if (crawlerType == messages.CrawlerType.CT_TMALL) {
    reply.setTmall(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_TAOBAO) {
    reply.setTaobao(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_MOUNTAINSTEALS) {
    reply.setMountainsteals(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_DOUBAN) {
    reply.setDouban(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_MANHUADB) {
    reply.setManhuadb(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_OABT) {
    reply.setOabt(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_HAO6V) {
    reply.setHao6v(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_6VDY) {
    reply.setP6vdy(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_INVESTING) {
    reply.setInvesting(val);
    reply.setCrawlertype(crawlerType);
  } else if (crawlerType == messages.CrawlerType.CT_PUBLICTRANSIT) {
    reply.setPublictransit(val);
    reply.setCrawlertype(crawlerType);
  }
}

exports.replyError = replyError;
exports.replyMsg = replyMsg;
exports.requestCrawler = requestCrawler;
exports.setReplyCrawler = setReplyCrawler;
