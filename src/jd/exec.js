const {startBrowser} = require('../browser');
const {jdProduct} = require('./product');
const {jdActive} = require('./active');
const {jdActivePage} = require('./activepage');
const log = require('../log');

/**
 * execJD
 * @param {object} program - program
 * @param {string} version - version
 */
async function execJD(program, version) {
  program
      .command('jd [mode]')
      .description('jd')
      .option('-u, --url [url]', 'url')
      .option('-p, --page [page]', 'pageid')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console('command wrong, please type ' + 'jarviscrawler jd --help');

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'active' && !options.url) {
          log.console('command wrong, please type ' + 'jarviscrawler jd --help');

          return;
        }

        if (mode == 'activepage' && !options.url) {
          log.console('command wrong, please type ' + 'jarviscrawler jd --help');

          return;
        }

        if (mode == 'product' && !options.url) {
          log.console('command wrong, please type ' + 'jarviscrawler jd --help');

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

          if (mode == 'active') {
            const ret = await jdActive(browser, options.url, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'product') {
            const ret = await jdProduct(browser, options.url, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'activepage') {
            const ret = await jdActivePage(browser, options.url, timeout);
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

exports.execJD = execJD;
