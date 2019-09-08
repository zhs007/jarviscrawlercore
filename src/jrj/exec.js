const {startBrowser} = require('../browser');
const {jrjFunds} = require('./funds');
const {jrjFund} = require('./fund');
const {jrjFundValue} = require('./fundvalue');

/**
 * execJRJ
 * @param {object} program - program
 * @param {string} version - version
 */
async function execJRJ(program, version) {
  program
      .command('jrj [mode]')
      .description('jrj')
      .option('-c, --code [code]', 'fund code')
      .option('-y, --year [year]', 'year')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        console.log('mode - ', mode);

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        if (mode == 'fund' && !options.code) {
          console.log('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        if (mode == 'fundvalue' && (!options.code || !options.year)) {
          console.log('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'funds') {
            const ret = await jrjFunds(browser, timeout);
            console.log(JSON.stringify(ret));
          } else if (mode == 'fund') {
            const ret = await jrjFund(browser, options.code, timeout);
            console.log(JSON.stringify(ret));
          } else if (mode == 'fundvalue') {
            const ret = await jrjFundValue(browser, options.code, options.year, timeout);
            console.log(JSON.stringify(ret));
          }

          await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execJRJ = execJRJ;
