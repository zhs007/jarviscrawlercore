const {startBrowser} = require('../browser');
const log = require('../log');
const {investingAssets} = require('./assets');
const {investingHD} = require('./historicaldata');

/**
 * execInvesting
 * @param {object} program - program
 * @param {string} version - version
 */
async function execInvesting(program, version) {
  program
      .command('investing [mode]')
      .description('investing')
      .option('-u, --url [url]', 'url')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler investing --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'assets' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler investing --help',
          );

          return;
        } else if (mode == 'hd' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler investing --help',
          );

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'assets') {
            const ret = await investingAssets(browser, options.url, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'hd') {
            const ret = await investingHD(
                browser,
                options.url,
                '2020/01/01',
                '2020/11/01',
                timeout,
            );
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

exports.execInvesting = execInvesting;
