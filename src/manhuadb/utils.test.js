'use strict';

const {parseBookURL} = require('./utils');

test('manhuadb.utils', () => {
  const ret = parseBookURL('https://www.manhuadb.com/manhua/154/522_5654.html');

  expect(ret.comicid).toBe('154');
  expect(ret.bookid).toBe('522_5654');
});
