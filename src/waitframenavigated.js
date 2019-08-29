const {sleep} = require('./utils');

/**
 * WaitFrameNavigated class
 */
class WaitFrameNavigated {
  /**
   * constructor
   * @param {object} page - page
   * @param {object} frame - frame, it's like page.mainFrame()
   * @param {function} isNavigated - async function isNavigated(frame) bool
   */
  constructor(page, frame, isNavigated) {
    this.page = page;
    this.frame = frame;
    this.isDone = false;
    this.isNavigated = isNavigated;

    this.onframenavigated = async (f) => {
      if (this.isDone) {
        return;
      }

      if (this.frame == f) {
        const isdone = await this.isNavigated(f);
        if (isdone) {
          this.isDone = true;
        }
      }
    };

    this.page.on('framenavigated', this.onframenavigated);
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
    }
  }

  /**
   * reset
   * @param {object} frame - frame, it's like page.mainFrame()
   * @param {function} isNavigated - async function isNavigated(frame) bool
   */
  reset(frame, isNavigated) {
    this.frame = frame;
    this.isDone = false;
    this.isNavigated = isNavigated;
  }

  /**
   * release
   */
  release() {
    this.page.removeListener('framenavigated', this.onframenavigated);
  }
}

exports.WaitFrameNavigated = WaitFrameNavigated;
