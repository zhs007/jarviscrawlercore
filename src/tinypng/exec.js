const {startBrowser} = require('../browser');
const {tinypng} = require('./tinypng');
const fs = require('fs');

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
          if (ret) {
            if (ret.error) {
              console.log('error - ', ret.error);
            } else if (ret.lstbuf && options.output) {
              for (let i = 0; i < ret.lstbuf; ++i) {
                fs.writeFileSync(options.output, ret.lstbuf[i]);
              }
            }
          }

          // console.log(JSON.stringify(ret));

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
