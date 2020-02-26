const {startBrowser} = require('../browser');
const {lieyunwangNews} = require('./news');
const log = require('../log');

/**
 * execLieyunwang
 * @param {object} program - program
 * @param {string} version - version
 */
async function execLieyunwang(program, version) {
  program
      .command('lieyunwang [mode]')
      .description('lieyunwang')
      .option('-u, --url [url]', 'url')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler lieyunwang --help',
          );

          return;
        }

        log.console('mode - ', mode);

        // if (mode == 'respage' && !options.url) {
        //   log.console(
        //       'command wrong, please type ' + 'jarviscrawler smzdm --help',
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

          if (mode == 'news') {
            const ret = await lieyunwangNews(browser, timeout);
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

exports.execLieyunwang = execLieyunwang;
