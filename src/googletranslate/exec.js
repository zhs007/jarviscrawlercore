const {startBrowser} = require('../browser');
const {googletranslate} = require('./googletranslate');

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
      .action(function(text, options) {
        console.log('version is ', version);

        if (!text) {
          console.log(
              'command wrong, please type ' + 'jarviscrawler googletranslate --help'
          );

          return;
        }

        console.log('text - ', text);

        if (!options.srclang) {
          options.srclang = 'zh-CN';
        }

        if (!options.destlang) {
          options.destlang = 'en';
        }

        const headless = options.headless === 'true';
        console.log('headless - ', headless);

        (async () => {
          const browser = await startBrowser(headless);

          const desttext = await googletranslate(
              browser,
              text,
              options.srclang,
              options.destlang
          );

          console.log(desttext);

          await browser.close();
        })().catch((err) => {
          console.log('catch a err ', err);

          if (headless) {
            process.exit(-1);
          }
        });
      });
}

exports.googletranslateexec = googletranslateexec;
