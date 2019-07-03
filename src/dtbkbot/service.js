const {dtbkbot} = require('./dtbkbot');
const messages = require('../../proto/result_pb');

/**
 * getDTData
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {DTDataType} dtDataType - dtDataType
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 * @return {object} result - {error: string, text: text}
 */
async function getDTData(browser, cfgfile, dtDataType, starttime, endtime) {
  dtbkbot(browser, cfgfile, false, dtDataType, starttime, endtime)
      .then((ret) => {
        const reply = new messages.ReplyDTData();

        if (
          call.request.getDtdatatype() == messages.DTDataType.DT_DT_TODAYGAMEDATA
        ) {
          reply.setTodaygamedata(ret);
        } else if (
          call.request.getDtdatatype() ==
        messages.DTDataType.DT_DT_BUSINESSGAMEREPORT
        ) {
          for (let i = 0; i < ret.length; ++i) {
            reply.addGamereports(newDTBusinessGameReport(ret[i]));
          }
        }

        callback(null, reply);
      })
      .catch((err) => {
        callback(err, null);
      });

  const text = await googletranslate(browser, srctext, srclang, destlang).catch(
      (err) => {
        errstr = err.toString();
      }
  );

  if (errstr) {
    return {error: errstr};
  }

  return {text: text};
}

exports.getDTData = getDTData;
