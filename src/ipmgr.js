const dns = require('dns');

/**
 * getHostName - get hostname
 * @param {string} url - url
 * @return {string} hostname - hostname
 */
function getHostName(url) {
  if (url.indexOf('data:') == 0) {
    return '';
  }

  try {
    const urlinfo = new URL(url);
    return urlinfo.hostname;
  } catch (err) {
    console.log('getHostName ' + url + ' ' + err);
  }

  return '';
}

/**
 * IPMgr
 */
class IPMgr {
  /**
   * IPAddress manager
   * @constructor
   */
  constructor() {
    this.maphostname = {};
  }

  /**
   * getIP -
   * @param {string} url - url
   * @return {Promise<string>} ip - ip address
   */
  getIP(url) {
    return new Promise((resolve, reject) => {
      const curhostname = getHostName(url);
      if (curhostname != '') {
        if (this.maphostname[curhostname]) {
          resolve(this.maphostname[curhostname]);

          return;
        }

        try {
          dns.lookup(curhostname, {all: true}, (err, addresses) => {
            if (err) {
              console.log('getIP.dns.lookup ' + curhostname + ' ' + err);

              resolve('');

              return;
            }

            let ip = '';
            for (let i = 0; i < addresses.length; ++i) {
              if (addresses[i].family == 4) {
                ip += addresses[i].address;
                ip += ';';
              }
            }

            this.maphostname[curhostname] = ip;

            resolve(ip);
          });
        } catch (err) {
          console.log('getIP ' + err);

          resolve('');
        }

        return;
      }

      resolve('');
    });
  }
};

exports.IPMgr = IPMgr;
