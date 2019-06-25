const {startService} = require('./service');

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
        console.log('version is ', version);

        if (!cfgfile) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler startservice --help'
          );

          return;
        }

        console.log('cfgfile - ', cfgfile);

        (async () => {
          await startService(cfgfile);
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.serviceexec = serviceexec;
