const {startBrowser, attachBrowser} = require('../browser');
const {taobaoItem} = require('./item');
const {taobaoSearch} = require('./search');
const log = require('../log');

/**
 * execTaobao
 * @param {object} program - program
 * @param {string} version - version
 */
async function execTaobao(program, version) {
  program
      .command('taobao [mode]')
      .description('taobao')
      .option('-i, --itemid [itemid]', 'itemid')
      .option('-s, --searchstring [searchstring]', 'searchstring')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .option('-a, --attach [attach]', 'attach browser')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler taobao --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'item' && !options.itemid) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler taobao --help',
          );

          return;
        } else if (mode == 'search' && !options.searchstring) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler taobao --help',
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
          let browser;
          if (options.attach) {
            browser = await attachBrowser(options.attach);
          } else {
            browser = await startBrowser(headless);
          }

          if (mode == 'item') {
            const ret = await taobaoItem(browser, options.itemid, timeout);
            log.console(JSON.stringify(ret));
          } else if (mode == 'search') {
            const ret = await taobaoSearch(
                browser,
                options.searchstring,
                timeout,
            );
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

exports.execTaobao = execTaobao;
