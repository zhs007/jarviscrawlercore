const program = require('commander');
const {exportArticle} = require('../src/exportarticle/exportarticle');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
const VERSION = package.version;

program
    .version(VERSION);

program
    .command('exparticle [url]')
    .description('export article')
    .option('-p, --pdf [filename]', 'export pdf file')
    .option('-f, --pdfformat [format]', 'like A4')
    .option('-j, --jpg [filename]', 'export jpg file')
    .action(function(url, options) {
      console.log('version is ', VERSION);
      //   console.log(url);
      //   console.log(options);

      (async () => {
        await exportArticle(url, options.pdf, options.pdfformat, options.jpg);
      })().catch((err) => {
        console.log('catch a err ', err);
      });
    });

program.parse(process.argv);
