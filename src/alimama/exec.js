const {startBrowser, attachBrowser} = require('../browser');
const {alimamaSearch} = require('./search');
const {alimamaGetTop} = require('./gettop');
const {alimamaKeepalive} = require('./keepalive');
const log = require('../log');

/**
 * execAlimama
 * @param {object} program - program
 * @param {string} version - version
 */
async function execAlimama(program, version) {
  program
      .command('alimama [mode]')
      .description('alimama')
      .option('-s, --str [str]', 'string')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-a, --attach [attach]', 'attach browser')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler alimama --help'
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'search' && !options.str) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler alimama --help'
          );

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        // let page = 0;
        if (options.page) {
          try {
            page = parseInt(options.page);
          } catch (err) {}
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          let browser;
          if (options.attach) {
            browser = await attachBrowser(options.attach);
          } else {
            browser = await startBrowser(headless);
          }

          if (mode == 'search') {
            const ret = await alimamaSearch(
                browser,
                options.str,
                undefined,
                timeout
            );
            log.console(JSON.stringify(ret));
          } else if (mode == 'gettop') {
            const ret = await alimamaGetTop(browser, undefined, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'keepalive') {
            const ret = await alimamaKeepalive(browser, undefined, timeout);
            log.console(JSON.stringify(ret));
          }

          if (!options.attach) {
            await browser.close();
          }

          process.exit(-1);
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execAlimama = execAlimama;
