const {holdBarMove} = require('../captcha.js');

/**
 * closeDialog - close dialog
 * @param {object} page - page
 * @return {error} err - error
 */
async function closeDialog(page) {
  let awaiterr;

  const lstbtn = await page.$$('#sufei-dialog-close').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  if (lstbtn.length > 0) {
    await lstbtn[0].hover();

    await lstbtn[0].click();
  }
  // const frames = await page.frames();
  // for (let i = 0; i < frames.length; ++i) {
  //   if (frames[i]._name == 'sufei-dialog-content') {
  //     const lstbtn = await frames[i].$$('#sufei-dialog-close').catch((err) => {
  //       awaiterr = err;
  //     });
  //     if (awaiterr) {
  //       return awaiterr;
  //     }

  //     if (lstbtn.length > 0) {
  //       await lstbtn[0].hover();

  //       await lstbtn[0].click();
  //     }

  //     return undefined;
  //   }
  // }

  return undefined;
}

/**
 * nocaptcha - nocaptcha
 * @param {object} page - page
 * @return {object} ret - {isnocaptcha, error}
 */
async function nocaptcha(page) {
  let awaiterr;
  const frames = await page.frames();
  for (let i = 0; i < frames.length; ++i) {
    if (frames[i]._name == 'sufei-dialog-content') {
      const lstnocaptcha = await frames[i].$$('#nocaptcha').catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return {error: awaiterr};
      }

      if (lstnocaptcha.length > 0) {
        const lstcoscale = await frames[i].$$('.nc_scale').catch((err) => {
          awaiterr = err;
        });
        if (awaiterr) {
          return {error: awaiterr};
        }

        const lstslide = await frames[i]
            .$$('.nc_iconfont.btn_slide')
            .catch((err) => {
              awaiterr = err;
            });
        if (awaiterr) {
          return {error: awaiterr};
        }

        if (lstslide.length > 0 && lstcoscale.length > 0) {
          const bbbox0 = await lstslide[0].boundingBox();
          const bbbox1 = await lstcoscale[0].boundingBox();

          await holdBarMove(page, bbbox0, bbbox1, 500, Math.floor(1000 / 60));

          return {isnocaptcha: true};
        }
      }
    }
  }

  return {isnocaptcha: false};
}

exports.closeDialog = closeDialog;
exports.nocaptcha = nocaptcha;
