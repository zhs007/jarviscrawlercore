const Jimp = require('jimp');

/**
 * getImageInfo - get image infomation
 * @param {buffer} buf - output file
 * @return {object} obj - {w, h}
 */
async function getImageInfo(buf) {
  try {
    const img = await Jimp.read(buf);
    if (img) {
      return {w: img.bitmap.width, h: img.bitmap.height};
    }
  } catch (err) {
  }

  return undefined;
}

exports.getImageInfo = getImageInfo;
