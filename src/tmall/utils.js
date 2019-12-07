// const {sleep} = require('../utils');
// const {WaitAllResponse} = require('../waitallresponse');
// const log = require('../log');

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

exports.closeDialog = closeDialog;
