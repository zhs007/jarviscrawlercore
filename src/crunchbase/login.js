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
        console.log('cblogin.setViewport', err);
      });

  await page
      .goto('https://www.crunchbase.com/login', {
        waitUntil: 'domcontentloaded',
        timeout: 0,
      })
      .catch((err) => {
        console.log('cblogin.goto', err);
      });

  // console.log('haha');

  await page
      .waitForFunction(() => {
        if (
          document.getElementById('mat-input-1') &&
        document.getElementById('mat-input-2')
        ) {
          const btns = document.getElementsByClassName(
              'cb-text-transform-upper mat-raised-button mat-primary'
          );
          if (btns.length > 0) {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        console.log('cblogin.waitForFunction', err);
      });

  // console.log('haha1');

  await page.type('#mat-input-1', email);
  await page.type('#mat-input-2', password);
  await page.click('.cb-text-transform-upper.mat-raised-button.mat-primary');

  // console.log('haha2');
}

exports.cblogin = cblogin;
