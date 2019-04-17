const messages = require('../../proto/result_pb');
const {exportArticle} = require('../exportarticle/exportarticle');
const {hashMD5} = require('../utils');

const MAX_BUFF_LEN = 4 * 1024 * 1024;
const MAX_BLOCK_LEN = 4 * 1024 * 1024 - 1024 * 10;

/**
 * callExportArticle
 * @param {object} browser - browser
 * @param {object} call - call
 */
function callExportArticle(browser, call) {
  exportArticle(browser, call.request.getUrl(), '', 'pb', '', 60,
      call.request.getAttachjquery(), false).then(({result, err})=>{
    if (err) {
      console.log('callExportArticle', err);
      call.end();

      return;
    }

    const reply = new messages.ReplyArticle();

    reply.setResult(result);

    const buf = reply.serializeBinary();
    if (buf.byteLength <= MAX_BUFF_LEN) {
      call.write(reply);
    } else {
      const buf1 = result.serializeBinary();
      for (let s = 0; s < buf1.byteLength; s += MAX_BLOCK_LEN) {
        const cr = new messages.ReplyArticle();
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

    call.end();
  }).catch((err) => {
    console.log('callExportArticle', err);
    call.end();
  });
}

exports.callExportArticle = callExportArticle;
