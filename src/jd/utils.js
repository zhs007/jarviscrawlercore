/**
 * parsePercent - percent string to percent
 * @param {string} percent - percent is like 97.5%
 * @return {object} ret - {err, percent}
 */
function parsePercent(percent) {
  try {
    const lst = percent.split('%');
    return {percent: parseFloat(lst[0])};
  } catch (err) {
    return {err: err};
  }
}

exports.parsePercent = parsePercent;
