const {attachJarvisCrawlerCore} = require('../utils');
const log = require('../log');

/**
 * yccompanies
 * @param {object} browser - browser
 * @param {string} srctext - source text
 * @param {string} srclang - source language
 * @param {string} destlang - destination language
 * @param {bool} headless - headless modes
 */
async function yccompanies(browser, srctext, srclang, destlang) {
  const page = await browser.newPage();
  await page.goto('https://www.ycombinator.com/companies/', {
    waitUntil: 'networkidle0',
    timeout: 0,
  });

  // await attachJQuery(page);
  await attachJarvisCrawlerCore(page);

  const companies = await page
      .evaluate(() => {
        const table = getElement('table');
        if (table) {
          const companies = [];
          for (let i = 0; i < table.children.length; ++i) {
            const cl = table.children[i];
            const co = {
              name: cl.children[0].innerText,
              batch: cl.children[1].innerText,
              info: cl.children[2].innerText,
            };

            const urlobj = cl.children[0].getElementsByTagName('a');
            if (urlobj.length > 0) {
              co.url = urlobj[0].href;
            }

            companies.push(co);
          }

          console.log(companies);

          return;
        }
      })
      .catch((err) => {
        log.error('yccompanies.evaluate', err);
      });

  log.debug(companies);

  // await page.click('.toplevel.jrxsg');
}

exports.yccompanies = yccompanies;
