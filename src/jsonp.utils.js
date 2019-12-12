const vm = require('vm');
const log = require('./log');

/**
 * parseJSONP - parse jsonp
 * @param {string} str - string
 * @param {string} callback - callback
 * @return {error} ret - {error, obj}
 */
function parseJSONP(str, callback) {
  try {
    const lst = [
      'var obj = undefined;',
      'function ' + callback + '(o) {',
      '  obj = o;',
      '}',
      str + ';',
      'obj;',
    ];

    const vmResult = vm.runInNewContext(lst.join('\n'));

    return {obj: vmResult};
  } catch (err) {
    log.warn('parseJSONP', err);

    return {error: err};
  }
}

exports.parseJSONP = parseJSONP;
