const {dtbkbot} = require('./dtbkbot');
const messages = require('../../proto/result_pb');
const {newDTBusinessGameReport} = require('../utils');

/**
 * getDTData
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {string} envName - envName
 * @param {DTDataType} dtDataType - dtDataType
 * @param {string} businessid - businessid
 * @param {string} gamecode - gamecode
 * @param {string} playername - playername
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 * @return {object} result - {error: string, dtdata: ReplyDTData}
 */
async function getDTData(
    browser,
    cfgfile,
    envName,
    dtDataType,
    businessid,
    gamecode,
    playername,
    starttime,
    endtime
) {
  let errstr;
  const ret = await dtbkbot(
      browser,
      cfgfile,
      true,
      envName,
      dtDataType,
      businessid,
      gamecode,
      playername,
      starttime,
      endtime
  ).catch((err) => {
    errstr = err.toString();
  });

  if (errstr) {
    return {error: errstr};
  }

  if (ret == undefined) {
    return {error: 'no result'};
  }

  if (ret.error) {
    return {error: ret.error};
  }

  if (!ret.ret) {
    return {error: 'no result'};
  }

  const reply = new messages.ReplyDTData();

  if (dtDataType == messages.DTDataType.DT_DT_TODAYGAMEDATA) {
    reply.setTodaygamedata(ret.ret);
  } else if (dtDataType == messages.DTDataType.DT_DT_BUSINESSGAMEREPORT) {
    for (let i = 0; i < ret.ret.length; ++i) {
      reply.addGamereports(newDTBusinessGameReport(ret.ret[i]));
    }
  }

  return {dtdata: reply};
}

exports.getDTData = getDTData;
