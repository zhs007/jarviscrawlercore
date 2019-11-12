const {startBrowser} = require('../browser');
const {tmallDetail} = require('./detail');
const log = require('../log');

/**
 * execTmall
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTmall(program, version) {
  program
      .command('tmall [mode]')
      .description('tmall')
      .option('-u, --url [url]', 'url')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tmall --help'
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'detail' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tmall --help'
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

          if (mode == 'detail') {
            const ret = await tmallDetail(browser, options.url, timeout);
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

exports.execTmall = execTmall;
