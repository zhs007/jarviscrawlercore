
const fs = require('fs');
const {jarviscrawlercore} = require('../proto/result');
const AdmZip = require('adm-zip');
const crypto = require('crypto');

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

/**
 * hash md5
 * @param {buffer} buf - buffer
 * @return {string} md5 - md5 string
 */
function hashMD5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}

exports.saveMessage = saveMessage;
exports.saveZipMessage = saveZipMessage;
exports.hashMD5 = hashMD5;
