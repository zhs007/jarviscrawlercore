const {
  newDTGPKCheckGameResult,
  newDTGameResultErr,
  sleep,
  findFrame,
} = require('../utils');
// const {formatDTNumber} = require('./utils');
const {mgrDTGame} = require('./games/allgames');
const messages = require('../../proto/result_pb');

let lsticon404 = [];

/**
 * onCheckGPKGameResult404
 * @param {object} response - response
 */
async function onCheckGPKGameResult404(response) {
  if (!response) {
    return;
  }

  const status = response.status();
  if (status == 404) {
    lsticon404.push(response.url());
  }
}

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
 * get sub game
 * @param {object} page - page
 * @param {object} rightFrame - rightFrame
 * @param {WaitRightFrame} waitRightFrame - waitRightFrame
 * @param {string} gamecode - gamecode
 * @param {string} gameid - gameid
 * @return {object} result - {error: error, ret: result}
 */
async function getSubGame(page, rightFrame, waitRightFrame, gamecode, gameid) {
  await rightFrame.click('.scbtn.subgame' + gameid);
  const url =
    '/log/gpkbets!showSubGame.html?dto.id=' + gamecode + '%23' + gameid;

  const isdone = await waitRightFrame.wait4URL(
      url,
      async () => {
        console.log('It\'s done. ' + url);
      },
      3 * 60 * 1000
  );

  if (!isdone) {
    return {error: 'wait4URL fail! ' + url};
  }

  const subgameframe = await findFrame(page, (frame) => {
    return frame.name().indexOf('layui-layer-iframe') === 0;
  });

  console.log('subgameframe ' + subgameframe);

  if (subgameframe) {
    await subgameframe.waitForFunction(() => {
      const lst = document.getElementsByTagName('tr');
      for (let i = 0; i < lst.length; ++i) {
        if (lst[i].children.length == 5) {
          return true;
        }
      }

      return false;
    });

    console.log('subgameframe:waitForFunction ok.');

    const lst = await subgameframe
        .$$eval(
            'tr',
            (eles, gamecode) => {
              console.log(eles);
              console.log(gamecode);

              const arr = [];
              for (let i = 1; i < eles.length - 1; ++i) {
                if (eles[i].children.length == 19) {
                  const ele = eles[i];

                  let id = '';
                  const fullid = ele.children[0].innerText;
                  const ids = fullid.split('#');
                  if (ids.length == 2) {
                    id = ids[1];
                  }

                  const dtbaseid = ele.children[2].innerText;

                  const win = Math.round(
                      parseFloat(ele.children[3].innerText) * 100
                  );
                  const bet = Math.round(
                      parseFloat(ele.children[4].innerText) * 100
                  );
                  const off = Math.round(
                      parseFloat(ele.children[5].innerText) * 100
                  );
                  const lines = parseInt(ele.children[6].innerText);
                  const moneystart = Math.round(
                      parseFloat(ele.children[7].innerText) * 100
                  );
                  const moneyend = Math.round(
                      parseFloat(ele.children[8].innerText) * 100
                  );

                  const playerip = ele.children[9].innerText;
                  const datastate = ele.children[10].innerText;
                  const gametime = ele.children[11].innerText;

                  const clienttype = ele.children[13].innerText;
                  const currency = ele.children[15].innerText;
                  const iscomplete = ele.children[16].innerText == 'YES';
                  const giftfreeid = ele.children[17].innerText;

                  let gamedata = '';
                  const lstgamedataa = ele.children[12].getElementsByTagName('a');
                  if (lstgamedataa.length > 0) {
                    gamedata = lstgamedataa[0].title;
                  }

                  let gameresult = '';
                  const lstgameresulta = ele.children[18].getElementsByTagName('a');
                  if (lstgameresulta.length > 0) {
                    gameresult = lstgameresulta[0].title;
                  }

                  const curgr = {
                    id: id,
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
                    dtbaseid: dtbaseid,
                  };

                  if (dtbaseid == '') {
                    curgr.rootgame = true;
                  }

                  if (ids.length == 2 && ids[0] != gamecode) {
                    curgr.err = newDTGameResultErr(
                        messages.DTGameResultErrCode.DTGRE_GAMECODE
                    );
                  }

                  arr.push(curgr);
                }
              }

              console.log(arr);

              return arr;
            },
            gamecode
        )
        .catch((err) => {
          return {error: 'getSubGame:subgameframe ' + err};
        });

    await rightFrame
        .click('.layui-layer-ico.layui-layer-close.layui-layer-close1')
        .catch((err) => {
          return {error: 'getSubGame:click ' + err};
        });

    await sleep(1000);

    return {ret: lst};
  }

  return {err: 'no sub game.'};
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
  lsticon404 = [];

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

  await rightFrame.waitForFunction(() => {
    const lst = document.getElementsByTagName('tr');
    for (let i = 0; i < lst.length; ++i) {
      if (lst[i].children.length == 6) {
        return true;
      }
    }

    return false;
  });

  console.log('rightFrame:waitForFunction ok.');

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
        const win = Math.round(parseFloat(ele.children[5].innerText) * 100);
        const bet = Math.round(parseFloat(ele.children[6].innerText) * 100);
        const off = Math.round(parseFloat(ele.children[7].innerText) * 100);
        const lines = parseInt(ele.children[8].innerText);
        const moneystart = Math.round(
            parseFloat(ele.children[9].innerText) * 100
        );
        const moneyend = Math.round(
            parseFloat(ele.children[10].innerText) * 100
        );
        const playerip = ele.children[11].innerText;
        const datastate = ele.children[12].innerText;
        const gametime = ele.children[13].innerText;
        const clienttype = ele.children[15].innerText;
        const currency = ele.children[17].innerText;
        const iscomplete = ele.children[18].innerText == 'YES';
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

        const curgr = {
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
          hassubgame: subgame,
        };

        if (ids.length == 2 && ids[0] != gamecode) {
          curgr.err = newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMECODE
          );
        }

        arr.push(curgr);
      } else if (eles[i].children.length == 23) {
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
        const win = Math.round(parseFloat(ele.children[5].innerText) * 100);
        const bet = Math.round(parseFloat(ele.children[6].innerText) * 100);
        const off = Math.round(parseFloat(ele.children[7].innerText) * 100);
        const lines = parseInt(ele.children[8].innerText);
        const moneystart = Math.round(
            parseFloat(ele.children[9].innerText) * 100
        );
        const moneyend = Math.round(
            parseFloat(ele.children[10].innerText) * 100
        );
        const playerip = ele.children[11].innerText;
        const datastate = ele.children[12].innerText;
        const gametime = ele.children[13].innerText;
        const clienttype = ele.children[15].innerText;
        const currency = ele.children[17].innerText;
        const iscomplete = ele.children[18].innerText == 'YES';
        const giftfreeid = ele.children[20].innerText;

        let gamedata = '';
        const lstgamedataa = ele.children[14].getElementsByTagName('a');
        if (lstgamedataa.length > 0) {
          gamedata = lstgamedataa[0].title;
        }

        let gameresult = '';
        const lstgameresulta = ele.children[21].getElementsByTagName('a');
        if (lstgameresulta.length > 0) {
          gameresult = lstgameresulta[0].title;
        }

        let subgame = false;
        const lstinput = ele.children[22].getElementsByTagName('input');
        if (lstinput.length > 0) {
          lstinput[0].className = 'scbtn subgame' + id;
          subgame = true;
        }

        const curgr = {
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
          hassubgame: subgame,
        };

        if (ids.length == 2 && ids[0] != gamecode) {
          curgr.err = newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMECODE
          );
        }

        arr.push(curgr);
      }
    }

    console.log(arr);

    return arr;
  });

  for (let i = 0; i < lst.length; ++i) {
    if (lst[i].hassubgame) {
      const cursubgames = await getSubGame(
          page,
          rightFrame,
          waitRightFrame,
          lst[i].gamecode,
          lst[i].id
      );

      if (cursubgames.ret) {
        console.log('getSubGame ' + cursubgames.ret.length);

        lst[i].children = cursubgames.ret;
      }
    }
  }

  let errnums = 0;
  for (let i = 0; i < lst.length; ++i) {
    mgrDTGame.checkGameResult(lst[i]);

    if (lst[i].err) {
      ++errnums;

      console.log(
          'I got a error! ' +
          lst[i].id +
          ' ' +
          lst[i].err.getErrcode() +
          ' ' +
          lst[i].err.getValue0() +
          ' ' +
          lst[i].err.getValue1()
      );
    }
  }

  for (let i = 0; i < lsticon404.length; ++i) {
    ++errnums;

    lst.push({
      err: newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_ICON404,
          undefined,
          undefined,
          lsticon404[i]
      ),
    });

    console.log(
        'I got a error! ' +
        messages.DTGameResultErrCode.DTGRE_ICON404 +
        ' ' +
        lsticon404[i]
    );
  }

  const ret = {
    lst: lst,
    errnums: errnums,
  };

  console.log(ret.errnums);

  return {ret: newDTGPKCheckGameResult(ret)};
}

exports.onRightFrameLoadedGPKCGR = onRightFrameLoadedGPKCGR;
exports.checkGPKGameResult = checkGPKGameResult;
exports.onCheckGPKGameResult404 = onCheckGPKGameResult404;
