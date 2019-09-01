const {startBrowser} = require('../browser');
const {steepandcheapProducts} = require('./products');

/**
 * execSteepAndCheap
 * @param {object} program - program
 * @param {string} version - version
 */
async function execSteepAndCheap(program, version) {
  program
      .command('steepandcheap [mode]')
      .description('steepandcheap')
      .option('-u, --url [url]', 'url')
      .option('-t, --timeout [timeout]', 'time out')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(mode, options) {
        console.log('version is ', version);

        if (!mode) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler steepandcheap --help'
          );

          return;
        }

        console.log('mode - ', mode);

        if (mode == 'products' && !options.url) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler steepandcheap --help'
          );

          return;
        }

        let timeout = 3 * 60 * 1000;
        if (typeof options.timeout == 'number') {
          timeout = options.timeout;
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          if (mode == 'products') {
            const ret = await steepandcheapProducts(
                browser,
                options.url,
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

exports.execSteepAndCheap = execSteepAndCheap;
