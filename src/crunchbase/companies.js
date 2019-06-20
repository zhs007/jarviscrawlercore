const {attachJarvisCrawlerCore} = require('../utils');

/**
 * cbcompanies
 * @param {object} browser - browser
 * @param {string} company - company name
 */
async function cbcompanies(browser, company) {
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

  // console.log('haha');

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

  // await attachJQuery(page);
  // await attachJarvisCrawlerCore(page);

  // const companies = await page
  //     .evaluate(() => {
  //       const table = getElement('table');
  //       if (table) {
  //         const companies = [];
  //         for (let i = 0; i < table.children.length; ++i) {
  //           const cl = table.children[i];
  //           const co = {
  //             name: cl.children[0].innerText,
  //             batch: cl.children[1].innerText,
  //             info: cl.children[2].innerText,
  //           };

  //           const urlobj = cl.children[0].getElementsByTagName('a');
  //           if (urlobj.length > 0) {
  //             co.url = urlobj[0].href;
  //           }

  //           companies.push(co);
  //         }

  //         console.log(companies);

  //         return;
  //       }
  //     })
  //     .catch((err) => {
  //       console.log('yccompanies.evaluate', err);
  //     });

  // console.log(companies);

  // await page.click('.toplevel.jrxsg');
}

exports.cbcompanies = cbcompanies;
