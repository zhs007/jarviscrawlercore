/**
 * procSummary - proc summary
 * @param {string} text - text
 * @return {string} summary - summary
 */
function procSummary(text) {
  const arr = text.split('阅读全文');
  return arr[0];
}

exports.procSummary = procSummary;
