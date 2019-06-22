/**
 * cblogin
 * @param {object} browser - browser
 * @param {string} email - email
 * @param {string} password - password
 */
async function cblogin(browser, email, password) {
  const page = await browser.newPage();
  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        console.log('cbcompanies.setViewport', err);
      });

  await page.goto('https://www.crunchbase.com/').catch((err) => {
    console.log('cbcompanies.goto', err);
  });

  await page.waitFor(3000);

  await page
      .waitForFunction(() => {
        const objs = document.getElementsByTagName('multi-search');
        if (objs.length > 0) {
          return true;
        }

        return false;
      })
      .catch((err) => {
        console.log('cbcompanies.waitForFunction:multi-search', err);
      });

  await page.type('input', company, {delay: 100});
  await page.keyboard.press('Enter');

  await page
      .waitForFunction(() => {
        const objs = document.getElementsByTagName('results-info');
        if (objs.length > 0) {
          if (objs[0].innerText.indexOf(' 1-5 ') == 0) {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        console.log('cbcompanies.waitForFunction:component--results-info', err);
      });

  const companies = await page.$$eval(
      '.cb-link.component--field-formatter.field-type-identifier.ng-star-inserted',
      (objs) => {
        console.log(objs);

        const companies = [];
        for (let i = 0; i < objs.length; ++i) {
          if (
            objs[i].href.indexOf('https://www.crunchbase.com/organization/') == 0
          ) {
            companies.push({
              name: objs[i].innerText,
              href: objs[i].href,
            });
          }
        }

        console.log(companies);

        return companies;
      }
  );

  console.log(companies);

  for (let i = 0; i < companies.length; ++i) {
    if (
      companies[i].href ==
        'https://www.crunchbase.com/organization/' + company
    ) {
      console.log(companies[i]);
    }
  }
}

exports.cblogin = cblogin;

