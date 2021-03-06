const {newDTTodayGameData} = require('../utils');
const log = require('../log');

/**
 * onRightFrameLoaded GTDS
 * @param {object} rightFrame - rightFrame
 */
async function onRightFrameLoadedGTDS(rightFrame) {
  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const btncx = getElementWithDefaultValue('.scbtn', '查询');
          if (btncx) {
            btncx.className = 'scbtn cx';

            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('onRightFrameLoadedGTDS', err);
      });
}

/**
 * Game Today Data Summary
 * @param {object} page - page
 * @param {object} leftFrame - leftFrame
 * @param {object} rightFrame - rightFrame
 */
async function getGameTodayDataSummary(page, leftFrame, rightFrame) {
  // 打开一级菜单
  await leftFrame.click('.title.jlxx');

  // 等待一级菜单打开
  await leftFrame
      .waitForFunction(() => {
        const jlxxmenu = getElement('.menuson.jlxx');
        if (jlxxmenu) {
          if (jlxxmenu.style[0] === 'display') {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameTodayDataSummary:waitFor.menuson.jlxx', err);
      });

  // 点击二级菜单
  await leftFrame.click('.yxjl');

  //   // 等待页面跳转完成
  //   await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
  //     log.error('catch a err ', err);
  //   });

  //   await rightFrame.goto(cfg.url + '/log/bets!findAll.html');

  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const placeul = getElement('.placeul');

          //   console.log(placeul);
          //   if (placeul) {
          //     console.log(placeul.children.length);

          //     if (placeul.children.length == 3) {
          //       console.log(placeul.children[2].innerText);
          //     }
          //   }

          if (
            placeul &&
          placeul.children.length == 3 &&
          placeul.children[2].innerText == '游戏记录'
          ) {
            const btncx = getElementWithDefaultValue('.scbtn', '查询');
            if (btncx) {
              btncx.className = 'scbtn cx';

              return true;
            }
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameTodayDataSummary:waitFor.yxjl', err);
      });

  await rightFrame.click('.scbtn.cx');

  await rightFrame.waitFor(60 * 1000 * 3);

  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const btncx = getElementWithDefaultValue('.scbtn', '查询');
          //   console.log(btncx);

          if (btncx) {
            const paginList = getElement('.paginList');
            // console.log(paginList);

            if (paginList) {
              const paginListI = paginList.getElementsByTagName('I');
              //   console.log(paginListI.length);

              if (paginListI.length > 0) {
              // console.log(paginListI[0].innerText);

                if (parseInt(paginListI[0].innerText) > 0) {
                  paginListI[0].className = 'blue gamenums';
                  return true;
                }
              }
            }
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameTodayDataSummary:waitFor.paginList', err);
      });

  const gamenums = await rightFrame.$eval('.blue.gamenums', (ele) => {
    return parseInt(ele.innerText);
  });

  const {bet, win} = await rightFrame.$$eval('tr', (eles) => {
    if (eles.length > 2) {
      const curtr = eles[eles.length - 1];
      if (curtr.children.length == 6) {
        return {
          bet: parseFloat(curtr.children[2].innerText.replace(/,/g, '')),
          win: parseFloat(curtr.children[3].innerText.replace(/,/g, '')),
        };
      }
    }
  });

  log.debug('gamenums - ' + gamenums);
  log.debug('bet - ' + bet);
  log.debug('win - ' + win);

  return newDTTodayGameData({
    gameNums: gamenums,
    totalBet: bet,
    totalWin: win,
  });
}

exports.onRightFrameLoadedGTDS = onRightFrameLoadedGTDS;
exports.getGameTodayDataSummary = getGameTodayDataSummary;
