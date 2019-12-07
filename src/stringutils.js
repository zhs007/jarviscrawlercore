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

/**
 * getJSONStr
 * @param {string} str - a string
 * @param {int} starti - start index, space or {
 * @return {object} ret - json string
 */
function getJSONStr(str, starti) {
  let endi = starti;
  let hasjson = false;

  // 0-{}
  // 1-""
  // 2-''
  // 3-[]
  const arr = [];
  let cs = -1;

  while (endi < str.length) {
    if (cs == -1) {
      if (str.charAt(endi) == '{') {
        arr.push(0);
        cs = 0;
      } else if (str.charAt(endi) == '"') {
        arr.push(1);
        cs = 1;
      } else if (str.charAt(endi) == '\'') {
        arr.push(2);
        cs = 2;
      } else if (str.charAt(endi) == '[') {
        arr.push(3);
        cs = 3;
      }

      endi++;
    } else {
      if (cs == 1) {
        if (str.charAt(endi) == '"') {
          arr.pop();
          if (arr.length > 0) {
            cs = arr[arr.length - 1];
          }
        }

        endi++;
      } else if (cs == 2) {
        if (str.charAt(endi) == '\'') {
          arr.pop();
          if (arr.length > 0) {
            cs = arr[arr.length - 1];
          }
        }

        endi++;
      } else if (cs == 0) {
        if (str.charAt(endi) == '"') {
          arr.push(1);
          cs = 1;
        } else if (str.charAt(endi) == '\'') {
          arr.push(2);
          cs = 2;
        } else if (str.charAt(endi) == '{') {
          arr.push(0);
          cs = 0;
        } else if (str.charAt(endi) == '}') {
          arr.pop();
          if (arr.length > 0) {
            cs = arr[arr.length - 1];
          } else {
            hasjson = true;
            endi++;
            break;
          }
        }

        endi++;
      } else if (cs == 3) {
        if (str.charAt(endi) == '"') {
          arr.push(1);
          cs = 1;
        } else if (str.charAt(endi) == '\'') {
          arr.push(2);
          cs = 2;
        } else if (str.charAt(endi) == '[') {
          arr.push(3);
          cs = 3;
        } else if (str.charAt(endi) == ']') {
          arr.pop();
          if (arr.length > 0) {
            cs = arr[arr.length - 1];
          } else {
            hasjson = true;
            endi++;
            break;
          }
        }

        endi++;
      }
    }
  }

  if (!hasjson) {
    return '';
  }

  return str.substring(starti, endi);
}

exports.percentage2float = percentage2float;
exports.string2float = string2float;
exports.split2float = split2float;
exports.string2int = string2int;
exports.getJSONStr = getJSONStr;
