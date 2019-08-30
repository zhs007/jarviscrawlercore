/**
 * techinasiaJob - techinasia jobs
 * @param {object} browser - browser
 * @param {string} jobid - jobid
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function techinasiaJob(browser, jobid, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page
      .goto('https://www.techinasia.com/jobs/' + jobid, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('techinasiaJob.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('header.page-header').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('techinasiaJob.waitForSelector header.page-header', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page
      .$eval('header.page-header', (ele) => {
        console.log(ele);

        const ret = {};

        const lsth1 = ele.getElementsByTagName('h1');
        if (lsth1 && lsth1.length > 0) {
          ret.title = lsth1[0].innerText;
        }

        const lsthc = ele.getElementsByClassName('header-content');
        if (lsthc && lsthc.length > 0) {
          const lsta = lsthc[0].getElementsByTagName('a');
          if (lsta && lsta.length > 0) {
            const lsthost = lsta[0].href.split('/', -1);
            ret.companyCode = lsthost[lsthost.length - 1];
          }

          const lstdiv = lsthc[0].getElementsByTagName('div');
          if (lstdiv && lstdiv.length == 3) {
            const lstlocation = lstdiv[1].innerText.split(',', -1);
            ret.location = [];
            for (let i = lstlocation.length - 1; i >= 0; i--) {
              const curloc = lstlocation[i].trim();
              ret.location.push(curloc);
            }

            const lstsalary = lstdiv[2].innerText.split(' ', -1);
            if (lstsalary.length >= 4) {
              ret.currency = lstsalary[0].trim();
              const minsalary = lstsalary[1].replace(/\,/g, '');
              const maxsalary = lstsalary[3].replace(/\,/g, '');
              ret.minSalary = parseInt(minsalary);
              ret.maxSalary = parseInt(maxsalary);
            }
          }

          const lstctreate = lsthc[0].getElementsByClassName('dates__created');
          if (lstctreate && lstctreate.length > 0) {
            if (lstctreate[0].childNodes.length == 2) {
              ret.createTime = Date.parse(lstctreate[0].childNodes[1].innerText);
            }
          }

          const lstupdate = lsthc[0].getElementsByClassName('dates__updated');
          if (lstupdate && lstupdate.length > 0) {
            if (lstupdate[0].childNodes.length == 2) {
              ret.updateTime = Date.parse(lstupdate[0].childNodes[1].innerText);
            }
          }
        }

        const lstb = ele.getElementsByTagName('b');
        if (lstb && lstb.length == 4) {
          ret.jobFunction = lstb[0].innerText;
          ret.jobType = lstb[1].innerText;
          ret.experience = lstb[2].innerText;
          ret.vacancies = parseInt(lstb[3].innerText);
        }

        return ret;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('techinasiaJob.eval header.page-header', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret1 = await page
      .$$eval('section', (eles) => {
        if (eles.length >= 3) {
          const ret1 = {};

          const lstdiv0 = eles[0].getElementsByTagName('div');
          if (lstdiv0 && lstdiv0.length > 0) {
            ret1.description = lstdiv0[0].innerHTML;
          }

          const lstspan = eles[1].getElementsByTagName('span');
          if (lstspan && lstspan.length > 0) {
            ret1.requiredSkills = [];
            for (let i = 0; i < lstspan.length; ++i) {
              ret1.requiredSkills.push(lstspan[i].innerText);
            }
          }

          const lstdiv2 = eles[2].getElementsByTagName('div');
          if (lstdiv2 && lstdiv2.length > 0) {
            ret1.culture = lstdiv2[0].innerHTML;
          }

          return ret1;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('techinasiaJob.eval section', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret1) {
    ret.description = ret1.description;
    ret.requiredSkills = ret1.requiredSkills;
    ret.culture = ret1.culture;
  }

  ret.jobCode = jobid;

  await page.close();

  return {ret: ret};
}

exports.techinasiaJob = techinasiaJob;
