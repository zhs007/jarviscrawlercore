const {loadConfig, checkConfig, getWebsiteConfig} = require('./cfg');
const {oabt} = require('./oabt');
const {sleep} = require('../utils');
const log = require('../log');

/**
 * a bot for dtbk
 * @param {object} browser - browser
 * @param {string} cfgfile - cfgfile
 * @param {bool} debugmode - debug modes
 * @param {string} website - name for website
 * @return {object} result - {error: err, ret: ret}
 */
async function bt(browser, cfgfile, debugmode, website) {
  const ret = undefined;

  const cfg = loadConfig(cfgfile);
  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    const errstr = 'config file error: ' + cfgerr;
    log.error(errstr);

    return {error: errstr};
  }

  const websitecfg = getWebsiteConfig(cfg, website);
  if (!websitecfg) {
    const errstr = 'no website ' + website;
    log.error(errstr);

    return {error: errstr};
  }

  const page = await browser.newPage();
  let isloaded = false;
  page.on('domcontentloaded', async () => {
    log.debug('domcontentloaded');

    isloaded = true;
  });

  await page.goto(websitecfg.url).catch((err) => {
    log.debug('dtbkbot.goto', err);
  });

  while (true) {
    if (isloaded) {
      break;
    }

    await sleep(1000);
  }

  await oabt(browser, page, websitecfg.url);

  if (!debugmode) {
    await page.close();
  }

  return ret;
}

exports.bt = bt;
