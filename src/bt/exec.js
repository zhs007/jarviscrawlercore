const {startBrowser} = require('../browser');
const {bt} = require('./bt');

/**
 * dtbkbotexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function btexec(program, version) {
  program
      .command('bt [cfgfile]')
      .description('bt')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --debug [isdebug]', 'debug mode')
      .option('-n, --name [name]', 'website name')
      .action(function(cfgfile, options) {
        console.log('version is ', version);

        if (!cfgfile || !options.name) {
          console.log('command wrong, please type ' + 'jarviscrawler bt --help');

          return;
        }

        console.log('cfgfile - ', cfgfile);

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        const debugmode = options.debug === 'true';
        console.log('debug - ', debugmode);

        (async () => {
          const browser = await startBrowser(headless);

          await bt(browser, cfgfile, true, options.name);

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

exports.btexec = btexec;
