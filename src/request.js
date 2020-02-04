const request = require('request');
const {sleep} = require('./utils');
const log = require('./log');

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
    request
        .get(url, {timeout: timeout}, (error, response, body) => {
          if (!buf) {
            resolve({error: error});

            return;
          }

          if (response.statusCode != 200) {
            resolve({
              error: new Error(response.statusCode),
            });

            return;
          }

          err = error;
        })
        .on('data', (data) => {
          if (buf) {
            buf = Buffer.concat([buf, data]);
          } else {
            buf = data;
          }
        })
        .on('end', () => {
          if (err) {
            resolve({error: err});

            return;
          }

          resolve({buf: buf});
        })
        .on('error', (err1) => {
          resolve({error: err1});

          return;
        });
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
