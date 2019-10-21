const log = require('../log');

/**
 * onRightFrameLoaded GDR
 * @param {object} rightFrame - rightFrame
 */
async function onRightFrameLoadedGDR(rightFrame) {
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
        log.error('onRightFrameLoadedGDR', err);
      });
}

/**
 * Game Today Data Summary
 * @param {object} page - page
 * @param {object} leftFrame - leftFrame
 * @param {object} rightFrame - rightFrame
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 */
async function getGameDataReport(
    page,
    leftFrame,
    rightFrame,
    starttime,
    endtime
) {
  // 打开一级菜单
  await leftFrame.click('.title.bbtj');

  // 等待一级菜单打开
  await leftFrame
      .waitForFunction(() => {
        const bbtjmenu = getElement('.menuson.bbtj');
        if (bbtjmenu) {
          if (bbtjmenu.style[0] === 'display') {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameDataReport.waitFor.menuson.bbtj', err);
      });

  //   await leftFrame.waitFor(3000);

  // 点击二级菜单
  await leftFrame.click('.yxbb');

  //   // 等待页面跳转完成
  //   await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
  //     console.log('catch a err ', err);
  //   });

  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const placeul = getElement('.placeul');
          if (
            placeul &&
          placeul.children.length == 3 &&
          placeul.children[2].innerText == '游戏报表'
          ) {
            const paginList = getElement('.paginList');
            if (paginList) {
              const paginListI = paginList.getElementsByTagName('I');
              if (paginListI.length > 0) {
                if (parseInt(paginListI[0].innerText) > 0) {
                  paginListI[0].className = 'blue recordnums';
                  return true;
                }
              }
            }
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameDataReport.waitFor.paginList', err);
      });

  await rightFrame.$eval(
      '#startTime',
      (ele, starttime) => {
        ele.value = starttime;
      },
      starttime
  );

  await rightFrame.$eval(
      '#endTime',
      (ele, endtime) => {
        ele.value = endtime;
      },
      endtime
  );

  await rightFrame.$eval('#size.select3', (ele) => {
    ele.value = '5000';
  });

  //   await rightFrame.type('#startTime', '2019-04-16');
  //   await rightFrame.type('#endTime', '2019-04-16');

  await rightFrame.click('.scbtn.cx');

  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const recordnums = getElement('.blue.recordnums');
          if (recordnums == undefined) {
            const placeul = getElement('.placeul');
            if (
              placeul &&
            placeul.children.length == 3 &&
            placeul.children[2].innerText == '游戏报表'
            ) {
              const paginList = getElement('.paginList');
              if (paginList) {
                const paginListI = paginList.getElementsByTagName('I');
                if (paginListI.length > 0) {
                  if (parseInt(paginListI[0].innerText) > 0) {
                    paginListI[0].className = 'blue recordnums';
                    return true;
                  }
                }
              }
            }
          }
        }

        return false;
      })
      .catch((err) => {
        log.error('getGameDataReport.waitFor.recordnums', err);
      });

  const recordnums = await rightFrame.$eval('.blue.recordnums', (ele) => {
    return parseInt(ele.innerText);
  });

  console.log('recordnums - ' + recordnums);

  const lst = await rightFrame.$$eval('tr', (eles) => {
    const lst = [];

    if (eles[1].children.length == 12) {
      for (let i = 1; i < eles.length - 2; ++i) {
        lst.push({
          businessid: eles[i].children[1].innerText,
          gamecode: eles[i].children[2].innerText,
          totalWin: parseFloat(eles[i].children[4].innerText),
          totalBet: parseFloat(eles[i].children[5].innerText),
          gameNums: parseInt(eles[i].children[9].innerText),
          currency: eles[i].children[10].innerText,
        });

        if (eles[i].children.length == 12) {
        } else if (eles[i].children.length == 11) {
          lst.push({
            businessid: eles[i].children[0].innerText,
            gamecode: eles[i].children[1].innerText,
            totalWin: parseFloat(eles[i].children[3].innerText),
            totalBet: parseFloat(eles[i].children[4].innerText),
            gameNums: parseInt(eles[i].children[8].innerText),
            currency: eles[i].children[9].innerText,
          });
        }
      }
    } else if (eles[1].children.length == 11) {
      for (let i = 2; i < eles.length - 1; ++i) {
        lst.push({
          businessid: eles[i].children[0].innerText,
          gamecode: eles[i].children[1].innerText,
          totalWin: parseFloat(eles[i].children[3].innerText),
          totalBet: parseFloat(eles[i].children[4].innerText),
          gameNums: parseInt(eles[i].children[8].innerText),
          currency: eles[i].children[9].innerText,
        });
      }
    }

    return lst;
  });

  // console.log('records - %j', lst);

  return lst;
}

exports.onRightFrameLoadedGDR = onRightFrameLoadedGDR;
exports.getGameDataReport = getGameDataReport;
