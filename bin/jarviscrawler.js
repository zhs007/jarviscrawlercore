#!/usr/bin/env node

const program = require('commander');
const { startBrowser } = require('../src/browser');
const { exportArticle } = require('../src/exportarticle/exportarticle');
const { tracing } = require('../src/tracing/tracing');
const { confluencebot } = require('../src/confluencebot/confluencebot');
const { amazoncn } = require('../src/amazon/amazon');
const { kaola } = require('../src/kaola/kaola');
const { yccompanies } = require('../src/yc/yccompanies');
const { blobimg } = require('../src/playngo/blobimg');
const { getArticleList } = require('../src/articlelist/articlelist');
const { dtbkbotexec } = require('../src/dtbkbot/exec');
const { serviceexec } = require('../src/service/exec');
const { googletranslateexec } = require('../src/googletranslate/exec');
const { crunchbaseexec } = require('../src/crunchbase/exec');
const { btexec } = require('../src/bt/exec');
const { doubanexec } = require('../src/douban/exec');
const { execAnalysis } = require('../src/analysis/exec');
const { execGeoIP } = require('../src/geoip/exec');
const { execTinypng } = require('../src/tinypng/exec');
const { execTechInAsia } = require('../src/techinasia/exec');
const { execSteepAndCheap } = require('../src/steepandcheap/exec');
const { execMountainSteals } = require('../src/mountainsteals/exec');
const { execJD } = require('../src/jd/exec');
const { execJRJ } = require('../src/jrj/exec');
const { execAlimama } = require('../src/alimama/exec');
const { execTmall } = require('../src/tmall/exec');
const fs = require('fs');
const log = require('../src/log');

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
    log.console('version is ', VERSION);

    if (!url || !options.output) {
      log.console(
        'command wrong, please type ' + 'jarviscrawler exparticle --help'
      );

      return;
    }

    log.console('url - ', url);

    if (options.output) {
      log.console('output - ', options.output);
    }

    if (options.mode) {
      log.console('mode - ', options.mode);
    } else {
      options.mode = 'pb';
    }

    if (options.mode == 'pdf') {
      if (!options.pdfformat) {
        options.pdfformat = 'A4';
      }

      log.console('pdfformat - ', options.pdfformat);
    } else if (options.mode == 'jpg') {
      if (!options.jpgquality) {
        options.jpgquality = 60;
      } else {
        options.jpgquality = parseInt(options.jpgquality);
      }

      log.console('jpgquality - ', options.jpgquality);
    }

    const images = options.images === 'true';
    if (options.mode == 'pdf' || options.mode == 'pb') {
      log.console('images - ', images);
    }

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    const jquery = options.jquery === 'true';
    log.console('jquery - ', jquery);

    const debugmode = options.debug === 'true';
    log.console('debug - ', debugmode);

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
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    if (!url || !options.output) {
      log.console(
        'command wrong, please type ' + 'jarviscrawler tracing --help'
      );

      return;
    }

    log.console('url - ', url);
    log.console('output - ', options.output);

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    (async () => {
      await tracing(url, options.output, headless);
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    if (!cfgfile) {
      log.console(
        'command wrong, please type ' + 'jarviscrawler confluencebot --help'
      );

      return;
    }

    log.console('cfgfile - ', cfgfile);
    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    (async () => {
      await confluencebot(cfgfile, headless);
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    (async () => {
      const browser = await startBrowser(headless);

      await amazoncn(browser, mode);

      // await browser.close();
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    (async () => {
      const browser = await startBrowser(headless);

      await kaola(browser, mode);

      // await browser.close();
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    if (!url || !options.output) {
      log.console(
        'command wrong, please type ' + 'jarviscrawler exparticle --help'
      );

      return;
    }

    log.console('url - ', url);

    if (options.output) {
      log.console('output - ', options.output);
    }

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    const jquery = options.jquery === 'true';
    log.console('jquery - ', jquery);

    const debugmode = options.debug === 'true';
    log.console('debug - ', debugmode);

    (async () => {
      const browser = await startBrowser(headless);

      await getArticleList(browser, url, options.output, jquery, debugmode);

      if (!debugmode) {
        await browser.close();
      }
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    (async () => {
      const browser = await startBrowser(headless);

      await yccompanies(browser, mode);

      // await browser.close();
    })().catch(err => {
      log.console('catch a err ', err);

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
    log.console('version is ', VERSION);

    const headless = options.headless === 'true';
    log.console('headless - ', headless);

    if (!options.gamecode) {
      log.console(
        'command wrong, please type ' + 'jarviscrawler playngo --help'
      );

      return;
    }

    (async () => {
      const browser = await startBrowser(headless);

      await blobimg(browser, options.gamecode, './output');

      // await browser.close();
    })().catch(err => {
      log.console('catch a err ', err);

      if (headless) {
        process.exit(-1);
      }
    });
  });

dtbkbotexec(program, VERSION);
serviceexec(program, VERSION);
googletranslateexec(program, VERSION);
crunchbaseexec(program, VERSION);
btexec(program, VERSION);
doubanexec(program, VERSION);

execAnalysis(program, VERSION);
execGeoIP(program, VERSION);
execTinypng(program, VERSION);
execTechInAsia(program, VERSION);
execSteepAndCheap(program, VERSION);
execJRJ(program, VERSION);
execMountainSteals(program, VERSION);
execJD(program, VERSION);
execAlimama(program, VERSION);
execTmall(program, VERSION);

program.parse(process.argv);
