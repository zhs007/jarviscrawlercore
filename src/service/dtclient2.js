const messages = require('../../proto/result_pb');
const services = require('../../proto/result_grpc_pb');
const {requestCrawler} = require('./utils');
const {printDTGPKCheckGameResult} = require('../utils');
const grpc = require('grpc');

const TOKEN = 'wzDkh9h2fhfUVuS9jZ8uVbhV3vC5AWX3';

/**
 * startGetDTData
 * @param {string} servAddr - service addr
 * @param {string} envName - envName
 * @param {DTDataType} dtDataType - dtDataType
 * @param {DTDataType} businessid - businessid
 * @param {DTDataType} gamecode - gamecode
 * @param {DTDataType} playername - playername
 * @param {string} startTime - startTime
 * @param {string} endTime - endTime
 */
function startGetDTData(
    servAddr,
    envName,
    dtDataType,
    businessid,
    gamecode,
    playername,
    startTime,
    endTime
) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure()
  );

  const request = new messages.RequestDTData();

  request.setEnvname(envName);
  request.setDtdatatype(dtDataType);
  request.setBusinessid(businessid);
  request.setGamecode(gamecode);
  request.setPlayername(playername);
  request.setStarttime(startTime);
  request.setEndtime(endTime);
  request.setToken(TOKEN);

  requestCrawler(
      client,
      TOKEN,
      messages.CrawlerType.CT_DTDATA,
      request,
      (err, reply) => {
        if (err) {
          console.log('err:', err);
        }

        if (reply) {
          console.log('dtdata:', JSON.stringify(reply.toObject(false)));

          if (reply.hasCheckgameresultgpk()) {
            printDTGPKCheckGameResult(reply.getCheckgameresultgpk());
          }
        }
      }
  );
}

// startGetDTData(
//     '127.0.0.1:7051',
//     'dttest1',
//     messages.DTDataType.DT_DT_BUSINESSGAMEREPORT,
//     '',
//     '',
//     '',
//     '2019-04-17',
//     '2019-04-17'
// );

startGetDTData(
    '127.0.0.1:7051',
    'dttest1',
    messages.DTDataType.DT_DT_GPKCHECKGAMERESULT,
    'NNTI_TEST_TEST1',
    'shokudo',
    '',
    '2019-08-01 00:00:00',
    '2019-08-03 00:00:00'
);
