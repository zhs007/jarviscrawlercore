const {sleep} = require('./utils');

/**
 * WaitDomContentLoaded class
 */
class WaitDomContentLoaded {
  /**
   * constructor
   * @param {object} page - page
   */
  constructor(page) {
    this.page = page;
    this.isDone = false;

    page.on('domcontentloaded', () => {
      log.debug('domcontentloaded');

      this.isDone = true;
    });
  }

  /**
   * clear
   */
  clear() {
    this.isDone = false;
  }

  /**
   * wait
   * @param {function} funcStart - async function funcStart()
   * @param {number} timeOut - timeOut ms
   * @return {bool} isDone - if isDone == false, then timeOut
   */
  async wait(funcStart, timeOut) {
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

exports.WaitDomContentLoaded = WaitDomContentLoaded;
