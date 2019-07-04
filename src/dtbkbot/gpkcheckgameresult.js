const {newDTTodayGameData} = require('../utils');

/**
 * onRightFrameLoaded GPKCGR - GPK check gameresult
 * @param {object} rightFrame - rightFrame
 */
async function onRightFrameLoadedGPKCGR(rightFrame) {
  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
      // console.log(typeof jarvisCrawlerCoreVer);

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
        console.log('onRightFrameLoadedGPKCGR', err);
      });
}

/**
 * check GPK game result
 * @param {object} page - page
 * @param {object} leftFrame - leftFrame
 * @param {object} rightFrame - rightFrame
 * @param {WaitRightFrame} waitRightFrame - waitRightFrame
 * @param {string} businessid - businessid
 * @param {string} gamecode - gamecode
 * @param {string} playername - playername
 * @param {string} starttime - start time
 * @param {string} endtime - end time
 */
async function checkGPKGameResult(
    page,
    leftFrame,
    rightFrame,
    waitRightFrame,
    businessid,
    gamecode,
    playername,
    starttime,
    endtime
) {
  // 打开一级菜单
  await leftFrame.click('.title.jlxx');

  // 等待一级菜单打开
  await leftFrame
      .waitForFunction(() => {
        const jlxxmenu = getElement('.menuson.jlxx');
        if (jlxxmenu) {
        //   console.log(jlxxmenu.style[0]);

          if (jlxxmenu.style[0] === 'display') {
            return true;
          }
        }

        return false;
      })
      .catch((err) => {
        console.log('checkGPKGameResult:waitFor.menuson.jlxx', err);
      });

  await waitRightFrame.wait4URL('log/gpkbets!findAll.html', async () => {
    // 点击二级菜单
    await leftFrame.click('.gpkyxjl');
  });

  console.log('haha');

  return undefined;

  // 等待页面加载
  await rightFrame
      .waitForFunction(() => {
        if (typeof jarvisCrawlerCoreVer === 'string') {
          const placeul = getElement('.placeul');

          if (
            placeul &&
          placeul.children.length == 3 &&
          placeul.children[2].innerText == 'GPK游戏记录'
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
        console.log('checkGPKGameResult:waitFor.yxjl', err);
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
        console.log('checkGPKGameResult:waitFor.paginList', err);
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

  console.log('gamenums - ' + gamenums);
  console.log('bet - ' + bet);
  console.log('win - ' + win);

  return newDTTodayGameData({
    gameNums: gamenums,
    totalBet: bet,
    totalWin: win,
  });
}

exports.onRightFrameLoadedGPKCGR = onRightFrameLoadedGPKCGR;
exports.checkGPKGameResult = checkGPKGameResult;
