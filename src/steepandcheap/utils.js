const {isElementVisible} = require('../eleutils');

/**
 * closeEMailSignUpWrap - close email-signup-modal-wrap
 * @param {object} page - page
 * @return {error} err - error
 */
async function closeEMailSignUpWrap(page) {
  let awaiterr;

  const lstdialog = await page.$$('.email-signup-modal-wrap').catch((err) => {
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
  } else {
    return await closeEMailSignUpModal(page);
  }

  return undefined;
}

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
  } else {
    return await closeEMailSignUpWrap(page);
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
    return await closeEMailSignUpWrap(page);
  }

  return undefined;
}

/**
 * isValidProductURL - isValidProductURL
 * @param {string} url - url
 * @return {boolean} isValid - is valid product url
 */
function isValidProductURL(url) {
  const purl = new URL(url);
  const skid = purl.searchParams.get('skid');
  return typeof skid == 'string' && skid != '';
}

exports.closeDialog = closeDialog;
exports.isValidProductURL = isValidProductURL;
