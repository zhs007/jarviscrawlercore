'use strict';

const {parseComicBookURL} = require('./downloadcomic');

test('downloadcomic.parseComicBookURL https://www.manhuagui.com/comic/1769/15446.html?p=123', () => {
  const ret = parseComicBookURL(
      'https://www.manhuagui.com/comic/1769/15446.html?p=123',
  );

  expect(ret.comicid).toBe('1769');
  expect(ret.bookid).toBe('15446');
});

test('downloadcomic.parseComicBookURL https://www.manhuadb.com/manhua/154/522_5654.html', () => {
  const ret = parseComicBookURL(
      'https://www.manhuadb.com/manhua/154/522_5654.html',
  );

  expect(ret.comicid).toBe('154');
  expect(ret.bookid).toBe('522_5654');
});

test('downloadcomic.parseComicBookURL https://www.google.com', () => {
  const ret = parseComicBookURL('https://www.google.com');

  expect(ret instanceof Error).toBe(true);
});
