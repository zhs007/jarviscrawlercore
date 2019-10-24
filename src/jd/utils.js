/**
 * parsePercent - percent string to percent
 * @param {string} percent - percent is like 97.5%
 * @return {object} ret - {err, percent}
 */
function parsePercent(percent) {
  try {
    const lst = percent.split('%');
    return {percent: parseFloat(lst[0])};
  } catch (err) {
    return {err: err};
  }
}

/**
 * parseMoney - money string to float
 * @param {string} money - money is like ￥97.5
 * @return {object} ret - {err, money}
 */
function parseMoney(money) {
  try {
    const lst = money.split('￥');
    if (lst.length > 1) {
      return {money: parseFloat(lst[1])};
    }

    return {money: parseFloat(lst[0])};
  } catch (err) {
    return {err: err};
  }
}

/**
 * checkBan - check if page is ban
 * @param {object} page - page
 * @param {string} url - url
 * @param {function} onban - onban()
 */
function checkBan(page, url, onban) {
  page.on('framenavigated', (frame) => {
    if (frame == page.mainFrame()) {
      if (frame.url().indexOf(url) == 0) {
        return;
      }

      if (frame.url().indexOf('https://www.jd.com/') == 0) {
        onban();
      }
    }
  });
}

exports.parsePercent = parsePercent;
exports.parseMoney = parseMoney;
exports.checkBan = checkBan;
