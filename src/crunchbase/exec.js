const {startBrowser} = require('../browser');
const {cbcompanies} = require('./companies');
const {cbcompany} = require('./company');

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
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!options.company) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler crunchbase --help'
          );

          return;
        }

        if (!(mode == 'companies' || mode == 'company')) {
          console.log('command wrong, the mode is companies or company');

          return;
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'companies') {
            await cbcompanies(browser, options.company);
          } else if (mode == 'company') {
            await cbcompany(browser, options.company);
          }

        // await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.crunchbaseexec = crunchbaseexec;
