const {dtbkbot} = require('./dtbkbot');
const messages = require('../../proto/result_pb');

/**
 * getDTData
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {DTDataType} dtDataType - dtDataType
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 * @return {object} result - {error: string, dtdata: ReplyDTData}
 */
async function getDTData(browser, cfgfile, dtDataType, starttime, endtime) {
  let errstr;
  const ret = await dtbkbot(
      browser,
      cfgfile,
      false,
      dtDataType,
      starttime,
      endtime
  ).catch((err) => {
    errstr = err.toString();
  });

  const reply = new messages.ReplyDTData();

  if (dtDataType == messages.DTDataType.DT_DT_TODAYGAMEDATA) {
    reply.setTodaygamedata(ret);
  } else if (dtDataType == messages.DTDataType.DT_DT_BUSINESSGAMEREPORT) {
    for (let i = 0; i < ret.length; ++i) {
      reply.addGamereports(newDTBusinessGameReport(ret[i]));
    }
  }

  if (errstr) {
    return {error: errstr};
  }

  return {dtdata: reply};
}

exports.getDTData = getDTData;
