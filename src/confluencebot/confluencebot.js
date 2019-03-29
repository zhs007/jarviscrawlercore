const puppeteer = require('puppeteer');
const {loadConfig, checkConfig} = require('./cfg');
const {allUpdates} = require('./allupdates');

/**
 * export article to a pdf file or a jpg file.
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
    console.log('catch a err ', err);
  });
  //   await page.waitForSelector('.list-container.list-container-all-updates');
  await page.addScriptTag({path: './browser/utils.js'});
  const allupdates = await allUpdates(page);

  console.log('%j', allupdates);

//   await browser.close();
}

exports.confluencebot = confluencebot;
