const {sleep} = require('../utils');

/**
 * resetPage - reset jobs page
 * @param {object} page - page
 * @return {error} err - error
 */
async function resetPage(page) {
  try {
    let urlchanged = false;
    const mainframe = await page.mainFrame();
    const onframenavigated = (frame) => {
      if (mainframe == frame) {
        const url = frame.url();

        if (url == 'https://www.techinasia.com/jobs/search') {
          urlchanged = true;
        }
      }
    };

    page.on('framenavigated', onframenavigated);

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

      while (true) {
        if (urlchanged) {
          break;
        }

        await sleep(1000);
      }

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

    page.removeListener('framenavigated', onframenavigated);

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
 * @return {object} ret - {error, ret}
 */
async function techinasiaJobs(browser, jobnums) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page.goto('https://www.techinasia.com/jobs/search').catch((err) => {
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

  const ret = await page.$$eval('article', (eles) => {
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
  }).catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    console.log('techinasiaJobs.eval article', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.techinasiaJobs = techinasiaJobs;
