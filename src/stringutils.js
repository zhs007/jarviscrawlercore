/**
 * percentage2float
 * @param {string} str - islike 98%
 * @return {object} ret - {error, num}
 */
function percentage2float(str) {
  try {
    const arr = str.split('%');
    const f = parseFloat(arr[0]);
    return {num: f / 100};
  } catch (err) {
    return {error: err};
  }
}

/**
 * string2float
 * @param {string} str - islike 0.98
 * @return {object} ret - {error, num}
 */
function string2float(str) {
  try {
    const f = parseFloat(str);
    return {num: f};
  } catch (err) {
    return {error: err};
  }
}

/**
 * split2float
 * @param {string} str - islike 10元
 * @param {int} index - like 0
 * @param {string} key - like 元
 * @return {object} ret - {error, num}
 */
function split2float(str, index, key) {
  try {
    const arr = str.split(key);
    if (index < arr.length) {
      const f = parseFloat(arr[index]);
      return {num: f};
    }

    return {error: new Error('split2float invalid index')};
  } catch (err) {
    return {error: err};
  }
}

/**
 * string2int
 * @param {string} str - islike 98
 * @return {object} ret - {error, num}
 */
function string2int(str) {
  try {
    const f = parseInt(str);
    return {num: f};
  } catch (err) {
    return {error: err};
  }
}

exports.percentage2float = percentage2float;
exports.string2float = string2float;
exports.split2float = split2float;
exports.string2int = string2int;
