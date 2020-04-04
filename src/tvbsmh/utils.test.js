'use strict';

const {parseBookURL, isValidURL} = require('./utils');

test('tvbsmh.utils.parseBookURL', () => {
  const ret = parseBookURL('https://www.tvbsmh.com/series-nnnny-496797-5');

  expect(ret.comicid).toBe('nnnny');
  expect(ret.bookid).toBe('496797');
});

test('tvbsmh.utils.parseBookURL 2', () => {
  const ret = parseBookURL(
      'https://www.tvbsmh.com/series-nnnny-496797-6-%E7%8E%8B%E8%80%85%E5%A4%A9%E4%B8%8B',
  );

  expect(ret.comicid).toBe('nnnny');
  expect(ret.bookid).toBe('496797');
});

test('tvbsmh.utils.isValidURL', () => {
  expect(isValidURL()).toBe(false);
  expect(isValidURL('')).toBe(false);
  expect(isValidURL(0)).toBe(false);
  expect(isValidURL('123')).toBe(false);
  expect(isValidURL('http')).toBe(false);
  expect(isValidURL('http:')).toBe(false);
  expect(isValidURL('http://')).toBe(false);
  expect(isValidURL('http://123')).toBe(true);
});
