const {startBrowser} = require('../browser');
const {search} = require('./search');

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
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler douban --help'
          );

          return;
        }

        console.log('mode - ', mode);

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        const debugmode = options.debug === 'true';
        console.log('debug - ', debugmode);

        (async () => {
          const browser = await startBrowser(headless);

          await search(browser, options.search, debugmode);

          if (!debugmode) {
            await browser.close();
          }
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.doubanexec = doubanexec;
