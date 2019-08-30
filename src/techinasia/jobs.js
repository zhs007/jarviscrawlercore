const {WaitFrameNavigated} = require('../waitframenavigated');
const {WaitAllResponse} = require('../waitallresponse');

/**
 * resetPage - reset jobs page
 * @param {object} page - page
 * @return {error} err - error
 */
async function resetPage(page) {
  try {
    const mainframe = await page.mainFrame();
    const waitreset = new WaitFrameNavigated(page, mainframe, async (frame) => {
      const url = frame.url();

      return url == 'https://www.techinasia.com/jobs/search';
    });
    // let urlchanged = false;
    // const mainframe = await page.mainFrame();
    // const onframenavigated = (frame) => {
    //   if (mainframe == frame) {
    //     const url = frame.url();

    //     if (url == 'https://www.techinasia.com/jobs/search') {
    //       urlchanged = true;
    //     }
    //   }
    // };

    // page.on('framenavigated', onframenavigated);

    let awaiterr = undefined;
    await page.waitForSelector('.wrapper').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    const wrapper = await page.$('.wrapper');
    if (wrapper) {
      const lsta = await wrapper.$$('a');
      if (lsta.length == 1) {
        page.removeListener('framenavigated', onframenavigated);

        return undefined;
      }

      await lsta[lsta.length - 1].click().catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return awaiterr;
      }

      await waitreset.waitDone(3 * 60 * 1000);
      // while (true) {
      //   if (urlchanged) {
      //     break;
      //   }

      //   await sleep(1000);
      // }

      // await page.waitForSelector('.infinite-scroll').catch((err) => {
      //   awaiterr = err;
      // });
      await page.waitForSelector('article').catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return awaiterr;
      }
    }

    waitreset.release();
    // page.removeListener('framenavigated', onframenavigated);

    return awaiterr;
  } catch (err) {
    return err;
  }

  return undefined;
}

/**
 * techinasiaJobs - techinasia jobs
 * @param {object} browser - browser
 * @param {number} jobnums - job nums
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function techinasiaJobs(browser, jobnums, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();
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
    console.log('techinasiaJobs.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await resetPage(page);
  if (awaiterr) {
    console.log('techinasiaJobs.resetPage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let lastjobnums = 0;
  const starttime = Date.now();

  while (true) {
    await waitAllResponse.waitDone(3 * 60 * 1000);
    const lstarticle = await page.$$('article');
    if (lstarticle.length >= 0) {
      if (lstarticle.length >= jobnums) {
        break;
      }

      if (
        lastjobnums == lstarticle.length &&
        Date.now() - starttime >= 3 * 60 * 1000
      ) {
        break;
      }

      lastjobnums = lstarticle.length;

      waitAllResponse.reset();
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
    console.log('techinasiaJobs.eval article', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: {jobs: ret}};
}

exports.techinasiaJobs = techinasiaJobs;
