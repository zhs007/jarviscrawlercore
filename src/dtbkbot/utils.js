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
   */
  async wait4URL(url, funcStart) {
    this.url = url;
    this.isDone = false;

    await funcStart();

    while (true) {
      await sleep(1000);

      if (this.isDone) {
        return;
      }
    }
  }
}

// /**
//  * attachDTUtils
//  * @param {object} page - page
//  */
// async function attachDTUtils(page) {
//   // await page.waitForFunction(() => {
//   //   document.head !== null;
//   // });

//   await page.addScriptTag({path: './browser/dtutils.js'}).catch((err) => {
//     console.log('attachDTUtils:addScriptTag', err);
//     // isok = false;
//   });

//   await page
//       .waitForFunction('typeof rightframeisdone === "bool"')
//       .catch((err) => {
//         console.log('attachDTUtils:waitForFunction', err);
//       });

//   console.log('attachDTUtils');
// }

// /**
//  * waitFrameLoaded
//  * @param {object} page - page
//  */
// async function waitFrameLoaded(page) {
//   await page
//       .waitForFunction('typeof rightframeisdone === "bool"')
//       .catch((err) => {
//         console.log('waitFrameLoaded', err);
//       });
// }

exports.WaitRightFrame = WaitRightFrame;
// exports.attachDTUtils = attachDTUtils;
// exports.waitFrameLoaded = waitFrameLoaded;
