const {startBrowser} = require('../browser');
const {jrjFunds} = require('./funds');
const {jrjFund} = require('./fund');
const {jrjFundValue} = require('./fundvalue');
const {jrjFundManager} = require('./fundmanager');
const log = require('../log');

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
        log.console('version is ', version);

        if (!mode) {
          log.console('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        log.console('mode - ', mode);

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        if (mode == 'fund' && !options.code) {
          log.console('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        if (mode == 'fundmanager' && !options.code) {
          log.console('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        if (mode == 'fundvalue' && (!options.code || !options.year)) {
          log.console('command wrong, please type ' + 'jarviscrawler jrj --help');

          return;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'funds') {
            const ret = await jrjFunds(browser, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'fund') {
            const ret = await jrjFund(browser, options.code, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'fundvalue') {
            const ret = await jrjFundValue(
                browser,
                options.code,
                options.year,
                timeout
            );
            log.console(JSON.stringify(ret));
          } else if (mode == 'fundmanager') {
            const ret = await jrjFundManager(browser, options.code, timeout);
            log.console(JSON.stringify(ret));
          }

          await browser.close();
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execJRJ = execJRJ;
