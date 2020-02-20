/**
 * parseID - parse id with url
 * @param {string} url - url
 * @return {string} id - id
 */
function parseID(url) {
  const arr = url.split('www.hao6v.com');
  if (arr.length == 2) {
    return arr[1];
  }

  return url;
}

exports.parseID = parseID;
