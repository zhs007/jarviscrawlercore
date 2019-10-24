const {sleep} = require('../utils');
const {resetPage} = require('./utils');
const log = require('../log');

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
 * getMainTag - get main tag
 * @param {object} ele - element
 * @return {string} ret - main tag
 */
async function getMainTag(ele) {
  let awaiterr;

  const innerText = await ele.getProperty('innerText').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('getMainTag.getProperty ' + awaiterr);

    return '';
  }

  if (innerText) {
    let tag = await innerText.jsonValue().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('getMainTag.jsonValue ' + awaiterr);

      return '';
    }

    if (tag) {
      tag = tag.toString().trim();
    }

    return tag;
  }

  return '';
}

/**
 * getTag - get tag
 * @param {object} page - page
 * @param {object} ele - element
 * @param {number} timeout - timeout
 * @return {array} lstsub - sub tags
 */
async function getTag(page, ele, timeout) {
  let awaiterr;

  // const ret = {};
  // const innerText = await ele.getProperty('innerText');
  // if (innerText) {
  //   ret.tag = await getMainTag(ele);
  //   if (ret.tag) {
  //     ret.tag = ret.tag.toString().trim();
  //   }
  // }

  await ele.click().catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    log.error('getTag.ele.click ' + awaiterr);

    return undefined;
  }

  await page
      .waitForFunction(
          () => {
            const lstdropdown = document.getElementsByClassName('dropdown');
            if (lstdropdown.length > 0) {
              const lsta = lstdropdown[0].getElementsByTagName('a');
              if (lsta.length > 0) {
                return true;
              }
            }

            return false;
          },
          {timeout: timeout}
      )
      .catch((err) => {
        awaiterr = err;
      });

  // await page
  //     .waitForSelector('.dropdown', {
  //       timeout: timeout,
  //     })
  //     .catch((err) => {
  //       awaiterr = err;
  //     });

  if (awaiterr) {
    log.error('getTag.waitForSelector ' + awaiterr);

    return undefined;
  }

  await sleep(3 * 1000);

  const lstsub = await page
      .$$eval('.dropdown', (eles) => {
        console.log(eles);

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
    log.error('getTag.$$eval ' + awaiterr);

    return undefined;
  }

  // const lstactive = await page.$$('.clickable.active').catch((err) => {
  //   awaiterr = err;
  // });
  // if (awaiterr) {
  //   console.log('getTag.$$.clickable.active ' + awaiterr);

  //   return undefined;
  // }

  // if (lstactive.length > 0) {
  //   await lstactive[0].click().catch((err) => {
  //     awaiterr = err;
  //   });

  //   if (awaiterr) {
  //     console.log('getTag.click.active ' + awaiterr);

  //     return undefined;
  //   }

  //   while (true) {
  //     const lstdropdown = await page.$$('.dropdown').catch((err) => {
  //       awaiterr = err;
  //     });
  //     if (awaiterr) {
  //       console.log('getTag.dropdown ' + awaiterr);

  //       return undefined;
  //     }

  //     await sleep(1000);

  //     if (lstdropdown.length == 0) {
  //       break;
  //     }
  //   }
  // }

  return lstsub;
}

/**
 * getFromContainer - get from container
 * @param {object} page - page
 * @param {object} container - container
 * @param {string} maintag - main tag
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getFromContainer(page, container, maintag, timeout) {
  const lstclickable = await container.$$('.clickable');
  const ret = {tags: []};

  if (!maintag) {
    for (let i = 0; i < lstclickable.length; ++i) {
      const curtag = {};
      curtag.tag = await getMainTag(lstclickable[i]);
      ret.tags.push(curtag);
    }
  } else {
    for (let i = 0; i < lstclickable.length; ++i) {
      const curtag = {};
      curtag.tag = await getMainTag(lstclickable[i]);
      if (curtag.tag.toLowerCase() == maintag.toLowerCase()) {
        curtag.subTags = await getTag(page, lstclickable[i], timeout);
        if (!curtag.subTags) {
          return {error: 'getTag error'};
        }

        ret.tags.push(curtag);

        break;
      }
    }
  }

  return {ret: ret};
}

/**
 * techinasiaJobTag - techinasia job tag
 * @param {object} browser - browser
 * @param {string} maintag - main tag
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function techinasiaJobTag(browser, maintag, timeout) {
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
    log.error('techinasiaJobTag.setViewport', awaiterr);

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
    log.error('techinasiaJobsType.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await resetPage(page);
  if (awaiterr) {
    log.error('techinasiaJobsType.resetPage', awaiterr);

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

  let lstcontainer = await page.$$(newclassname);
  if (lstcontainer.length == 3) {
    const gfcret = await getFromContainer(
        page,
        lstcontainer[2],
        maintag,
        timeout
    );
    if (gfcret.error) {
      log.error('techinasiaJobsType.getFromContainer ', awaiterr);

      await page.close();

      return {error: gfcret.error};
    }

    return {ret: gfcret.ret};
    // const lstclickable = await lstcontainer[2].$$('.clickable');
    // const ret = {tags: []};

    // if (!maintag) {
    //   for (let i = 0; i < lstclickable.length; ++i) {
    //     const curtag = {};
    //     curtag.tag = await getMainTag(lstclickable[i]);
    //     ret.tags.push(curtag);
    //   }
    // } else {
    //   for (let i = 0; i < lstclickable.length; ++i) {
    //     const curtag = {};
    //     curtag.tag = await getMainTag(lstclickable[i]);
    //     if (curtag.tag.toLowerCase() == maintag.toLowerCase()) {
    //       curtag.subTags = await getTag(page, lstclickable[i], timeout);
    //       if (!curtag.subTags) {
    //         await page.close();

    //         return {error: 'getTag error'};
    //       }

    //       ret.tags.push(curtag);

    //       break;
    //     }
    //   }
    // }

    // await page.close();

    // return {ret: ret};
  } else {
    lstcontainer = await page.$$('.jsx-2925957406');
    if (lstcontainer.length == 1) {
      const gfcret = await getFromContainer(
          page,
          lstcontainer[0],
          maintag,
          timeout
      );
      if (gfcret.error) {
        log.error('techinasiaJobsType.getFromContainer ', awaiterr);

        await page.close();

        return {error: gfcret.error};
      }

      return {ret: gfcret.ret};
    }
  }

  await page.close();

  return {error: 'no data'};
}

exports.techinasiaJobTag = techinasiaJobTag;
