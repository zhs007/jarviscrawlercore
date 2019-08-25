const {startBrowser} = require('../browser');
const {techinasiaCompany} = require('./company');
const {techinasiaJob} = require('./job');

/**
 * execTechInAsia
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTechInAsia(program, version) {
  program
      .command('techinasia [mode]')
      .description('techinasia')
      .option('-c, --company [company]', 'company code')
      .option('-j, --job [job]', 'job code')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler techinasia --help'
          );

          return;
        }

        console.log('mode - ', mode);

        if (mode == 'compnay' && !options.company) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler techinasia --help'
          );

          return;
        }

        if (mode == 'job' && !options.job) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler techinasia --help'
          );

          return;
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'company') {
            const ret = await techinasiaCompany(browser, options.company);
            console.log(JSON.stringify(ret));
          } else if (mode == 'job') {
            const ret = await techinasiaJob(browser, options.job);
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

exports.execTechInAsia = execTechInAsia;
