/**
   * oabt
   * @param {object} browser - browser
   * @param {object} page - page
   * @param {string} url - oabt url
   */
async function oabt(browser, page, url) {
  await page.evaluate(() => {
    const jrxsg = getElementWithText('.toplevel', '今日限时购');
    if (jrxsg) {
      // 增加class，方便一次定位
      // Increase class for easy positioning
      jrxsg.className = 'toplevel jrxsg';
      // 取消新窗口打开
      // Cancel new window open
      jrxsg.removeAttribute('target');
    }
  }).catch((err) => {
    console.log('kaola.evaluate', err);
  });

  await page.click('.toplevel.jrxsg');
}

exports.oabt = oabt;

