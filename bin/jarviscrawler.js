const program = require('commander');
const {exportArticle} = require('../src/exportarticle/exportarticle');
const {tracing} = require('../src/tracing/tracing');
const {confluencebot} = require('../src/confluencebot/confluencebot');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
const VERSION = package.version;

program
    .version(VERSION);

program
    .command('exparticle [url]')
    .description('export article')
    .option('-o, --output [filename]', 'export output file')
    .option('-m, --mode [mode]', 'export mode, like pdf, pb, jpg')
    .option('-f, --pdfformat [format]', 'like A4')
    .option('-h, --headless [isheadless]', 'headless mode')
    .option('-q, --jquery [isattach]', 'attach jquery')
    .option('-j, --jpgquality [quality]', 'jpg quality')
    .option('-i, --images [isoutput]', 'output images')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url || !options.output) {
        console.log('command wrong, please type ' +
          'jarviscrawler exparticle --help');

        return;
      }

      console.log('url - ', url);

      if (options.output) {
        console.log('output - ', options.output);
      }

      if (options.mode) {
        console.log('mode - ', options.mode);
      } else {
        options.mode = 'pb';
      }

      if (options.mode == 'pdf') {
        if (!options.pdfformat) {
          options.pdfformat = 'A4';
        }

        console.log('pdfformat - ', options.pdfformat);
      } else if (options.mode == 'jpg') {
        if (!options.jpgquality) {
          options.jpgquality = 60;
        } else {
          options.jpgquality = parseInt(options.jpgquality);
        }

        console.log('jpgquality - ', options.jpgquality);
      }

      const images = (options.images === 'true');
      if (options.mode == 'pdf' || options.mode == 'pb') {
        console.log('images - ', images);
      }

      const headless = (options.headless === 'true');
      console.log('headless - ', headless);

      const jquery = (options.jquery === 'true');
      console.log('jquery - ', jquery);

      (async () => {
        await exportArticle(url,
            options.output,
            options.mode,
            options.pdfformat,
            options.jpgquality,
            headless,
            jquery,
            images);
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
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url || !options.output) {
        console.log('command wrong, please type ' +
          'jarviscrawler tracing --help');

        return;
      }

      console.log('url - ', url);
      console.log('output - ', options.output);

      const headless = (options.headless === 'true');
      console.log('headless - ', headless);

      (async () => {
        await tracing(url,
            options.output,
            headless);
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('confluencebot [cfgfile]')
    .description('a confluence bot')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(cfgfile, options) {
      console.log('version is ', VERSION);

      if (!cfgfile) {
        console.log('command wrong, please type ' +
          'jarviscrawler confluencebot --help');

        return;
      }

      console.log('cfgfile - ', cfgfile);
      const headless = (options.headless === 'true');
      console.log('headless - ', headless);

      (async () => {
        await confluencebot(cfgfile,
            headless);
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program.parse(process.argv);
