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

  if (!Array.isArray(cfg.dtcfg)) {
    return 'no config.dtcfg';
  }

  for (let i = 0; i < cfg.dtcfg.length; ++i) {
    const envcfg = cfg.dtcfg[i];

    if (!envcfg.envname) {
      return 'no config.envname';
    }

    if (!envcfg.url) {
      return 'no config.url in ' + envcfg.envname;
    }

    if (!envcfg.username) {
      return 'no config.username in ' + envcfg.envname;
    }

    if (!envcfg.password) {
      return 'no config.password in ' + envcfg.envname;
    }
  }

  return undefined;
}

/**
 * getEnvConfig
 * @param {object} cfg - config
 * @param {string} envname - name for environment
 * @return {object} envcfg - config for environment
 */
function getEnvConfig(cfg, envname) {
  for (let i = 0; i < cfg.dtcfg.length; ++i) {
    if (cfg.dtcfg[i].envname == envname) {
      return cfg.dtcfg[i];
    }
  }

  return undefined;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
exports.getEnvConfig = getEnvConfig;
