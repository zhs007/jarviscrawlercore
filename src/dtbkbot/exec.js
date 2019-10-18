const {startBrowser} = require('../browser');
const {dtbkbot} = require('./dtbkbot');
const log = require('../log');

/**
 * dtbkbotexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function dtbkbotexec(program, version) {
  program
      .command('dtbkbot [cfgfile]')
      .description('I am a dtbk bot')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-d, --debug [isdebug]', 'debug mode')
      .option('-n, --envname [envname]', 'envname')
      .option('-m, --mode [mode]', 'mode')
      .option('-s, --starttime [starttime]', 'starttime')
      .option('-e, --endtime [endtime]', 'endtime')
      .action(function(cfgfile, options) {
        log.console('version is ', version);

        if (!cfgfile || !options.mode || !options.envname) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler dtbkbot --help'
          );

          return;
        }

        log.console('cfgfile - ', cfgfile);

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        const debugmode = options.debug === 'true';
        log.console('debug - ', debugmode);

        (async () => {
          const browser = await startBrowser(headless);

          await dtbkbot(
              browser,
              cfgfile,
              debugmode,
              options.envname,
              options.mode,
              undefined,
              undefined,
              undefined,
              options.starttime,
              options.endtime
          );

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

exports.dtbkbotexec = dtbkbotexec;
