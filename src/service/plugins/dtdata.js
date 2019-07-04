const messages = require('../../../proto/result_pb');
const {getDTData} = require('../../dtbkbot/service');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');

/**
 * call getDTData
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestDTData
 */
function callGetDTData(browser, cfg, call, param) {
  if (!cfg.dtconfig) {
    replyError(call, 'no dtconfig', true);

    return;
  }

  getDTData(
      browser,
      cfg.dtconfig,
      param.getEnvname(),
      param.getDtdatatype(),
      param.getStarttime(),
      param.getEndtime()
  )
      .then((ret) => {
        if (ret.error) {
          replyError(call, ret.error, true);

          return;
        }

        // console.log(ret);

        const reply = new messages.ReplyCrawler();

        setReplyCrawler(reply, messages.CrawlerType.CT_DTDATA, ret.dtdata);

        replyMsg(call, reply, true);
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callGetDTData = callGetDTData;
