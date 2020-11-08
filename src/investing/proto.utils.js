const messages = require('../../pbjs/result_pb');

/**
 * new InvestingHistoricalData with object
 * @param {object} obj - InvestingHistoricalData
 * @return {messages.InvestingHistoricalData} result - InvestingHistoricalData
 */
function newInvestingHistoricalData(obj) {
  const result = new messages.InvestingHistoricalData();

  if (obj.ts) {
    result.setTs(obj.ts);
  }

  if (obj.open) {
    result.setOpen(obj.open);
  }

  if (obj.close) {
    result.setClose(obj.close);
  }

  if (obj.high) {
    result.setHigh(obj.high);
  }

  if (obj.low) {
    result.setLow(obj.low);
  }

  if (obj.volume) {
    result.setVolume(obj.volume);
  }

  return result;
}

/**
 * new InvestingAsset with object
 * @param {object} obj - InvestingAsset
 * @return {messages.InvestingAsset} result - InvestingAsset
 */
function newInvestingAsset(obj) {
  const result = new messages.InvestingAsset();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (Array.isArray(obj.data) && obj.data.length > 0) {
    for (let i = 0; i < obj.data.length; ++i) {
      result.addData(newInvestingHistoricalData(obj.data[i]), i);
    }
  }

  return result;
}

/**
 * new InvestingAssets with object
 * @param {object} obj - InvestingAssets
 * @return {messages.InvestingAssets} result - InvestingAssets
 */
function newInvestingAssets(obj) {
  const result = new messages.InvestingAssets();

  if (Array.isArray(obj.assets) && obj.assets.length > 0) {
    for (let i = 0; i < obj.assets.length; ++i) {
      result.addAssets(newInvestingAsset(obj.assets[i]), i);
    }
  }

  return result;
}

/**
 * new ReplyInvesting with object
 * @param {number} mode - messages.P6vdyMode
 * @param {object} obj - ReplyInvesting
 * @return {messages.ReplyInvesting} result - ReplyInvesting
 */
function newReplyInvesting(mode, obj) {
  const result = new messages.ReplyInvesting();

  result.setMode(mode);

  if (mode == messages.InvestingMode.INVESTINGMODE_ASSETS) {
    result.setAssets(newInvestingAssets(obj));
  } else if (mode == messages.InvestingMode.INVESTINGMODE_HD) {
    result.setAsset(newInvestingAsset(obj));
  }

  return result;
}

/**
 * new RequestInvesting for newpage
 * @param {string} url - url
 * @return {messages.RequestInvesting} result - RequestInvesting
 */
function newRequestInvestingAssets(url) {
  const result = new messages.RequestInvesting();

  result.setMode(messages.InvestingMode.INVESTINGMODE_ASSETS);
  result.setUrl(url);

  return result;
}

/**
 * new RequestInvesting for newpage
 * @param {string} url - url
 * @param {string} startData - start data
 * @param {string} endData - end data
 * @return {messages.RequestInvesting} result - RequestInvesting
 */
function newRequestInvestingHD(url, startData, endData) {
  const result = new messages.RequestInvesting();

  result.setMode(messages.InvestingMode.INVESTINGMODE_HD);
  result.setUrl(url);
  result.setStartdata(startData);
  result.setEnddata(endData);

  return result;
}

exports.newReplyInvesting = newReplyInvesting;

exports.newRequestInvestingAssets = newRequestInvestingAssets;
exports.newRequestInvestingHD = newRequestInvestingHD;
