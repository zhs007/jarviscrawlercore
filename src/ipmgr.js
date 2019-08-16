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
   * @return {string} ip - ip address
   */
  async getIP(url) {
    const curhostname = getHostName(url);
    if (curhostname != '') {
      if (this.maphostname[curhostname]) {
        return this.maphostname[curhostname];
      }

      const dnsret = await dns.promises.lookup(curhostname);
      if (dnsret) {
        let ip = '';
        for (let i = 0; i < dnsret.length; ++i) {
          if (dnsret[i].family == 4) {
            ip += dnsret[i].address;
            ip += ';';
          }
        }

        this.maphostname[curhostname] = ip;

        return ip;
      }
    }

    return '';
  }
};

exports.IPMgr = IPMgr;
