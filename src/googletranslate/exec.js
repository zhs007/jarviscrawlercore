const { startBrowser } = require('../browser');
const { googletranslate } = require('./googletranslate');
const log = require('../log');

/**
 * googletranslateexec
 * @param {object} program - program
 * @param {string} version - version
 */
async function googletranslateexec(program, version) {
  program
    .command('googletranslate [text]')
    .description('google translate')
    .option('-s, --srclang [language]', 'source language')
    .option('-d, --destlang [language]', 'destination language')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function (text, options) {
      log.console('version is ', version);

      if (!text) {
        log.console(
          'command wrong, please type ' + 'jarviscrawler googletranslate --help'
        );

        return;
      }

      log.console('text - ', text);

      if (!options.srclang) {
        options.srclang = 'zh-CN';
      }

      if (!options.destlang) {
        options.destlang = 'en';
      }

      const headless = options.headless === 'true';
      log.console('headless - ', headless);

      let timeout = 3 * 60 * 1000;

      (async () => {
        const browser = await startBrowser(headless);

        const desttext = await googletranslate(
          browser,
          text,
          options.srclang,
          options.destlang,
          timeout
        );

        log.console(desttext);

        await browser.close();
      })().catch((err) => {
        log.console('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });
}

exports.googletranslateexec = googletranslateexec;
