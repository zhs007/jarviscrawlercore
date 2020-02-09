'use strict';

const {getSubobjectID} = require('./utils');

test('douban.getSubobjectID', () => {
  const id = getSubobjectID('https://book.douban.com/subject/1777861/');

  expect(id).toBe('1777861');
});
