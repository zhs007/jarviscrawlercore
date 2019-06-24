const yaml = require('yaml-js');
const fs = require('fs');

/**
 * load config
 * @param {string} cfgfile - cfgfile
 * @return {object} cfg - config
 */
function loadConfig(cfgfile) {
  const fd = fs.readFileSync(cfgfile);
  if (fd) {
    return yaml.load(fd);
  }

  return undefined;
}

/**
 * check config
 * @param {object} cfg - config
 * @return {string} err - error string
 */
function checkConfig(cfg) {
  if (!cfg) {
    return 'config undefined';
  }

  if (!cfg.url) {
    return 'no config.url';
  }

  if (!cfg.username) {
    return 'no config.username';
  }

  if (!cfg.password) {
    return 'no config.password';
  }

  return undefined;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
