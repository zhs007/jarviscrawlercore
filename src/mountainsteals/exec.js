const {startBrowser} = require('../browser');
const {mountainstealsSale} = require('./sale');
const {mountainstealsProduct} = require('./product');
const log = require('../log');

/**
 * execMountainSteals
 * @param {object} program - program
 * @param {string} version - version
 */
async function execMountainSteals(program, version) {
  program
      .command('mountainsteals [mode]')
      .description('mountainsteals')
      .option('-u, --url [url]', 'url')
      .option('-p, --page [page]', 'pageid')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'sale' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help',
          );

          return;
        }

        if (mode == 'product' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help',
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

          if (mode == 'sale') {
            const ret = await mountainstealsSale(browser, options.url, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'product') {
            const ret = await mountainstealsProduct(
                browser,
                options.url,
                timeout,
            );
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

exports.execMountainSteals = execMountainSteals;
