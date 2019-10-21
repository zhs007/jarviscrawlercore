const {startService} = require('./service');
const log = require('../log');

/**
 * serviceexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function serviceexec(program, version) {
  program
      .command('startservice [cfgfile]')
      .description('start a grpc service')
      .action(function(cfgfile, options) {
        log.console('version is ', version);

        if (!cfgfile) {
          log.console(
              'command wrong, please type ' + 'jarviscrawler startservice --help'
          );

          return;
        }

        log.console('cfgfile - ', cfgfile);

        (async () => {
          await startService(cfgfile);
        })().catch((err) => {
          log.console('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.serviceexec = serviceexec;
