const messages = require('../../pbjs/result_pb');
const {dtbkbot} = require('../dtbkbot/dtbkbot');
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
      call.request.getEnvname(),
      call.request.getDtdatatype(),
      call.request.getBusinessid(),
      call.request.getGamecode(),
      call.request.getPlayername(),
      call.request.getStarttime(),
      call.request.getEndtime(),
  )
      .then((ret) => {
        if (ret == undefined || !ret.ret) {
          callback('no result', null);

          return;
        }

        if (ret.error) {
          callback(ret.error, null);

          return;
        }

        const reply = new messages.ReplyDTData();

        if (
          call.request.getDtdatatype() == messages.DTDataType.DT_DT_TODAYGAMEDATA
        ) {
          reply.setTodaygamedata(ret.ret);
        } else if (
          call.request.getDtdatatype() ==
        messages.DTDataType.DT_DT_BUSINESSGAMEREPORT
        ) {
          for (let i = 0; i < ret.ret.length; ++i) {
            reply.addGamereports(newDTBusinessGameReport(ret.ret[i]));
          }
        } else if (
          call.request.getDtdatatype() ==
        messages.DTDataType.DT_DT_GPKCHECKGAMERESULT
        ) {
          reply.setCheckgameresultgpk(ret.ret);
        }

        callback(null, reply);
      })
      .catch((err) => {
        callback(err, null);
      });
}

exports.callGetDTData = callGetDTData;
