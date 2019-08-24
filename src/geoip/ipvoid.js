/**
 * isEmptyValue - geoip with ipvoid
 * @param {string} str - value
 * @return {bool} ret - is empty value
 */
function isEmptyValue(str) {
  if (str == '') {
    return true;
  }

  if (str.toLowerCase() == 'unknown') {
    return true;
  }

  return false;
}

const OBJTITLE = [
  'organization',
  'asn',
  'continent',
  'country',
  'region',
  'city',
  'hostname',
];

/**
 * ipvoidgeoip - geoip with ipvoid
 * @param {object} browser - browser
 * @param {string} ipaddr - ipaddr
 * @return {object} ret - {error, latitude, longitude, organization, asn, continent, country, region, city, hostname}
 */
async function ipvoidgeoip(browser, ipaddr) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  await page.goto('https://www.ipvoid.com/ip-geolocation/').catch((err) => {
    awaiterr = err;
    // console.log('ipvoidgeoip.goto', err);
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('#ipAddr').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.waitForSelector input', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.btn.btn-primary').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.waitForSelector btn', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.type('#ipAddr', ipaddr).catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.type', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.click('.btn.btn-primary').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.click', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.form-control.textarea').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('ipvoidgeoip.waitForSelector result', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const retstr = await page.$eval('.form-control.textarea', (ele) => {
    console.log(ele);

    if (ele) {
      return ele.innerHTML;
    }

    return '';
  });

  let ret = undefined;

  if (retstr) {
    // console.log(retstr);

    if (retstr[0] == '"') {
      retstr = retstr.substr(1);
    }

    if (retstr[retstr.length - 1] == '"') {
      retstr = retstr.substr(0, -2);
    }

    // console.log(retstr);

    const lines = retstr.split('\n');

    // console.log(lines);
    ret = {};

    for (let i = 0; i < lines.length; ++i) {
      const curarr = lines[i].split(':');
      if (curarr.length > 1) {
        const t = curarr[0].trim().toLowerCase();
        let v = curarr[1].trim();
        if (curarr.length > 2) {
          for (let j = 2; j < curarr.length; ++j) {
            v += ':' + curarr[j].trim();
          }
        }

        if (t == 'latitude\\longitude') {
          const asixarr = v.split('/');
          if (asixarr.length == 2) {
            ret.latitude = parseFloat(asixarr[0].trim());
            ret.longitude = parseFloat(asixarr[1].trim());
          }
        } else {
          for (let k = 0; k < OBJTITLE.length; ++k) {
            if (t == OBJTITLE[k]) {
              if (!isEmptyValue(v)) {
                ret[OBJTITLE[k]] = v;
              }
            }
          }
        }
      }
    }
  }

  await page.close();

  return ret;
}

exports.ipvoidgeoip = ipvoidgeoip;
