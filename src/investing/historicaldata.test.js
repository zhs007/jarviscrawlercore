'use strict';

const {parsePrice, parseVolume} = require('./historicaldata');

test('investing.parsePrice', () => {
  expect(parsePrice('123')).toBe(123);
  expect(parsePrice('12.3')).toBe(12.3);
  expect(parsePrice('1,234.5')).toBe(1234.5);
});

test('investing.parseVolume', () => {
  expect(parseVolume('123')).toBe(123);
  expect(parseVolume('12.3')).toBe(12);
  expect(parseVolume('1,234.5')).toBe(1234);
  expect(parseVolume('12.3M')).toBe(12300000);
  expect(parseVolume('12.3B')).toBe(12300000000);
});
