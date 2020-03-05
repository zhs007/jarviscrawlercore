// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthersEx} = require('../page.utils');

/**
 * tmtpostNewsFlashes - tmtpost newsflashes
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function tmtpostNewsFlashes(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthersEx(page, (req) => {
    const url = req.url();
    if (url.indexOf('openx.net') >= 0) {
      return true;
    }

    return false;
  });

  const waitAllResponse = new WaitAllResponse(page);

  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmtpostNewsFlashes.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = 'https://www.tmtpost.com/nictation';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('tmtpostNewsFlashes.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('tmtpostNewsFlashes.waitDone timeout');

    log.error('tmtpostNewsFlashes.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.word_list', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lstli = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lstli.length; ++i) {
            const curnode = {};

            if (!lstli[i].id) {
              break;
            }

            const lsttitle = lstli[i].getElementsByClassName('w_tit');
            if (lsttitle.length > 0) {
              curnode.title = lsttitle[0].innerText;
            }

            const lsta = lstli[i].getElementsByTagName('a');
            if (lsta.length > 0) {
              curnode.url = lsta[0].href;
            }

            lst.push(curnode);
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('tmtpostNewsFlashes.$$eval .word_list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: lst};

  return {ret: ret};
}

exports.tmtpostNewsFlashes = tmtpostNewsFlashes;
