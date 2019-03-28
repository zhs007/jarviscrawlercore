const program = require('commander');
const {exportArticle} = require('../src/exportarticle/exportarticle');
const {tracing} = require('../src/tracing/tracing');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
const VERSION = package.version;

program
    .version(VERSION);

program
    .command('exparticle [url]')
    .description('export article')
    .option('-o, --output [filename]', 'export output file')
    .option('-p, --pdf [filename]', 'export pdf file')
    .option('-f, --pdfformat [format]', 'like A4')
    .option('-j, --jpg [filename]', 'export jpg file')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url) {
        console.log('command wrong, please type ' +
          'jarviscrawler exparticle --help');

        return;
      }

      console.log('url - ', url);
      // console.log('url - ', options);

      if (options.output) {
        console.log('output - ', options.output);
      }

      if (options.pdf) {
        console.log('pdf - ', options.pdf);
      }

      console.log('pdfformat - ', options.pdfformat);
      console.log('jpg - ', options.jpg);

      const headless = options.headless === 'true';

      console.log('headless - ', headless);
      //   console.log(url);
      //   console.log(options);

      (async () => {
        await exportArticle(url,
            options.output,
            options.pdf,
            options.pdfformat,
            options.jpg,
            headless);
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('tracing [url]')
    .description('tracing page')
    .option('-o, --output [filename]', 'export output file')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url || !options.output) {
        console.log('command wrong, please type ' +
          'jarviscrawler tracing --help');

        return;
      }

      console.log('url - ', url);
      console.log('output - ', options.output);

      (async () => {
        await tracing(url,
            options.output);
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program.parse(process.argv);
