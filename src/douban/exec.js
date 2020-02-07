const {startBrowser} = require('../browser');
const {search} = require('./search');
const {book} = require('./book');
const log = require('../log');

/**
 * doubanexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function doubanexec(program, version) {
  program
      .command('douban [mode]')
      .description('bt')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --debug [isdebug]', 'debug mode')
      .option('-s, --search [search]', 'search string')
      .option('-t, --type [type]', 'type')
      .option('-i, --id [id]', 'id')
      .option('-m, --timeout [timeout]', 'time out')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.debug(
              'command wrong, please type ' + 'jarviscrawler douban --help',
          );

          return;
        }

        log.console('mode - ', mode);

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        const debugmode = options.debug === 'true';
        log.console('debug - ', debugmode);

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        if (mode == 'search') {
          if (!options.search) {
            log.debug(
                'command wrong, please type ' + 'jarviscrawler douban --help',
            );

            return;
          }
        } else if (mode == 'book') {
          if (!options.id) {
            log.debug(
                'command wrong, please type ' + 'jarviscrawler douban --help',
            );

            return;
          }
        }

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'search') {
            const ret = await search(
                browser,
                options.type,
                options.search,
                debugmode,
                timeout,
            );

            log.debug('douban.search', ret);
          } else if (mode == 'book') {
            const ret = await book(browser, options.id, timeout);

            log.debug('douban.book', ret);
          }

          if (!debugmode) {
            await browser.close();
          }
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.doubanexec = doubanexec;
