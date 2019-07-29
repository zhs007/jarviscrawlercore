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

/**
 * isArrayNumberNM
 * @param {array} arr - url
 * @param {number} n - arr[n][m]
 * @param {number} m - arr[n][m]
 * @return {bool} isArrayNumberNM - arr === arr[n][m] && typeof arr[n][m] === 'number'
 */
function isArrayNumberNM(arr, n, m) {
  if (!Array.isArray(arr)) {
    return false;
  }

  if (arr.length != n) {
    return false;
  }

  for (let i = 0; i < n; ++i) {
    if (!Array.isArray(arr[i])) {
      return false;
    }

    if (arr[i].length != m) {
      return false;
    }

    for (let j = 0; j < m; ++j) {
      if (typeof arr[i][j] !== 'number') {
        return false;
      }
    }
  }

  return true;
}

/**
 * getGameID
 * @param {string} dtgameid - dtgameid
 * @return {string} id - id
 */
function getGameID(dtgameid) {
  const arr = dtgameid.split('#');
  if (arr.length == 2) {
    return arr[1];
  }

  return dtgameid;
}

/**
 * isMyRespin
 * @param {object} dtbaseid - dtbaseid
 * @param {string} baseid - baseid
 * @return {bool} ismine - is mine respin
 */
function isMyRespin(dtbaseid, baseid) {
  if (dtbaseid.respin) {
    const respinid = getGameID(dtbaseid.respin);
    if (respinid == baseid) {
      return true;
    }
  }

  return false;
}

/**
 * isMyJP
 * @param {object} dtbaseid - dtbaseid
 * @param {string} baseid - baseid
 * @return {bool} ismine - is mine respin
 */
function isMyJP(dtbaseid, baseid) {
  if (dtbaseid.respin) {
    const respinid = getGameID(dtbaseid.jp);
    if (respinid == baseid) {
      return true;
    }
  }

  return false;
}

/**
 * formatDTNumber
 * @param {string} strnums - string number
 * @return {number} number - int
 */
function formatDTNumber(strnums) {
  return Math.round(parseFloat(strnums) * 100);
}

exports.WaitRightFrame = WaitRightFrame;
exports.isArrayNumberNM = isArrayNumberNM;
exports.getGameID = getGameID;
exports.isMyRespin = isMyRespin;
exports.isMyJP = isMyJP;
exports.formatDTNumber = formatDTNumber;
