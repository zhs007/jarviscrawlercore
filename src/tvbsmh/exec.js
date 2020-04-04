const {startBrowser} = require('../browser');
const {tvbsmhManhua} = require('./manhua');
const {tvbsmhBook} = require('./book');
const log = require('../log');

/**
 * execTvbsmh
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTvbsmh(program, version) {
  program
      .command('tvbsmh [mode]')
      .description('tvbsmh')
      .option('-c, --comic [comicid]', 'comicid')
      .option('-a, --author [authorid]', 'authorid')
      .option('-b, --book [bookid]', 'bookid')
      .option('-p, --page [pageindex]', 'pageindex')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --device [device]', 'device')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tvbsmh --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'manhua' && !options.comic) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tvbsmh --help',
          );

          return;
        } else if (
          mode == 'book' &&
        !options.comic &&
        !options.book &&
        !options.page
        ) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tvbsmh --help',
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

          if (mode == 'manhua') {
            const ret = await tvbsmhManhua(browser, options.comic, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'book') {
            const ret = await manhuaguiBook(
                browser,
                options.comic,
                options.book,
                options.page,
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

exports.execTvbsmh = execTvbsmh;
