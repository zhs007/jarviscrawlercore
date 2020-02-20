'use strict';

const {parseID} = require('./utils');

test('hao6v.parseID', () => {
  expect(parseID('http://www.hao6v.com/gq/2012-03-18/17668.html')).toBe('/gq/2012-03-18/17668.html');
  expect(parseID('http://www.hao6v.com/dy/2020-01-21/DaoJuShi.html')).toBe('/dy/2020-01-21/DaoJuShi.html');
  expect(parseID('http://www.hao6v.com/dy/2020-02-11/DLTDQHMX.html')).toBe('/dy/2020-02-11/DLTDQHMX.html');
});
