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
}

exports.cblogin = cblogin;
