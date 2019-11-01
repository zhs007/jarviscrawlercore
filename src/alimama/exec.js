const {startBrowser} = require('../browser');
const {alimamaSearch} = require('./search');
// const {jdActive} = require('./active');
// const {jdActivePage} = require('./activepage');
const log = require('../log');

/**
 * execAlimama
 * @param {object} program - program
 * @param {string} version - version
 */
async function execAlimama(program, version) {
  program
      .command('alimama [mode]')
      .description('alimama')
      .option('-s, --str [str]', 'string')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler alimama --help'
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'search' && !options.str) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler alimama --help'
          );

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        // let page = 0;
        if (options.page) {
          try {
            page = parseInt(options.page);
          } catch (err) {}
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'search') {
            const ret = await alimamaSearch(browser, options.str, timeout);
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

exports.execAlimama = execAlimama;