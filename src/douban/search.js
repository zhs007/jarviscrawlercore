const {sleep} = require('../utils');

/**
 * douban search
 * @param {object} browser - browser
 * @param {string} str - str
 * @param {bool} debugmode - debugmode
 * @return {object} result - {error: err, ret: ret}
 */
async function search(browser, str, debugmode) {
  const page = await browser.newPage();
  let isloaded = false;
  page.on('domcontentloaded', async () => {
    console.log('domcontentloaded');

    isloaded = true;
  });

  await page.goto('https://www.douban.com').catch((err) => {
    console.log('douban.search.goto', err);
  });

  while (true) {
    if (isloaded) {
      break;
    }

    await sleep(1000);
  }

  await page.$eval('.inp', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchinput';
    }
  });

  await page.type('.searchinput', str);

  await page.$eval('.bn', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchbtn';
    }
  });

  await page.click('.searchbtn');

  if (!debugmode) {
    await page.close();
  }

  return ret;
}

exports.search = search;
