// const {attachJQuery} = require('../utils');
const { sleep } = require('../utils');
const log = require('../log');

/**
 * google translate
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {number} timeout - timeout in microseconds
 */
async function googletranslate(browser, srctext, srclang, destlang, timeout) {
  let awaiterr = undefined;

  const page = await browser.newPage();
  await page
    .goto(
      'https://translate.google.cn/?sl=' +
        srclang +
        '&tl=' +
        destlang +
        '&op=translate'
    )
    .catch((err) => {
      awaiterr = err;
    });

  if (awaiterr) {
    log.error('googletranslate.goto', awaiterr);

    await page.close();

    return awaiterr.toString();
  }

  await page.waitForSelector('textarea').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('googletranslate.waitForSelector', awaiterr);

    await page.close();

    return awaiterr.toString();
  }

  await page.type('textarea', srctext).catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('googletranslate.type', awaiterr);

    await page.close();

    return awaiterr.toString();
  }

  let curtime = 0;
  let dstText = '';
  while (curtime < timeout) {
    const curText = await page
      .$$eval('c-wiz', (eles) => {
        if (eles.length > 0) {
          for (let i = 0; i < eles.length; ++i) {
            if (eles[i].classList.length == 2) {
              const lstSpan = eles[i].getElementsByTagName('span');
              for (let j = 0; j < lstSpan.length; ++j) {
                const attrs = lstSpan[j].attributes;
                let hasitem = 0;
                for (let k = 0; k < attrs.length; ++k) {
                  if (attrs[k].name == 'data-language-for-alternatives') {
                    hasitem++;
                  } else if (
                    attrs[k].name == 'data-language-to-translate-into'
                  ) {
                    hasitem++;
                  }
                }

                if (hasitem == 2) {
                  if (lstSpan[j].innerText.length > 0) {
                    return lstSpan[j].innerText;
                  }
                }
              }
            }
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });
    if (awaiterr) {
      log.error('googletranslate.$$eval c-wiz', awaiterr);

      await page.close();

      return awaiterr.toString();
    }

    if (curText.length > 0) {
      dstText = curText;

      break;
    }

    await sleep(1000);

    curtime += 1000;
  }

  await page.close();

  return dstText;
}

exports.googletranslate = googletranslate;
