const messages = require('../../pbjs/result_pb');
const services = require('../../pbjs/result_grpc_pb');
const log = require('../log');

const grpc = require('grpc');

const TOKEN = 'wzDkh9h2fhfUVuS9jZ8uVbhV3vC5AWX3';

/**
 * startGetDTData
 * @param {string} servAddr - service addr
 * @param {string} envName - envName
 * @param {DTDataType} dtDataType - dtDataType
 * @param {string} startTime - startTime
 * @param {string} endTime - endTime
 */
function startGetDTData(servAddr, envName, dtDataType, startTime, endTime) {
  const client = new services.JarvisCrawlerServiceClient(
      servAddr,
      grpc.credentials.createInsecure(),
  );

  const request = new messages.RequestDTData();

  request.setEnvname(envName);
  request.setDtdatatype(dtDataType);
  request.setStarttime(startTime);
  request.setEndtime(endTime);
  request.setToken(TOKEN);

  client.getDTData(request, function(err, response) {
    if (err) {
      log.error('err:', err);
    }

    if (response) {
      log.debug('result:', JSON.stringify(response.toObject()));
    }
  });
}

// startGetDTData('127.0.0.1:7051', 'gametodaydata', '', '');
startGetDTData(
    '127.0.0.1:7051',
    'dtserv2',
    messages.DTDataType.DT_DT_BUSINESSGAMEREPORT,
    '2019-04-17',
    '2019-04-17',
);
