const {startBrowser} = require('../browser');
const log = require('../log');
const {p6vdyMovies} = require('./movies');

/**
 * exec6vdy
 * @param {object} program - program
 * @param {string} version - version
 */
async function exec6vdy(program, version) {
  program
      .command('6vdy [mode]')
      .description('6vdy')
      .option('-u, --url [url]', 'url')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler 6vdy --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'movies' && !options.url) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler 6vdy --help',
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

          if (mode == 'movies') {
            const ret = await p6vdyMovies(browser, options.url, timeout);
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

exports.exec6vdy = exec6vdy;
