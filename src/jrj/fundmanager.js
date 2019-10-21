const log = require('../log');

/**
 * parseTime - parse time
 * @param {string} strtime - strtime
 * @return {int64} time - time
 */
function parseTime(strtime) {
  try {
    const ct = new Date(strtime).getTime();
    return Math.floor(ct / 1000);
  } catch (err) {
    return undefined;
  }
}

/**
 * jrjFundManager - jrj fund manager
 * @param {object} browser - browser
 * @param {string} code - fund code
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jrjFundManager(browser, code, timeout) {
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
    log.error('jrjFundManager.setViewport', awaiterr);

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

  // if (pageid > 1) {
  //   url += '&page=' + (pageid - 1).toString();
  // }

  // const ret = {};

  await page
      .goto('http://fund.jrj.com.cn/archives,' + code + ',jjjl.shtml', {
        timeout: timeout,
        waitUntil: 'domcontentloaded',
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFundManager.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret1 = await page
      .$$eval('.stb', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret1 = {};
          const lsttd = eles[0].getElementsByTagName('td');
          if (lsttd.length == 7) {
            ret1.name = lsttd[0].innerText;
            ret1.strStartTime = lsttd[1].innerText;
            ret1.strSex = lsttd[2].innerText;
            ret1.strBirthYear = lsttd[3].innerText;
            ret1.education = lsttd[4].innerText;
            ret1.country = lsttd[5].innerText;
            ret1.resume = lsttd[6].innerText;
          }

          return ret1;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFundManager.$$eval .stb', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (!ret1) {
    log.error('jrjFundManager.no ret1');

    await page.close();

    return {error: 'jrjFundManager.no ret1'};
  }

  const ret2 = await page
      .$$eval('.htb1', (eles) => {
        console.log(eles);

        if (eles.length > 0) {
          const ret2 = [];

          const lsttr = eles[0].getElementsByTagName('tr');
          for (let i = 1; i < lsttr.length; ++i) {
            const lsttd = lsttr[i].getElementsByTagName('td');
            if (lsttd.length == 8) {
              const curmgr = {};

              curmgr.name = lsttd[0].innerText;
              curmgr.strStartTime = lsttd[1].innerText;
              curmgr.strEndTime = lsttd[2].innerText;
              curmgr.strSex = lsttd[3].innerText;
              curmgr.strBirthYear = lsttd[4].innerText;
              curmgr.education = lsttd[5].innerText;
              curmgr.country = lsttd[6].innerText;
              curmgr.resume = lsttd[7].innerText;

              ret2.push(curmgr);
            }
          }

          return ret2;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jrjFund.$$eval .htb1', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const arr = [];

  if (ret1) {
    const curmgr = {};

    curmgr.name = ret1.name;
    curmgr.startTime = parseTime(ret1.strStartTime);
    curmgr.sex = ret1.strSex == '男';
    curmgr.birthYear = parseTime(ret1.strBirthYear);
    curmgr.education = ret1.education;
    curmgr.country = ret1.country;
    curmgr.resume = ret1.resume;

    arr.push(curmgr);
  }

  if (ret2) {
    for (let i = 0; i < ret2.length; ++i) {
      const curmgr = {};

      curmgr.name = ret2[i].name;
      curmgr.startTime = parseTime(ret2[i].strStartTime);
      curmgr.endTime = parseTime(ret2[i].strEndTime);
      curmgr.sex = ret2[i].strSex == '男';
      curmgr.birthYear = parseTime(ret2[i].strBirthYear);
      curmgr.education = ret2[i].education;
      curmgr.country = ret2[i].country;
      curmgr.resume = ret2[i].resume;

      arr.push(curmgr);
    }
  }

  return {ret: {managers: arr}};
}

exports.jrjFundManager = jrjFundManager;
