const {reCAPTCHA} = require('./utils');

/**
 * cbcompany
 * @param {object} browser - browser
 * @param {string} company - company name
 */
async function cbcompany(browser, company) {
  const page = await browser.newPage();
  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        console.log('cbcompany.setViewport', err);
      });

  // page.on('framenavigated', (frame) => {
  //   console.log('framenavigated ' + frame.name() + ' ' + frame.url());
  // });

  // page.on('load', () => console.log('Page loaded!'));
  // page.on('domcontentloaded', () => console.log('Page domcontentloaded!'));
  // page.on('response', async (response) => {
  //   // if (response.status())
  //   console.log('response ' + response.status() + ' ' + response.url());

  //   // if ('https://www.crunchbase.com/v4/cb/sessions' == response.url()) {
  //   //   const str = await response.text();
  //   //   console.log(str);
  //   // }
  //   // if (response.url().indexOf('/api/v1/collector') > 0) {
  //   // const str = await response.text();
  //   // if (str.length < 512) {
  //   //   console.log(str);
  //   // }
  //   // }
  // });

  // page.on('requestfinished', (request) => {
  //   console.log(request.url());

  //   // if ('https://www.crunchbase.com/v4/cb/sessions' == request.url()) {
  //   //   const str = request.response().text();
  //   //   console.log(str);
  //   // }
  // });

  const recaptcha = await reCAPTCHA(
      browser,
      page,
      'https://www.crunchbase.com/organization/' + company
  );

  console.log('cbcompany.reCAPTCHA ' + recaptcha);

  // await page
  //     .goto('https://www.crunchbase.com/organization/' + company, {
  //       waitUntil: 'domcontentloaded',
  //       timeout: 0,
  //     })
  //     .catch((err) => {
  //       console.log('cbcompany.goto', err);
  //     });

  console.log('haha');

  const cbobj = await page
      .$$eval('.layout-row.section-header.ng-star-inserted', (objs) => {
        console.log(objs);

        const nameobj = document.getElementsByClassName('cb-overflow-ellipsis');

        const cbobj = {};

        if (nameobj.length > 0) {
          cbobj.name = nameobj[0].innerText;
        }

        for (let i = 0; i < objs.length; ++i) {
          const curobj = objs[i];

          //   console.log(curobj.innerText);

          if (curobj.innerText == 'Overview') {
            const lsteles = curobj.parentElement.getElementsByClassName(
                'cb-text-color-medium field-label flex-100 flex-gt-sm-25 ng-star-inserted'
            );

            // console.log(lsteles);

            for (let j = 0; j < lsteles.length; ++j) {
              const cursubobj = lsteles[j];

              console.log(cursubobj.innerText);
              console.log(cursubobj.nextElementSibling.innerText);

              if (cursubobj.innerText == 'Categories ') {
                cbobj.categories = cursubobj.nextElementSibling.innerText.split(
                    ', '
                );
              } else if (cursubobj.innerText == 'Headquarters Regions ') {
                cbobj.headquartersregions = cursubobj.nextElementSibling.innerText.split(
                    ', '
                );
              } else if (cursubobj.innerText == 'Founded Date ') {
                cbobj.foundeddate = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Founders ') {
                cbobj.founders = cursubobj.nextElementSibling.innerText.split(
                    ', '
                );
              } else if (cursubobj.innerText == 'Operating Status ') {
                cbobj.operatingstatus = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Funding Status ') {
                cbobj.fundingstatus = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Last Funding Type ') {
                cbobj.lastfundingtype = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Legal Name ') {
                cbobj.legalname = cursubobj.nextElementSibling.innerText;
              }
            }
          } else if (curobj.innerText == 'IPO & Stock Price') {
            const lsteles = curobj.parentElement.getElementsByClassName(
                'cb-text-color-medium field-label flex-100 flex-gt-sm-25 ng-star-inserted'
            );

            // console.log(lsteles);

            for (let j = 0; j < lsteles.length; ++j) {
              const cursubobj = lsteles[j];

              console.log(cursubobj.innerText);
              console.log(cursubobj.nextElementSibling.innerText);

              if (cursubobj.innerText == 'Stock Symbol ') {
                cbobj.stocksymbol = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Valuation at IPO ') {
                cbobj.valuationipo = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'Money Raised at IPO ') {
                cbobj.moneyraisedipo = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'IPO Share Price ') {
                cbobj.priceipo = cursubobj.nextElementSibling.innerText;
              } else if (cursubobj.innerText == 'IPO Date ') {
                cbobj.dateipo = cursubobj.nextElementSibling.innerText;
              }
            }
          } else if (curobj.innerText == 'Funding Rounds') {
            const lsteles = curobj.parentElement.getElementsByTagName('tr');

            // console.log(lsteles);

            if (lsteles.length > 1) {
              cbobj.fundingrounds = [];

              for (let j = 0; j < lsteles.length; ++j) {
                const cursubobj = lsteles[j];

                if (cursubobj.className == 'ng-star-inserted') {
                  const lsttds = cursubobj.getElementsByTagName('td');

                  if (lsttds.length >= 5) {
                    const fundinground = {
                      announceddate: lsttds[0].innerText,
                      transactionname: lsttds[1].innerText.split(' - ')[0],
                      investors: lsttds[4].innerText.split(', '),
                    };

                    if (lsttds[3].innerText != '—') {
                      fundinground.moneyraised = lsttds[3].innerText;
                    }

                    cbobj.fundingrounds.push(fundinground);
                  }
                }
              }
            }
          }
        }

        return cbobj;
      })
      .catch((err) => {
        console.log(
            'cbcompany.$$eval:.layout-row.section-header.ng-star-inserted',
            err
        );
      });

  cbobj.code = company;

  console.log(cbobj);
}

exports.cbcompany = cbcompany;
