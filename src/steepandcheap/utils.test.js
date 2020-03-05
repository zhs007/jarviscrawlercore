'use strict';

const {isValidProductURL} = require('./utils');

test('steepandcheap.isValidProductURL', () => {
  expect(isValidProductURL('https://www.steepandcheap.com/rc/the-north-face-on-sale?skid=')).toBe(false);
  expect(isValidProductURL('https://www.steepandcheap.com/the-north-face-beyond-the-wall-free-motion-bra-womens?skid=TNF049R-TNFBK-XS')).toBe(true);
});
