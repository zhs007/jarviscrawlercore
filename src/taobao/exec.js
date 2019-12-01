const {startBrowser} = require('../browser');
const {taobaoItem} = require('./item');
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
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        log.console('version is ', version);

        if (!mode) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler taobao --help',
          );

          return;
        }

        log.console('mode - ', mode);

        if (mode == 'taobao' && !options.itemid) {
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
          const browser = await startBrowser(headless);

          if (mode == 'item') {
            const ret = await taobaoItem(browser, options.itemid, timeout);
            log.console(JSON.stringify(ret));
          }

          await browser.close();
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execTaobao = execTaobao;
