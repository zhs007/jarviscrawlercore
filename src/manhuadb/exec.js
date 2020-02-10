const {startBrowser} = require('../browser');
const {manhuadbManhua} = require('./manhua');
const {manhuadbBook} = require('./book');
const {manhuadbAuthor} = require('./author');
const log = require('../log');

/**
 * execManhuaDB
 * @param {object} program - program
 * @param {string} version - version
 */
async function execManhuaDB(program, version) {
  program
      .command('manhuadb [mode]')
      .description('manhuadb')
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
              'command wrong, please type ' + 'jarviscrawler manhuadb --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'manhua' && !options.comic) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler manhuadb --help',
          );

          return;
        } else if (
          mode == 'book' &&
        !options.comic &&
        !options.book &&
        !options.page
        ) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler manhuadb --help',
          );

          return;
        } else if (mode == 'author' && !options.author) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler manhuadb --help',
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
            const ret = await manhuadbManhua(browser, options.comic, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'book') {
            const ret = await manhuadbBook(
                browser,
                options.comic,
                options.book,
                options.page,
                timeout,
            );
            log.console(JSON.stringify(ret));
          } else if (mode == 'author') {
            const ret = await manhuadbAuthor(browser, options.author, timeout);
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

exports.execManhuaDB = execManhuaDB;
