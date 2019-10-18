const {sleep} = require('./utils');
const log = require('./log');

/**
 * DownloadRequest class
 */
class DownloadRequest {
  /**
   * constructor
   * @param {object} page - page
   * @param {array} urls - url list
   */
  constructor(page, urls) {
    this.page = page;
    this.isDone = false;
    this.lstReq = [];
    this.urls = urls;

    this.onrequest = async (req) => {
      if (this.isDone) {
        return;
      }

      const url = req.url();
      if (this.urls.indexOf(url) >= 0) {
        const oldreq = this.findReq(url);
        if (oldreq) {
          return;
        }

        this.lstReq.push({
          url: url,
          status: 0,
        });
      }
    };

    this.onrequestfailed = async (req) => {
      if (this.isDone) {
        return;
      }

      const url = req.url();

      const curreq = this.findReq(url);
      if (curreq) {
        if (curreq.status == 0) {
          curreq.status = -1;
        }
      }
    };

    this.onresponse = async (res) => {
      if (this.isDone) {
        return;
      }

      const url = res.url();

      const req = this.findReq(url);
      if (req) {
        const headers = res.headers();

        if (
          headers['content-type'] &&
          headers['content-type'].indexOf('video') == 0
        ) {
          req.status = res.status();

          return;
        }

        if (!res.ok()) {
          req.status = res.status();

          return;
        }

        req.buf = await res.buffer().catch((err) => {
          log.error('DownloadRequest.buffer ' + err);
        });
        req.status = res.status();
      }
    };

    page.on('request', this.onrequest);
    page.on('requestfailed', this.onrequestfailed);
    page.on('response', this.onresponse);
  }

  /**
   * waitDone
   * @param {number} timeOut - timeOut ms
   * @return {bool} isDone - if isDone == false, then timeOut
   */
  async waitDone(timeOut) {
    if (this.isDone) {
      return true;
    }

    let curms = 0;
    while (true) {
      await sleep(1000);
      curms += 1000;

      if (curms > timeOut) {
        return false;
      }

      if (this.isDone) {
        return true;
      }

      if (this.isFinished()) {
        this.isDone = true;
      }
    }
  }

  /**
   * reset
   */
  reset() {
    this.lstReq = [];
    this.isDone = false;
  }

  /**
   * hasNewRequest
   * @return {bool} hasNew - has new request
   */
  hasNewRequest() {
    return this.lstReq.length > 0;
  }

  /**
   * release
   */
  release() {
    this.page.removeListener('request', this.onrequest);
    this.page.removeListener('requestfailed', this.onrequestfailed);
    this.page.removeListener('response', this.onresponse);
  }

  /**
   * findReq - find a request
   * @param {string} url - url
   * @return {object} req - request
   */
  findReq(url) {
    for (let i = 0; i < this.lstReq.length; ++i) {
      if (this.lstReq[i].url == url) {
        return this.lstReq[i];
      }
    }

    return undefined;
  }

  /**
   * isFinished - is request finished?
   * @return {bool} isfinished - is finished
   */
  isFinished() {
    for (let i = 0; i < this.lstReq.length; ++i) {
      if (this.lstReq[i].status == 0) {
        return false;
      }
    }

    return true;
  }
}

exports.DownloadRequest = DownloadRequest;
