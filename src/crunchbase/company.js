const {reCAPTCHA, procCAPTCHA} = require('./utils');
const {
  mouseMove,
  mouseMoveToEle,
  mouseMoveToEleEx,
  mouseClickEle,
  mouseMoveToFrameEleEx,
  mouseClickFrameEleEx,
  mouseHoldFrameEleEx,
  sleep,
} = require('../utils');
const log = require('../log');

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
        log.error('cbcompany.setViewport', err);
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

  log.debug('cbcompany.reCAPTCHA ' + recaptcha);

  if (recaptcha) {
    await sleep(10 * 1000);

    await procCAPTCHA(
        browser,
        page,
        'https://www.crunchbase.com/organization/' + company
    );
  }

  // await page
  //     .goto('https://www.crunchbase.com/organization/' + company, {
  //       waitUntil: 'domcontentloaded',
  //       timeout: 0,
  //     })
  //     .catch((err) => {
  //       console.log('cbcompany.goto', err);
  //     });

  log.debug('haha');

  let x = 10;
  const y = 50;
  while (true) {
    // console.log(x);

    // await mouseMove(page, 330, 50, 330, 50);
    // await page.mouse.move(330, 50);
    await mouseMoveToEle(page, '.mat-button.ng-star-inserted');

    // await page.mouse.down();
    // await page.waitFor(3 * 1000);
    // await page.mouse.up();

    // await page.mouse.click(x, y);

    x += 10;

    // await page.mouse.up();

    if (x > 500) {
      x = 10;
    }

    await page.waitFor(3 * 1000);

    // await page.mouse.move(472, 568 - 196);
    await mouseMoveToEle(
        page,
        '.cb-link.component--field-formatter.field-type-integer.ng-star-inserted'
    );

    await page.waitFor(3 * 1000);

    // await mouseClickEle(
    //     page,
    //     '.cb-link.component--field-formatter.field-type-integer.ng-star-inserted'
    // );

    // await page.waitFor(3 * 1000);

    await mouseHoldFrameEleEx(
        page,
        'a',
        async (frame) => {
          if (frame.url().indexOf('tradingview.com') > 0) {
            return true;
          }

          return false;
        },
        async (ele) => {
          const jshref = await ele.getProperty('href');
          const href = await jshref.toString();
          // console.log(href);

          if (href && href.indexOf('tradingview.com/') > 0) {
            return true;
          }

          return false;
        },
        3 * 1000
    );

    // const frames = await page.frames();
    // for (let i = 0; i < frames.length; ++i) {
    //   if (frames[i].url().indexOf('tradingview.com') > 0) {
    //     console.log(frames[i].url());

    //     const lsta = await frames[i].$$('a');
    //     console.log(lsta.length);
    //     for (let j = 0; j < lsta.length; ++j) {
    //       const ele = lsta[j];
    //       const jshref = await ele.getProperty('href');
    //       const href = await jshref.toString();
    //       console.log(href);

    //       if (href && href.indexOf('tradingview.com/') > 0) {
    //         const bbox = await ele.boundingBox();
    //         console.log(bbox);
    //         await page.mouse.move(
    //             bbox.x + bbox.width / 2,
    //             bbox.y + bbox.height / 2
    //         );

    //         await page.waitFor(1000);
    //         await page.mouse.click(
    //             bbox.x + bbox.width / 2,
    //             bbox.y + bbox.height / 2
    //         );
    //         // await page.mouse.down();
    //         // await page.waitFor(1000);
    //         // await page.mouse.up();

    //         break;
    //       }
    //     }
    //   }
    // }

    // await mouseMoveToEleEx(page, 'a', async (ele) => {
    //   const jshref = await ele.getProperty('href');
    //   const href = await jshref.toString();
    //   console.log(href);

    //   if (href && href.indexOf('tradingview.com/') > 0) {
    //     return true;
    //   }

    //   return false;
    // });

    await page.waitFor(3 * 1000);

    // break;
  }

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

  return cbobj;
}

exports.cbcompany = cbcompany;
