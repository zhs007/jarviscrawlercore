const request = require('request');

/**
 * download - download a file
 * @param {string} url - url
 * @param {number} timeout - timeout in second
 * @return {Promise<object>} ret - {error, buf}
 */
function download(url, timeout) {
  return new Promise((resolve, reject) => {
    let buf = undefined;
    let err = undefined;
    request(url, (error, response, body) => {
      if (!buf) {
        resolve({error: error});

        return;
      }

      err = error;
    }).on('data', (data) =>{
      if (buf) {
        buf = Buffer.concat([buf, data]);
      } else {
        buf = data;
      }
    }).on('end', () => {
      if (err) {
        resolve({error: err});

        return;
      }

      resolve({buf: buf});
    });
  });
}

exports.download = download;
