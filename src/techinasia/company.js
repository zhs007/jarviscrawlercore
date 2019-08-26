/**
 * techinasiaCompany - techinasia company
 * @param {object} browser - browser
 * @param {string} company - company
 * @return {object} ret - {error, obj}
 */
async function techinasiaCompany(browser, company) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page
      .goto('https://www.techinasia.com/companies/' + company)
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('techinasiaCompany.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.top-container').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('techinasiaCompany.waitForSelector .top-container', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const ret = await page.$eval('.top-container', (ele) => {
    console.log(ele);

    const ret = {};

    const lsth1 = ele.getElementsByTagName('h1');
    if (lsth1 && lsth1.length > 0) {
      ret.name = lsth1[0].innerText;
    }

    const lstavatar = ele.getElementsByClassName('avatar');
    if (lstavatar && lstavatar.length > 0) {
      const lstimg = lstavatar[0].getElementsByTagName('img');
      if (lstimg && lstimg.length > 0) {
        ret.avatar = lstimg[0].src;
      }
    }

    const lstspan = ele.getElementsByTagName('span');
    if (lstspan && lstspan.length > 0 && lstspan.length == 6) {
      const lstlocation = lstspan[1].innerText.split(',', -1);
      ret.location = [];
      for (let i = lstlocation.length - 1; i >= 0; i--) {
        const curloc = lstlocation[i].trim();
        ret.location.push(curloc);
      }

      const strtag = lstspan[3].innerText
          .replace(/\(/g, ',')
          .replace(/\)/g, ',')
          .split(',', -1);
      ret.categories = [];
      for (let i = 0; i < strtag.length; i++) {
        const curtag = strtag[i].trim();
        if (curtag.length > 0) {
          ret.categories.push(curtag);
        }
      }

      const lstemployees = lstspan[5].innerText.split('-', -1);
      ret.employees = parseInt(lstemployees[lstemployees.length - 1]);
    }

    const lstul = ele.getElementsByTagName('ul');
    if (lstul && lstul.length > 0) {
      ret.links = [];
      const lsta = lstul[0].getElementsByTagName('a');
      for (let i = 0; i < lsta.length; ++i) {
        ret.links.push(lsta[i].href);
      }
    }

    const lstp = ele.getElementsByTagName('p');
    if (lstp && lstp.length == 4) {
      ret.introduction = lstp[3].innerText;
    }

    return ret;
  }).catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('techinasiaCompany.eval input', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.techinasiaCompany = techinasiaCompany;
