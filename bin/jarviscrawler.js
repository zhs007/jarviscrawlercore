const program = require('commander');
const {startBrowser} = require('../src/browser');
const {exportArticle} = require('../src/exportarticle/exportarticle');
const {tracing} = require('../src/tracing/tracing');
const {confluencebot} = require('../src/confluencebot/confluencebot');
const {googletranslate} = require('../src/googletranslate/googletranslate');
const {amazoncn} = require('../src/amazon/amazon');
const {kaola} = require('../src/kaola/kaola');
const {yccompanies} = require('../src/yc/yccompanies');
const {blobimg} = require('../src/playngo/blobimg');
const {startService} = require('../src/service/service');
const {getArticleList} = require('../src/articlelist/articlelist');
const {dtbkbot} = require('../src/dtbkbot/dtbkbot');
const {cbcompanies} = require('../src/crunchbase/companies');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
const VERSION = package.version;

program.version(VERSION);

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
    .option('-d, --debug [isdebug]', 'debug mode')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url || !options.output) {
        console.log(
            'command wrong, please type ' + 'jarviscrawler exparticle --help'
        );

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

      const images = options.images === 'true';
      if (options.mode == 'pdf' || options.mode == 'pb') {
        console.log('images - ', images);
      }

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      const jquery = options.jquery === 'true';
      console.log('jquery - ', jquery);

      const debugmode = options.debug === 'true';
      console.log('debug - ', debugmode);

      (async () => {
        const browser = await startBrowser(headless);

        await exportArticle(
            browser,
            url,
            options.output,
            options.mode,
            options.pdfformat,
            options.jpgquality,
            jquery,
            images,
            debugmode
        );

        if (!debugmode) {
          await browser.close();
        }
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
        console.log(
            'command wrong, please type ' + 'jarviscrawler tracing --help'
        );

        return;
      }

      console.log('url - ', url);
      console.log('output - ', options.output);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        await tracing(url, options.output, headless);
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
        console.log(
            'command wrong, please type ' + 'jarviscrawler confluencebot --help'
        );

        return;
      }

      console.log('cfgfile - ', cfgfile);
      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        await confluencebot(cfgfile, headless);
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('googletranslate [text]')
    .description('google translate')
    .option('-s, --srclang [language]', 'source language')
    .option('-d, --destlang [language]', 'destination language')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(text, options) {
      console.log('version is ', VERSION);

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

program
    .command('startservice [cfgfile]')
    .description('start a grpc service')
    .action(function(cfgfile, options) {
      console.log('version is ', VERSION);

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

program
    .command('amazon [mode]')
    .description('amazon')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(mode, options) {
      console.log('version is ', VERSION);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        const browser = await startBrowser(headless);

        await amazoncn(browser, mode);

      // await browser.close();
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('kaola [mode]')
    .description('kaola')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(mode, options) {
      console.log('version is ', VERSION);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        const browser = await startBrowser(headless);

        await kaola(browser, mode);

      // await browser.close();
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('getarticles [url]')
    .description('get articles')
    .option('-o, --output [filename]', 'export output file')
    .option('-h, --headless [isheadless]', 'headless mode')
    .option('-q, --jquery [isattach]', 'attach jquery')
    .option('-d, --debug [isdebug]', 'debug mode')
    .action(function(url, options) {
      console.log('version is ', VERSION);

      if (!url || !options.output) {
        console.log(
            'command wrong, please type ' + 'jarviscrawler exparticle --help'
        );

        return;
      }

      console.log('url - ', url);

      if (options.output) {
        console.log('output - ', options.output);
      }

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      const jquery = options.jquery === 'true';
      console.log('jquery - ', jquery);

      const debugmode = options.debug === 'true';
      console.log('debug - ', debugmode);

      (async () => {
        const browser = await startBrowser(headless);

        await getArticleList(browser, url, options.output, jquery, debugmode);

        if (!debugmode) {
          await browser.close();
        }
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('dtbkbot [cfgfile]')
    .description('I am a dtbk bot')
    .option('-h, --headless [isheadless]', 'headless mode')
    .option('-d, --debug [isdebug]', 'debug mode')
    .option('-m, --mode [mode]', 'mode')
    .option('-s, --starttime [starttime]', 'starttime')
    .option('-e, --endtime [endtime]', 'endtime')
    .action(function(cfgfile, options) {
      console.log('version is ', VERSION);

      if (!cfgfile || !options.mode) {
        console.log(
            'command wrong, please type ' + 'jarviscrawler dtbkbot --help'
        );

        return;
      }

      console.log('cfgfile - ', cfgfile);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      const debugmode = options.debug === 'true';
      console.log('debug - ', debugmode);

      (async () => {
        const browser = await startBrowser(headless);

        await dtbkbot(
            browser,
            cfgfile,
            debugmode,
            options.mode,
            options.starttime,
            options.endtime
        );

        if (!debugmode) {
          await browser.close();
        }
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('yc [mode]')
    .description('yc')
    .option('-h, --headless [isheadless]', 'headless mode')
    .action(function(mode, options) {
      console.log('version is ', VERSION);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        const browser = await startBrowser(headless);

        await yccompanies(browser, mode);

      // await browser.close();
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('playngo [mode]')
    .description('playngo')
    .option('-h, --headless [isheadless]', 'headless mode')
    .option('-g, --gamecode [gamecode]', 'gamecode')
    .action(function(mode, options) {
      console.log('version is ', VERSION);

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      if (!options.gamecode) {
        console.log(
            'command wrong, please type ' + 'jarviscrawler dtbkbot --help'
        );

        return;
      }

      (async () => {
        const browser = await startBrowser(headless);

        await blobimg(browser, options.gamecode, './output');

      // await browser.close();
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program
    .command('crunchbase [mode]')
    .description('crunchbase')
    .option('-h, --headless [isheadless]', 'headless mode')
    .option('-c, --company [company]', 'company name')
    .action(function(mode, options) {
      console.log('version is ', VERSION);

      if (!options.company) {
        console.log(
            'command wrong, please type ' + 'jarviscrawler crunchbase --help'
        );

        return;
      }

      const headless = options.headless === 'true';
      console.log('headless - ', headless);

      (async () => {
        const browser = await startBrowser(headless);

        await cbcompanies(browser, options.company);

      // await browser.close();
      })().catch((err) => {
        console.log('catch a err ', err);

        if (headless) {
          process.exit(-1);
        }
      });
    });

program.parse(process.argv);
