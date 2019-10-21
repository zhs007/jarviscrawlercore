const {startBrowser} = require('../browser');
const {bt} = require('./bt');
const log = require('../log');

/**
 * dtbkbotexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function btexec(program, version) {
  program
      .command('bt [cfgfile]')
      .description('bt')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --debug [isdebug]', 'debug mode')
      .option('-n, --name [name]', 'website name')
      .action(function(cfgfile, options) {
        log.console('version is ', version);

        if (!cfgfile || !options.name) {
          log.console('command wrong, please type ' + 'jarviscrawler bt --help');

          return;
        }

        log.console('cfgfile - ', cfgfile);

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        const debugmode = options.debug === 'true';
        log.console('debug - ', debugmode);

        (async () => {
          const browser = await startBrowser(headless);

          await bt(browser, cfgfile, true, options.name);

          if (!debugmode) {
            await browser.close();
          }
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.btexec = btexec;
