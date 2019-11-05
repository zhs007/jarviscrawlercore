const {isElementVisible} = require('../eleutils');

/**
 * closeEMailSignUpModal - close email-signup-modal
 * @param {object} page - page
 * @return {error} err - error
 */
async function closeEMailSignUpModal(page) {
  let awaiterr;

  const lstdialog = await page
      .$$('.email-signup-modal__container')
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return awaiterr;
  }

  if (lstdialog.length > 0) {
    const isVisible = await isElementVisible(page, lstdialog[0]);

    if (!isVisible) {
      return undefined;
    }

    const btns = await lstdialog[0].$$('button').catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      return awaiterr;
    }

    if (btns.length > 0) {
      await btns[0].click().catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        return awaiterr;
      }
    }
  }

  return undefined;
}

/**
 * closeDialog - close dialog
 * @param {object} page - page
 * @return {error} err - error
 */
async function closeDialog(page) {
  let awaiterr;

  const lstdialog = await page.$$('.ui-dialog').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    return awaiterr;
  }

  if (lstdialog.length > 0) {
    const btns = await lstdialog[0].$$('button').catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      return awaiterr;
    }

    if (btns.length > 0) {
      await btns[0].click().catch((err) => {
        awaiterr = err;
      });

      if (awaiterr) {
        return awaiterr;
      }
    }
  } else {
    return await closeEMailSignUpModal(page);
  }

  return undefined;
}

exports.closeDialog = closeDialog;
