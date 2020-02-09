/**
 * getSubobjectID with url
 * @param {string} url - url
 * @return {string} id - id
 */
function getSubobjectID(url) {
  const arr = url.split('/');
  if (arr.length > 2) {
    return arr[arr.length - 2];
  }

  return undefined;
}

exports.getSubobjectID = getSubobjectID;
