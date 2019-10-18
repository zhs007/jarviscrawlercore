const {startBrowser} = require('../browser');
const {techinasiaCompany} = require('./company');
const {techinasiaJob} = require('./job');
const {techinasiaJobs} = require('./jobs');
const {techinasiaJobTag} = require('./jobtag');
const log = require('../log');

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
      .option('-n, --jobnums [jobnums]', 'job nums')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-m, --maintag [maintag]', 'main tag')
      .option('-s, --subtag [subtag]', 'sub tag')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console('command wrong, please type ' + 'jarviscrawler techinasia --help');

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'compnay' && !options.company) {
          log.console('command wrong, please type ' + 'jarviscrawler techinasia --help');

          return;
        }

        if (mode == 'job' && !options.job) {
          log.console('command wrong, please type ' + 'jarviscrawler techinasia --help');

          return;
        }

        if (mode == 'jobs' && !options.jobnums) {
          log.console('command wrong, please type ' + 'jarviscrawler techinasia --help');

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        let maintag = '';
        if (typeof options.maintag == 'string') {
          maintag = options.maintag;
        }

        let subtag = '';
        if (typeof options.subtag == 'string') {
          subtag = options.subtag;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'company') {
            const ret = await techinasiaCompany(browser, options.company, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'job') {
            const ret = await techinasiaJob(browser, options.job, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'jobs') {
            const ret = await techinasiaJobs(browser, options.jobnums, maintag, subtag, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'jobtag') {
            const ret = await techinasiaJobTag(browser, maintag, timeout);
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

exports.execTechInAsia = execTechInAsia;
