const puppeteer = require('puppeteer');
const {loadConfig, checkConfig} = require('./cfg');
const {runActions} = require('./actions');

/**
 * a bot for confluence
 * @param {string} cfgfile - cfgfile
 * @param {bool} headless - headless modes
 */
async function confluencebot(cfgfile, headless) {
  const cfg = loadConfig(cfgfile);
  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    console.log('config file error: ' + cfgerr);

    return;
  }

  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.goto(cfg.url);
  await page.waitForSelector('#login-container');
  await page.type('#os_username', cfg.username);
  await page.type('#os_password', cfg.password);
  await page.click('#loginButton');

  await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
    console.log('confluencebot:waitForNavigation ', err);
  });

  await runActions(page, cfg);

//   await browser.close();
}

exports.confluencebot = confluencebot;
