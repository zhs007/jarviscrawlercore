const {startBrowser} = require('../browser');
const {tinypng} = require('./tinypng');
const fs = require('fs');
const log = require('../log');

/**
 * execTinypng
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTinypng(program, version) {
  program
      .command('tinypng [filename]')
      .description('tinypng')
      .option('-o, --output [outputfile]', 'output file')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(filename, options) {
        log.console('version is ', version);

        if (!filename) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler tinypng --help'
          );

          return;
        }

        log.console('filename - ', filename);

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          const ret = await tinypng(browser, filename);
          if (ret) {
            if (ret.error) {
              log.console('error - ', ret.error);
            } else if (ret.lstbuf && options.output) {
              for (let i = 0; i < ret.lstbuf.length; ++i) {
                fs.writeFileSync(options.output, ret.lstbuf[i]);
              }
            }
          }

          // console.log(JSON.stringify(ret));

          await browser.close();
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execTinypng = execTinypng;
