const {startBrowser} = require('../browser');
const {telegraphImages} = require('./images');
const log = require('../log');

/**
 * execTelegraph
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTelegraph(program, version) {
  program
      .command('telegraph [mode]')
      .description('telegraph')
      .option('-u, --url [url]', 'url')
      .option('-d, --dlimgs [dlimgs]', 'download images')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler telegraph --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'images' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler telegraph --help',
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

          if (mode == 'images') {
            const ret = await telegraphImages(browser, options.url, timeout);
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

exports.execTelegraph = execTelegraph;
