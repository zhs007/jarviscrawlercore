
const fs = require('fs');
const {jarviscrawlercore} = require('../proto/result');
const AdmZip = require('adm-zip');

/**
 * save protobuf message
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveMessage(filename, msg) {
  fs.writeFileSync(filename,
      jarviscrawlercore.ExportArticleResult.encode(msg).finish());
}


/**
 * save protobuf message with zip
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveZipMessage(filename, msg) {
  const zip = new AdmZip();
  zip.addFile('msg.pb',
      jarviscrawlercore.ExportArticleResult.encode(msg).finish());
  zip.writeZip(filename);
}

exports.saveMessage = saveMessage;
exports.saveZipMessage = saveZipMessage;
