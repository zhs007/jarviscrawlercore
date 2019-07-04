const {sleep} = require('../utils');

/**
 * WaitRightFrame class
 */
class WaitRightFrame {
  /**
   * constructor
   * @param {object} page - page
   */
  constructor(page) {
    this.page = page;
    this.url = '';
    this.isDone = false;

    page.on('response', async (response) => {
      await this.onResponse(response);
    });

    page.on('request', async (request) => {
      await this.onRequest(request);
    });
  }

  /**
   * onResponse
   * @param {object} res - response
   */
  async onResponse(res) {
    const url = res.url();

    // console.log('WaitRightFrame.wait4URL:onResponse ' + url);

    if (this.url.length > 0 && url.indexOf(this.url) >= 0 && res.ok()) {
      this.isDone = true;
    }
  }

  /**
   * onRequest
   * @param {object} req - request
   */
  async onRequest(req) {
    // const url = req.url();
    // console.log('WaitRightFrame.wait4URL:onRequest ' + url);
    // if (url.indexOf(this.url) >= 0) {
    // }
  }

  /**
   * wait4URL
   * @param {string} url - url
   * @param {function} funcStart - async function funcStart()
   * @param {number} timeOut - timeOut ms
   * @return {bool} isDone - if isDone == false, then timeOut
   */
  async wait4URL(url, funcStart, timeOut) {
    this.url = url;
    this.isDone = false;

    await funcStart();

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
    }
  }
}

exports.WaitRightFrame = WaitRightFrame;
