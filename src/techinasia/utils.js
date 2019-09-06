const {WaitFrameNavigated} = require('../waitframenavigated');

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
        // page.removeListener('framenavigated', onframenavigated);

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

exports.resetPage = resetPage;
