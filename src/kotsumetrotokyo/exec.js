const {startBrowser} = require('../browser');
const {kotsumetrotokyoSubways} = require('./subways');
const log = require('../log');

/**
 * execKotsuMetroTokyo
 * @param {object} program - program
 * @param {string} version - version
 */
async function execKotsuMetroTokyo(program, version) {
  program
      .command('kotsumetrotokyo [mode]')
      .description('kotsumetrotokyo')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler kotsumetrotokyo --help',
          );

          return;
        }

        log.console('mode - ', mode);

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'subways') {
            const ret = await kotsumetrotokyoSubways(browser, timeout);
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

exports.execKotsuMetroTokyo = execKotsuMetroTokyo;
