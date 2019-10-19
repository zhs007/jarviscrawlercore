/**
 * log
 * @param {string} type - type
 * @param {string} info - infomation
 * @param {object} obj - object
 */
function log(type, info, obj) {
  if (!obj) {
    obj = {D: Date.now(), T: type, I: info};
  } else {
    obj.D = Date.now();
    obj.T = type;
    obj.I = info;
  }

  console.log(JSON.stringify(obj));
}

/**
 * info
 * @param {string} info - infomation
 * @param {object} obj - object
 */
function info(info, obj) {
  log('INFO', info, obj);
}

/**
 * debug
 * @param {string} info - infomation
 * @param {object} obj - object
 */
function debug(info, obj) {
  log('DEBUG', info, obj);
}

/**
 * warn
 * @param {string} info - infomation
 * @param {object} obj - object
 */
function warn(info, obj) {
  log('WARN', info, obj);
}

/**
 * error
 * @param {string} info - infomation
 * @param {object} obj - object
 */
function error(info, obj) {
  log('ERROR', info, obj);
}

exports.log = log;
exports.info = info;
exports.debug = debug;
exports.warn = warn;
exports.error = error;
exports.console = console.log;