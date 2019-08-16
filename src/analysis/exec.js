const {startBrowser} = require('../browser');
const {analyzePage} = require('./page');

/**
 * execAnalysis
 * @param {object} program - program
 * @param {string} version - version
 */
async function execAnalysis(program, version) {
  program
      .command('analyze [mode]')
      .description('analyze website')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-u, --url [url]', 'url')
      .option('-d, --delay [delay]', 'dealy time in seconds')
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler analyze --help'
          );

          return;
        }

        console.log('mode - ', mode);

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        let delay = 0;
        if (options.delay) {
          delay = parseInt(options.delay);
        }

        (async () => {
          const browser = await startBrowser(headless);

          await analyzePage(browser, options.url, undefined, {
            screenshotsDelay: delay,
          });

          await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execAnalysis = execAnalysis;
