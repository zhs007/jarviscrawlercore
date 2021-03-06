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
 * @return {Error} err - error
 */
function checkConfig(cfg) {
  if (!cfg) {
    return new Error('config undefined');
  }

  if (!Array.isArray(cfg.website)) {
    return new Error('no config.website');
  }

  for (let i = 0; i < cfg.website.length; ++i) {
    const websitecfg = cfg.website[i];

    if (!websitecfg.name) {
      return new Error('no website.name');
    }

    if (!websitecfg.url) {
      return new Error('no website.url in ' + websitecfg.name);
    }
  }

  return undefined;
}

/**
 * getWebsiteConfig
 * @param {object} cfg - config
 * @param {string} name - name for website
 * @return {object} websitecfg - config for website
 */
function getWebsiteConfig(cfg, name) {
  for (let i = 0; i < cfg.website.length; ++i) {
    if (cfg.website[i].name == name) {
      return cfg.website[i];
    }
  }

  return undefined;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
exports.getWebsiteConfig = getWebsiteConfig;
