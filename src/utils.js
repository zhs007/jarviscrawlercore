
const fs = require('fs');
const {jarviscrawlercore} = require('../proto/result');
const AdmZip = require('adm-zip');
const crypto = require('crypto');
// const images = require('images');

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

/**
 * set ImageInfo with img
 * @param {ImageInfo} imginfo - imginfo
 * @param {object} img - img object
* @return {ImageInfo} imginfo - imginfo
 */
function setImageInfo(imginfo, img) {
  imginfo.data = Buffer.from(img.base64data, 'base64');

  imginfo.hashName = hashMD5(imginfo.data);

  //   try {
  //     const curimg = images(imginfo.data);
  //     if ( curimg) {
  //       imginfo.width = curimg.width();
  //       imginfo.height = curimg.height();
  //     }
  //   } catch (err) {
  //     console.log('setImageInfo error! ', imginfo.url, err);
  //   }

  return imginfo;
}

exports.saveMessage = saveMessage;
exports.saveZipMessage = saveZipMessage;
exports.hashMD5 = hashMD5;
exports.setImageInfo = setImageInfo;
