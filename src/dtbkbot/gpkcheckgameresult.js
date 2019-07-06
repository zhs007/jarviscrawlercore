const {newDTTodayGameData} = require('../utils');

/**
 * wait4RightFrame
 * @param {object} rightFrame - rightFrame
 */
async function wait4RightFrame(rightFrame) {
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
        console.log('wait4RightFrame', err);
      });
}

/**
 * onRightFrameLoaded GPKCGR - GPK check gameresult
 * @param {object} rightFrame - rightFrame
 */
async function onRightFrameLoadedGPKCGR(rightFrame) {
  await wait4RightFrame(rightFrame);
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
 * @return {object} result - {error: error, ret: result}
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

  const isdone1 = await waitRightFrame.wait4URL(
      'log/gpkbets!findAll.html',
      async () => {
      // 点击二级菜单
        await leftFrame.click('.gpkyxjl');
      },
      3 * 60 * 1000
  );

  if (!isdone1) {
    return {error: 'wait4URL timeout'};
  }

  // console.log('haha');

  await wait4RightFrame(rightFrame);

  await rightFrame.$eval(
      '#platformCode',
      (ele, businessid) => {
        ele.value = businessid;
      },
      businessid
  );

  await rightFrame.$eval(
      '#gameCode',
      (ele, gamecode) => {
        ele.value = gamecode;
      },
      gamecode
  );

  await rightFrame.$eval(
      '#playerName',
      (ele, playername) => {
        ele.value = playername;
      },
      playername
  );

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
    ele.value = '1000';
  });

  const isdone2 = await waitRightFrame.wait4URL(
      'log/gpkbets!findAll.html',
      async () => {
        await rightFrame.click('.scbtn.cx');
      },
      3 * 60 * 1000
  );

  if (!isdone2) {
    return {error: 'wait4URL timeout'};
  }

  await wait4RightFrame(rightFrame);

  // console.log('haha1');

  const lst = await rightFrame.$$eval('tr', (eles) => {
    const arr = [];
    for (let i = 1; i < eles.length - 1; ++i) {
      if (eles[i].children.length == 22) {
        const ele = eles[i];

        let id = '';
        const fullid = ele.children[0].innerText;
        const ids = fullid.split('#');
        if (ids.length == 2) {
          id = ids[1];
        }

        const businessid = ele.children[1].innerText;
        const playername = ele.children[2].innerText;
        const gamecode = ele.children[3].innerText;
        const win = parseFloat(ele.children[5].innerText);
        const bet = parseFloat(ele.children[6].innerText);
        const off = parseFloat(ele.children[7].innerText);
        const lines = parseFloat(ele.children[8].innerText);
        const moneystart = parseFloat(ele.children[9].innerText);
        const moneyend = parseFloat(ele.children[10].innerText);
        const playerip = ele.children[11].innerText;
        const datastate = ele.children[12].innerText;
        const gametime = ele.children[13].innerText;
        const clienttype = ele.children[15].innerText;
        const currency = ele.children[17].innerText;
        const iscomplete = (ele.children[18].innerText == 'YES');
        const giftfreeid = ele.children[19].innerText;

        let gamedata = '';
        const lstgamedataa = ele.children[14].getElementsByTagName('a');
        if (lstgamedataa.length > 0) {
          gamedata = lstgamedataa[0].title;
        }

        let gameresult = '';
        const lstgameresulta = ele.children[20].getElementsByTagName('a');
        if (lstgameresulta.length > 0) {
          gameresult = lstgameresulta[0].title;
        }

        let subgame = false;
        const lstinput = ele.children[21].getElementsByTagName('input');
        if (lstinput.length > 0) {
          lstinput[0].className = 'scbtn subgame' + id;
          subgame = true;
        }

        arr.push({
          id: id,
          businessid: businessid,
          playername: playername,
          gamecode: gamecode,
          win: win,
          bet: bet,
          off: off,
          lines: lines,
          moneystart: moneystart,
          moneyend: moneyend,
          playerip: playerip,
          datastate: datastate,
          gametime: gametime,
          clienttype: clienttype,
          currency: currency,
          iscomplete: iscomplete,
          giftfreeid: giftfreeid,
          gamedata: gamedata,
          gameresult: gameresult,
          subgame: subgame,
        });
      }
    }

    console.log(arr);

    return arr;
  });

  console.log(lst);

  return {ret: lst};

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
