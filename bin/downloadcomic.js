#!/usr/bin/env node

const program = require('commander');
const {manhuadbDownloadComic} = require('../src/manhuadb/downloadcomic');
const {manhuaguiDownloadComic} = require('../src/manhuagui/downloadcomic');
const log = require('../src/log');

program
    .command('downloadcomic [comicid]')
    .description('download comic')
    .option('-o, --output [filename]', 'export output file')
    .option('-t, --type [type]', 'export type')
    .option('-d, --debug [isdebug]', 'debug mode')
    .option('-s, --source [source]', 'source')
    .option('-b, --bookid [bookid]', 'bookid')
    .action(function(comicid, options) {
      const isdebug = options.debug === 'true';
      log.console('debug - ', isdebug);

      const output = options.output;
      log.console('output - ', output);

      let roottype = -1;
      if (options.type) {
        try {
          const rt = parseInt(options.type);
          roottype = rt;
        } catch (err) {
          log.warn('type must be an integer');
        }
      }

      let bookid = '';
      if (options.bookid) {
        bookid = options.bookid;
      }

      let source = 'manhuadb';
      if (options.source) {
        source = options.source;
      }

      (async () => {
        if (source == 'manhuadb') {
          await manhuadbDownloadComic(isdebug, comicid, bookid, roottype, output);
        } else if (source == 'manhuagui') {
          await manhuaguiDownloadComic(
              isdebug,
              comicid,
              bookid,
              roottype,
              output,
          );
        }

        process.exit(-1);
      })().catch((err) => {
        log.console('catch a err ', err);

        process.exit(-1);
      });
    });

program.parse(process.argv);
