const {loadConfig, checkConfig} = require('./cfg');
const {cbcompany} = require('./company');
const log = require('../log');

/**
 * searchInCrunchBase
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {string} searchstr - search string
 * @return {object} result - {error: string, company: company}
 */
async function searchInCrunchBase(browser, cfgfile, searchstr) {
  const cfg = loadConfig(cfgfile);
  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    const err = 'config file error: ' + cfgerr;

    log.error(err);

    return {error: err};
  }

  let errstr = undefined;

  const ret = await cbcompany(browser, searchstr).catch((err) => {
    errstr = err.toString();
  });

  if (errstr) {
    return {error: errstr};
  }

  return {company: ret};
}

exports.searchInCrunchBase = searchInCrunchBase;
