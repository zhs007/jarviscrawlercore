const {reCAPTCHA} = require('./utils');
const log = require('../log');

/**
 * cblogin
 * @param {object} browser - browser
 * @param {string} email - email
 * @param {string} password - password
 */
async function cblogin(browser, email, password) {
  // browser.on('targetchanged', () => {
  //   console.log('targetchanged!');
  // });

  const page = await browser.newPage();
  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        log.error('cblogin.setViewport', err);
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

  // page.on('requestfailed', (request) => {
  //   console.log('requestfailed ' + request.response().status + ' ' + request.url());

  //   // if ('https://www.crunchbase.com/v4/cb/sessions' == request.url()) {
  //   //   const str = request.response().text();
  //   //   console.log(str);
  //   // }
  // });

  // await page
  //     .goto('https://www.crunchbase.com/login', {
  //       waitUntil: 'domcontentloaded',
  //       timeout: 0,
  //     })
  //     .catch((err) => {
  //       console.log('cblogin.goto', err);
  //     });

  const recaptcha = await reCAPTCHA(
      browser,
      page,
      'https://www.crunchbase.com/login'
  );

  log.debug('cbcompany.reCAPTCHA ' + recaptcha);

  // console.log('haha');

  await page
      .waitForFunction(() => {
        console.log(document.getElementById('mat-input-1'));
        console.log(document.getElementById('mat-input-2'));

        if (
          document.getElementById('mat-input-1') &&
        document.getElementById('mat-input-2')
        ) {
          const btns = document.getElementsByClassName(
              'cb-text-transform-upper mat-raised-button mat-primary'
          );

          console.log(btns);

          if (btns.length > 0) {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('cblogin.waitForFunction', err);
      });

  // console.log('haha1');

  await page.type('#mat-input-1', email);
  await page.type('#mat-input-2', password);
  await page.click('.cb-text-transform-upper.mat-raised-button.mat-primary');

  // console.log('haha2');
}

exports.cblogin = cblogin;
