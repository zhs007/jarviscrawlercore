const log = require('../log');

/**
 * oabt
 * @param {object} browser - browser
 * @param {object} page - page
 * @param {string} url - oabt url
 */
async function oabt(browser, page, url) {
  log.debug('oabt');

  const lst = await page.$$eval('li', (eles) => {
    console.log(eles.length);

    for (let i = 0; i < eles.length; ++i) {
      let id = '';
      let magnet = '';
      let ed2k = '';

      const attr = eles[i].attributes;
      for (let j = 0; j < attr.length; ++j) {
        if (attr[j].name == 'data-id') {
          id = attr[j].value;
        }

        if (attr[j].name == 'data-magnet') {
          magnet = attr[j].value;
        }

        if (attr[j].name == 'data-ed2k') {
          ed2k = attr[j].value;
        }
      }

      if (id) {
        console.log(id + ' ' + magnet + ' ' + ed2k);
      }

      if (eles[i].children.length == 3) {
        console.log(eles[i].children[1].innerText);
      }
    }
  });
}

exports.oabt = oabt;
