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

  if (!cfg.servAddr) {
    return 'no config.servAddr';
  }

  if (cfg.headless === undefined) {
    cfg.headless = true;
  }

  return undefined;
}

/**
 * is valid token
 * @param {object} cfg - config
 * @param {string} token - token
 * @return {bool} isvalid - is valid token
 */
function isValidToken(cfg, token) {
  if (!cfg) {
    return false;
  }

  if (!cfg.clientToken) {
    return true;
  }

  if (typeof cfg.clientToken === 'string') {
    return token === cfg.clientToken;
  }

  if (Array.isArray(cfg.clientToken)) {
    return cfg.clientToken.indexOf(token) >= 0;
  }

  return false;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
exports.isValidToken = isValidToken;
