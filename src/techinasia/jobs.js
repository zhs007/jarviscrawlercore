const {WaitFrameNavigated} = require('../waitframenavigated');
const {WaitAllResponse} = require('../waitallresponse');
const {sleep} = require('../utils');
const {resetPage} = require('./utils');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');

/**
 * getMainTagElement - get main tag element
 * @param {object} page - page
 * @param {string} maintag - main tag
 * @return {object} ele - element
 */
async function getMainTagElement(page, maintag) {
  try {
    let awaiterr;

    const lstclickable = await page.$$('.clickable').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('getMainTagElement.$$ ' + awaiterr);
      return undefined;
    }

    for (let i = 0; i < lstclickable.length; ++i) {
      const innerText = await lstclickable[i].getProperty('innerText');
      if (innerText) {
        let curit = await innerText.jsonValue();
        if (curit) {
          curit = curit.toString().trim();
          curit = curit.toLowerCase();

          if (curit == maintag) {
            return lstclickable[i];
          }
        }
      }
    }
  } catch (err) {
    log.error('getMainTagElement ' + err);
    return undefined;
  }

  return undefined;
}

/**
 * getSubTagElement - get sub tag element
 * @param {object} page - page
 * @param {string} subtag - sub tag
 * @return {object} ele - element
 */
async function getSubTagElement(page, subtag) {
  try {
    let awaiterr;

    const lstdropdown = await page.$$('.dropdown').catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('getSubTagElement ' + awaiterr);
      return undefined;
    }

    if (lstdropdown.length > 0) {
      const lsta = await lstdropdown[0].$$('a');
      if (lsta.length > 0) {
        for (let i = 0; i < lsta.length; ++i) {
          const innerText = await lsta[i].getProperty('innerText');
          if (innerText) {
            let curit = await innerText.jsonValue();
            if (curit) {
              curit = curit.toString().trim();
              curit = curit.toLowerCase();

              const arr = curit.split('\n', -1);

              if (arr[0] == subtag) {
                return lsta[i];
              }
            }
          }
        }
      }
    }
  } catch (err) {
    log.error('getSubTagElement ' + err);
    return undefined;
  }

  return undefined;
}

/**
 * selectTag - select tag
 * @param {object} page - page
 * @param {string} maintag - main tag
 * @param {string} subtag - sub tag
 * @param {number} timeout - timeout
 * @return {error} err - error
 */
async function selectTag(page, maintag, subtag, timeout) {
  if (!maintag || !subtag) {
    return undefined;
  }

  try {
    let awaiterr;
    maintag = maintag.toLowerCase();
    subtag = subtag.toLowerCase();

    const mainframe = await page.mainFrame();
    const waitreset = new WaitFrameNavigated(page, mainframe, async (frame) => {
      const url = frame.url();

      return url.indexOf('https://www.techinasia.com/jobs/search') == 0;
    });

    const mtele = await getMainTagElement(page, maintag);
    if (mtele) {
      await mtele.click().catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        return awaiterr;
      }

      await page
          .waitForFunction(
              () => {
                const lstdropdown = document.getElementsByClassName('dropdown');
                if (lstdropdown.length > 0) {
                  const lsta = lstdropdown[0].getElementsByTagName('a');
                  if (lsta.length > 1) {
                    return true;
                  }
                }

                return false;
              },
              {timeout: timeout},
          )
          .catch((err) => {
            awaiterr = err;
          });

      if (awaiterr) {
        return awaiterr;
      }

      await sleep(3 * 1000);

      const stele = await getSubTagElement(page, subtag);
      if (stele) {
        await stele.click().catch((err) => {
          awaiterr = err;
        });

        if (awaiterr) {
          return awaiterr;
        }

        const isdone = await waitreset.waitDone(timeout);
        if (!isdone) {
          return 'selectTag.waitreset.waitDone timeout';
        }

        waitreset.release();
      }
    }

    return undefined;
  } catch (err) {
    return err;
  }

  return undefined;
}

/**
 * techinasiaJobs - techinasia jobs
 * @param {object} browser - browser
 * @param {number} jobnums - job nums
 * @param {string} maintag - main tag
 * @param {string} subtag - sub tag
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function techinasiaJobs(browser, jobnums, maintag, subtag, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);

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
    log.error('techinasiaJobs.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }
  // await page.setRequestInterception(true);
  // page.on('request', async (req) => {
  //   const rt = req.resourceType();
  //   if (rt == 'image' || rt == 'media' || rt == 'font') {
  //     await req.abort();

  //     return;
  //   }

  //   await req.continue();
  // });

  const waitAllResponse = new WaitAllResponse(page);
  await page
      .goto('https://www.techinasia.com/jobs/search', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('techinasiaJobs.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await resetPage(page);
  if (awaiterr) {
    log.error('techinasiaJobs.resetPage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await selectTag(page, maintag, subtag, timeout);
  if (awaiterr) {
    log.error('techinasiaJobs.selectTag', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let lastjobnums = 0;
  const starttime = Date.now();
  let lastresettime = Date.now();
  let lastnums = 0;

  while (true) {
    await waitAllResponse.waitDone(timeout);
    const lstarticle = await page.$$('article');
    if (lstarticle.length >= 0) {
      if (!waitAllResponse.hasNewRequest()) {
        if (Date.now() - lastresettime >= 5 * 1000) {
          break;
        }
      }

      if (lstarticle.length >= jobnums) {
        break;
      }

      if (
        lastjobnums == lstarticle.length &&
        Date.now() - starttime >= timeout
      ) {
        break;
      }

      lastjobnums = lstarticle.length;

      waitAllResponse.reset();
      if (lastnums != lstarticle.length) {
        lastresettime = Date.now();
        lastnums = lstarticle.length;
      }

      await lstarticle[lstarticle.length - 1].hover();
    }
  }

  const ret = await page
      .$$eval('article', (eles) => {
        console.log(eles);

        const ret = [];

        for (let i = 0; i < eles.length; ++i) {
          const curjob = {};

          const lsttitle = eles[i].getElementsByClassName('title');
          if (lsttitle && lsttitle.length > 0) {
            const lsta = lsttitle[0].getElementsByTagName('a');
            if (lsta && lsta.length > 0) {
              const lstarr = lsta[0].href.split('/', -1);
              curjob.jobCode = lstarr[lstarr.length - 1];
            }
          }

          const lstli = eles[i].getElementsByTagName('li');
          if (lstli && lstli.length == 3) {
            curjob.subType = [];

            const lstsubtype = lstli[1].innerText.split(',', -1);
            for (let j = 0; j < lstsubtype.length; ++j) {
              curjob.subType.push(lstsubtype[j].trim());
            }
          }

          ret.push(curjob);
        }

        return ret;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('techinasiaJobs.eval article', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: {jobs: ret}};
}

exports.techinasiaJobs = techinasiaJobs;
