const Jimp = require('jimp');
const sharp = require('sharp');

/**
 * jimpGetImageInfo - get image infomation
 * @param {buffer} buf - output file
 * @return {object} obj - {w, h}
 */
async function jimpGetImageInfo(buf) {
  try {
    const img = await Jimp.read(buf);
    if (img) {
      return {w: img.bitmap.width, h: img.bitmap.height};
    }
  } catch (err) {
  }

  return undefined;
}

/**
 * sharpGetImageInfo - get image infomation
 * @param {buffer} buf - output file
 * @return {object} obj - {w, h}
 */
async function sharpGetImageInfo(buf) {
  try {
    const img = await sharp(buf);
    if (img) {
      const metadata = await img.metadata();
      return {w: metadata.width, h: metadata.height};
    }
  } catch (err) {
  }

  return undefined;
}

/**
 * getImageInfo - get image infomation
 * @param {buffer} buf - output file
 * @return {object} obj - {w, h}
 */
async function getImageInfo(buf) {
  return sharpGetImageInfo(buf);
}

exports.getImageInfo = getImageInfo;
