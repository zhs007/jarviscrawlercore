const {startBrowser} = require('../browser');
const {ipvoidgeoip} = require('./ipvoid');

/**
 * execGeoIP
 * @param {object} program - program
 * @param {string} version - version
 */
async function execGeoIP(program, version) {
  program
      .command('geoip [ipaddr]')
      .description('ip geolocation')
      .option('-m, --mode [mode]', 'mode, its like ipvoid')
      .option('-h, --headless [isheadless]', 'headless mode')
      .action(function(ipaddr, options) {
        console.log('version is ', version);

        if (!ipaddr) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler geoip --help'
          );

          return;
        }

        console.log('ipaddr - ', ipaddr);

        if (!options.mode) {
          options.mode = 'ipvoid';
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          const ret = await ipvoidgeoip(browser, ipaddr);

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

exports.execGeoIP = execGeoIP;
