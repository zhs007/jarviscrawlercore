'use strict';

const {parseBookURL, isValidURL} = require('./utils');

test('manhuagui.utils.parseBookURL', () => {
  const ret = parseBookURL(
      'https://www.manhuagui.com/comic/1769/15446.html?p=123',
  );

  expect(ret.comicid).toBe('1769');
  expect(ret.bookid).toBe('15446');
});

test('manhuagui.utils.isValidURL', () => {
  expect(isValidURL()).toBe(false);
  expect(isValidURL('')).toBe(false);
  expect(isValidURL(0)).toBe(false);
  expect(isValidURL('123')).toBe(false);
  expect(isValidURL('http')).toBe(false);
  expect(isValidURL('http:')).toBe(false);
  expect(isValidURL('http://')).toBe(false);
  expect(isValidURL('http://123')).toBe(true);
});
