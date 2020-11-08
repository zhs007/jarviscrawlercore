const {investingAssets} = require('./assets');
const {investingHD} = require('./historicaldata');
const {
  newReplyInvesting,
  newRequestInvestingAssets,
  newRequestInvestingHD,
} = require('./proto.utils');

exports.investingHD = investingHD;
exports.investingAssets = investingAssets;

exports.newReplyInvesting = newReplyInvesting;
exports.newRequestInvestingAssets = newRequestInvestingAssets;
exports.newRequestInvestingHD = newRequestInvestingHD;
