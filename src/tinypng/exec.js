const {startBrowser} = require('../browser');
const {tinypng} = require('./tinypng');

/**
 * execTinypng
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTinypng(program, version) {
  program
      .command('tinypng [filename]')
      .description('tinypng')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(filename, options) {
        console.log('version is ', version);

        if (!filename) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler tinypng --help'
          );

          return;
        }

        console.log('filename - ', filename);

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          const ret = await tinypng(browser, filename);

          console.log(JSON.stringify(ret));

          await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execTinypng = execTinypng;
