// const request = require('request');
const axios = require('axios');
const {sleep} = require('./utils');
const log = require('./log');

/**
 * download - download a file
 * @param {string} url - url
 * @param {number} timeout - timeout in second
 * @return {Promise<object>} ret - {error, buf}
 */
function download(url, timeout) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url, {
        timeout: timeout,
        responseType: 'arraybuffer',
      });

      resolve({buf: response.data});
    } catch (err) {
      resolve({error: err});
    }
    // request
    //   .get(url, { timeout: timeout }, (error, response, body) => {
    //     if (!buf) {
    //       resolve({ error: error });

    //       return;
    //     }

    //     if (response && response.statusCode != 200) {
    //       resolve({
    //         error: new Error(response.statusCode),
    //       });

    //       return;
    //     }

    //     err = error;
    //   })
    //   .on('data', (data) => {
    //     if (buf) {
    //       buf = Buffer.concat([buf, data]);
    //     } else {
    //       buf = data;
    //     }
    //   })
    //   .on('end', () => {
    //     if (err) {
    //       resolve({ error: err });

    //       return;
    //     }

    //     resolve({ buf: buf });
    //   })
    //   .on('error', (err1) => {
    //     resolve({ error: err1 });

    //     return;
    //   });
  });
}

/**
 * DownloadList class
 */
class DownloadList {
  /**
   * constructor
   */
  constructor() {
    this.lst = [];
    this.timeout = 60 * 1000;
  }

  /**
   * addTask
   * @param {string} url - url
   * @param {function} onfunc - func(buf, param)
   * @param {object} param - param
   */
  addTask(url, onfunc, param) {
    this.lst.push({url: url, onfunc: onfunc, param: param});
  }

  /**
   * runImp
   */
  async runImp() {
    while (true) {
      if (this.lst.length > 0) {
        try {
          const curtask = this.lst[0];
          const ret = await download(curtask.url, this.timeout);
          if (ret.error) {
            if (ret.error.response) {
              if (ret.error.response.status == 404) {
                log.error('DownloadList.download ' + curtask.url, ret.error);

                continue;
              }
            }

            log.error('DownloadList.download ' + curtask.url, ret.error);

            this.lst.push(curtask);
            this.lst.splice(0, 1);

            await sleep(5 * 1000);

            continue;
          }

          curtask.onfunc(ret.buf, curtask.param);

          this.lst.splice(0, 1);
        } catch (err) {
          log.error('DownloadList error ', err);
        }
      } else {
        await sleep(1000);
      }
    }
  }

  /**
   * run
   * @return {Promise<undefined>} ret - return
   */
  run() {
    return new Promise((resolve, reject) => {
      this.runImp().then(() => {
        log.error('DownloadList done!!!');

        resolve();
      });
    });
  }

  /**
   * isFinished
   * @return {boolean} isFinished - isFinished
   */
  isFinished() {
    return this.lst.length == 0;
  }
}

exports.download = download;
exports.DownloadList = DownloadList;
