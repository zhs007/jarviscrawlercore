const {sleep} = require('./utils');

/**
 * WaitAllResponse class
 */
class WaitAllResponse {
  /**
   * constructor
   * @param {object} page - page
   */
  constructor(page) {
    this.page = page;
    this.isDone = false;
    this.lstReq = [];

    this.onrequest = async (req) => {
      if (this.isDone) {
        return;
      }

      // const rt = req.resourceType();
      // if (rt == 'image' || rt == 'media' || rt == 'font') {
      //   await req.abort();

      //   return;
      // }

      const url = this.getURL(req.url());

      const oldreq = this.findReq(url);
      if (oldreq) {
        return;
      }

      this.lstReq.push({
        url: url,
        status: 0,
      });
    };

    this.onrequestfailed = async (req) => {
      if (this.isDone) {
        return;
      }

      const url = this.getURL(req.url());

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

      const url = this.getURL(res.url());

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

        await res.buffer();
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
   * @param {object} frame - frame, it's like page.mainFrame()
   * @param {function} isNavigated - async function isNavigated(frame) bool
   */
  reset() {
    this.lstReq = [];
    this.isDone = false;
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
   * getURL - get url
   * @param {string} url - url
   * @return {string} url - url
   */
  getURL(url) {
    try {
      const cu = new URL(url);
      if (cu) {
        if (cu.protocol != 'http' && cu.protocol != 'https') {
          return '';
        }

        const arr = url.split('?');
        return arr[0];
      }
    } catch (err) {
      return '';
    }

    return '';
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

exports.WaitAllResponse = WaitAllResponse;
