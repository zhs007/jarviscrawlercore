/**
 * getMainClassName - get main class name
 * @param {object} page - page
 * @return {string} classname - class name
 */
async function getMainClassName(page) {
  let awaiterr;
  const classname = await page
      .$$eval('.site-main-content', (eles) => {
        if (eles.length > 0) {
          const lstheader = eles[0].getElementsByTagName('header');
          if (lstheader.length > 0) {
            return lstheader[0].nextElementSibling.className;
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return undefined;
  }

  return classname;
}

/**
 * getTag - get tag
 * @param {object} page - page
 * @param {object} ele - element
 * @param {number} timeout - timeout
 * @return {object} ret - {tag, lstsub}
 */
async function getTag(page, ele, timeout) {
  let awaiterr;

  const ret = {};
  const innerText = await ele.getProperty('innerText');
  if (innerText) {
    ret.tag = await innerText.jsonValue().trim();
  }

  await ele.click().catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    return undefined;
  }

  await page
      .waitForSelector('.dropdown', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return undefined;
  }

  ret.lstsub = await page
      .$$eval('.dropdown', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          const lsta = eles[0].getElementsByTagName('a');
          if (lsta.length > 0) {
            for (let i = 0; i < lsta.length; ++i) {
              if (lsta[i].childNodes.length == 3) {
                lst.push(lsta[i].childNodes[1].nodeValue.trim());
              }
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
    return undefined;
  }

  return ret;
}

/**
 * techinasiaJobTag - techinasia job tag
 * @param {object} browser - browser
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function techinasiaJobTag(browser, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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
    console.log('techinasiaJobTag.setViewport', awaiterr);

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

  await page
      .goto('https://www.techinasia.com/jobs/search', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('techinasiaJobsType.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const mainclassname = await getMainClassName(page);
  if (!mainclassname) {
    await page.close();

    return {error: 'techinasiaJobsType.getMainClassName error'};
  }

  const lstclass = mainclassname.trim().split(' ', -1);
  const newclassname = '.' + lstclass.join('.');

  const lstcontainer = await page.$$(newclassname);
  if (lstcontainer.length == 3) {
    const lstclickable = await lstcontainer[2].$$('.clickable');
    const ret = {tags: []};

    for (let i = 0; i < lstclickable.length; ++i) {
      const curtag = await getTag(page, lstclickable[i], timeout);
      if (curtag == undefined) {
        await page.close();

        return {error: 'techinasiaJobsType.getTag error'};
      }

      ret.tags.push(curtag);
    }

    await page.close();

    return ret;
  }

  await page.close();

  return {error: 'no data'};
}

exports.techinasiaJobTag = techinasiaJobTag;
