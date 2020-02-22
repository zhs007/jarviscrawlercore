// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {parseID} = require('./utils');

/**
 * kotsumetrotokyoSubways - kotsumetrotokyo subwaymap
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function kotsumetrotokyoSubways(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
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
    log.error('kotsumetrotokyoSubways.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl =
    'https://www.kotsu.metro.tokyo.jp/ch_k/services/subway/stations/';

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('kotsumetrotokyoSubways.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('kotsumetrotokyoSubways.waitDone timeout');

    log.error('kotsumetrotokyoSubways.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.selectStation.accordion', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            const lstline = eles[i].getElementsByClassName('route-icon');
            if (lstline.length > 0) {
              const cl = {name: lstline[0].innerText, stations: []};

              const lstli = eles[i].getElementsByTagName('li');
              for (let j = 0; j < lstli.length; ++j) {
                const lsta = lstli[j].getElementsByTagName('a');
                if (lsta.length > 0) {
                  for (let k = 0; k < lsta[0].childNodes.length; ++k) {
                    if (lsta[0].childNodes[k].nodeName == '#text') {
                      cl.stations.push(lsta[0].childNodes[k].nodeValue);
                    }
                  }
                }
              }

              lst.push(cl);
            }
          }

          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('kotsumetrotokyoSubways.$$eval .v2_link', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lines: lst};

  return {ret: ret};
}

exports.kotsumetrotokyoSubways = kotsumetrotokyoSubways;
