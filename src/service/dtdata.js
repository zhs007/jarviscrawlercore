const messages = require('../../proto/result_pb');
const {
  dtbkbot,
  MODE_GAMETODAYDATA,
  MODE_GAMEDATAREPORT,
} = require('../dtbkbot/dtbkbot');
const {newDTBusinessGameReport} = require('../utils');

/**
 * get dt data
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {object} call - call
 * @param {function} callback - callback(err, ReplyTranslate)
 */
function callGetDTData(browser, cfgfile, call, callback) {
  dtbkbot(
      browser,
      cfgfile,
      false,
      call.request.getMode(),
      call.request.getStarttime(),
      call.request.getEndtime()
  )
      .then((ret) => {
        const reply = new messages.ReplyDTData();

        if (call.request.getMode() == MODE_GAMETODAYDATA) {
          reply.setTodaygamedata(ret);
        } else if (call.request.getMode() == MODE_GAMEDATAREPORT) {
          for (let i = 0; i < ret.length; ++i) {
            reply.addGamereports(newDTBusinessGameReport(ret[i]));
          }
        }

        callback(null, reply);
      })
      .catch((err) => {
        callback(err, null);
      });
}

exports.callGetDTData = callGetDTData;
