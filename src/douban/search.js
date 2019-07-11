const {sleep} = require('../utils');
const {WaitURLResponse} = require('../waiturlresponse');
const {WaitDomContentLoaded} = require('../waitfordomcontentloaded');

/**
 * douban search
 * @param {object} browser - browser
 * @param {string} type - type, it is like movie
 * @param {string} str - str
 * @param {bool} debugmode - debugmode
 * @return {object} result - {error: err, ret: ret}
 */
async function search(browser, type, str, debugmode) {
  const page = await browser.newPage();

  const waitURL = new WaitURLResponse(page);
  const waitdomloaded = new WaitDomContentLoaded(page);

  await waitdomloaded.wait(async () => {
    if (type == 'movie') {
      await page.goto('https://movie.douban.com/').catch((err) => {
        console.log('douban.search.goto', err);
      });
    } else {
      await page.goto('https://www.douban.com/').catch((err) => {
        console.log('douban.search.goto', err);
      });
    }
  }, 3 * 60 * 1000);

  // while (true) {
  //   if (isloaded) {
  //     break;
  //   }

  //   await sleep(1000);
  // }

  await page.$eval('.inp', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchinput';
    }
  });

  await page.type('.searchinput', str);

  await page.$eval('.inp-btn', (ele) => {
    const inputSearch = ele.getElementsByTagName('input');
    if (inputSearch.length > 0) {
      inputSearch[0].className = 'searchbtn';
    }
  });

  await waitdomloaded.wait(async () => {
    await page.click('.searchbtn');
  }, 3 * 60 * 1000);

  // waitURL.wait4URL(
  //     'https://movie.douban.com/subject_search?search_text',
  //     () => {},
  //     3 * 60 * 1000
  // );

  const lst = await page.$$eval('img.cover', (eles) => {
    const lst = [];
    for (let i = 0; i < eles.length; ++i) {
      const pe = eles[i].parentNode;
      lst.push(pe.href);
    }

    console.log(lst);

    return lst;
  });

  console.log(lst);

  if (!debugmode) {
    await page.close();
  }

  return ret;
}

exports.search = search;
