const {startBrowser} = require('../browser');
const {ipvoidgeoip} = require('./ipvoid');
const log = require('../log');

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
        log.console('version is ', version);

        if (!ipaddr) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler geoip --help'
          );

          return;
        }

        log.console('ipaddr - ', ipaddr);

        if (!options.mode) {
          options.mode = 'ipvoid';
        }

        const headless = options.headless === 'true';
        log.console('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          const ret = await ipvoidgeoip(browser, ipaddr);

          log.console(JSON.stringify(ret));

          await browser.close();
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.execGeoIP = execGeoIP;
