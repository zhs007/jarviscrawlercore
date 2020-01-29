'use strict';

const {parseBookURL, isValidURL} = require('./utils');

test('manhuadb.utils.parseBookURL', () => {
  const ret = parseBookURL('https://www.manhuadb.com/manhua/154/522_5654.html');

  expect(ret.comicid).toBe('154');
  expect(ret.bookid).toBe('522_5654');
});

test('manhuadb.utils.isValidURL', () => {
  expect(isValidURL()).toBe(false);
  expect(isValidURL('')).toBe(false);
  expect(isValidURL(0)).toBe(false);
  expect(isValidURL('123')).toBe(false);
  expect(isValidURL('http')).toBe(false);
  expect(isValidURL('http:')).toBe(false);
  expect(isValidURL('http://')).toBe(false);
  expect(isValidURL('http://123')).toBe(true);
});
