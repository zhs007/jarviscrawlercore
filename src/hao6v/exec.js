const {startBrowser} = require('../browser');
const {hao6vNewPage} = require('./newpage');
const log = require('../log');

/**
 * execHao6v
 * @param {object} program - program
 * @param {string} version - version
 */
async function execHao6v(program, version) {
  program
      .command('hao6v [mode]')
      .description('hao6v')
      .option('-p, --pageindex [pageindex]', 'page index')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler hao6v --help',
          );

          return;
        }

        log.console('mode - ', mode);

        // if (mode == 'page' && !options.pageindex) {
        //   log.console(
        //       'command wrong, please type ' + 'jarviscrawler hao6v --help',
        //   );

        //   return;
        // }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'newpage') {
            const ret = await hao6vNewPage(browser, timeout);
            log.console(JSON.stringify(ret));
          }

          await browser.close();

          process.exit(0);
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execHao6v = execHao6v;
