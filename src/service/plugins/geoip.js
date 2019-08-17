const messages = require('../../../proto/result_pb');
const {ipvoidgeoip} = require('../../geoip/ipvoid');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyGeoIP} = require('../../utils');

/**
 * callGeoIP - geoip
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestGeoIP
 */
function callGeoIP(browser, cfg, call, param) {
  ipvoidgeoip(browser, param.getIp())
      .then((ret) => {
        if (ret.error) {
          replyError(call, ret.error, true);

          return;
        }

        // console.log(ret);

        const reply = new messages.ReplyCrawler();

        const val = newReplyGeoIP(ret);

        setReplyCrawler(reply, messages.CrawlerType.CT_GEOIP, val);

        replyMsg(call, reply, true);
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callGeoIP = callGeoIP;
