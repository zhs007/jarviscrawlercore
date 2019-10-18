const {startBrowser} = require('../browser');
const {cbcompanies} = require('./companies');
const {cbcompany} = require('./company');
const {cblogin} = require('./login');
const log = require('../log');

/**
 * crunchbaseexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function crunchbaseexec(program, version) {
  program
      .command('crunchbase [mode]')
      .description('crunchbase')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-c, --company [company]', 'company name')
      .option('-u, --user [user]', 'user name')
      .option('-p, --password [password]', 'password name')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (mode == 'companies' || mode == 'company') {
          if (!options.company) {
            log.console(
                'command wrong, please type ' + 'jarviscrawler crunchbase --help'
            );

            return;
          }
        }

        if (mode == 'login') {
          if (!options.user || !options.password) {
            log.console(
                'command wrong, please type ' + 'jarviscrawler crunchbase --help'
            );

            return;
          }
        }

        if (!(mode == 'companies' || mode == 'company' || mode == 'login')) {
          log.console('command wrong, the mode is companies or company or login');

          return;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'companies') {
            await cbcompanies(browser, options.company);
          } else if (mode == 'company') {
            await cbcompany(browser, options.company);
          } else if (mode == 'login') {
            await cblogin(browser, options.user, options.password);
          }

        // await browser.close();
        })().catch((err) => {
          log.console('crunchbaseexec ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.crunchbaseexec = crunchbaseexec;
