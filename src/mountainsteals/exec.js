const {startBrowser} = require('../browser');
const {mountainstealsSale} = require('./sale');

/**
 * execMountainSteals
 * @param {object} program - program
 * @param {string} version - version
 */
async function execMountainSteals(program, version) {
  program
      .command('mountainsteals [mode]')
      .description('mountainsteals')
      .option('-u, --url [url]', 'url')
      .option('-p, --page [page]', 'pageid')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help'
          );

          return;
        }

        console.log('mode - ', mode);

        if (mode == 'sale' && !options.url) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help'
          );

          return;
        }

        if (mode == 'product' && !options.url) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler mountainsteals --help'
          );

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        let page = 0;
        if (options.page) {
          try {
            page = parseInt(options.page);
          } catch (err) {}
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'sale') {
            const ret = await mountainstealsSale(
                browser,
                options.url,
                page,
                timeout
            );
            console.log(JSON.stringify(ret));
          }

          await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execMountainSteals = execMountainSteals;
