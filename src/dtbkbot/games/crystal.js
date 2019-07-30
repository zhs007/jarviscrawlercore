const {mgrDTGame} = require('./mgr');
const {isArrayNumberNM, isMyRespin} = require('../utils');
const messages = require('../../../proto/result_pb');
const {newDTGameResultErr} = require('../../utils');

const GAMECODE = 'crystal';
const LINES = 1;
const TIMES = 1;
const GAMEWIDTH = 7;
const GAMEHEIGHT = 7;

/**
 * checkGameResult
 * @param {object} gameresult - gameresult
 * @return {DTGameResultErr} result - DTGameResultErr
 */
function checkGameResult(gameresult) {
  let dtbaseid = undefined;

  if (gameresult.dtbaseid) {
    try {
      dtbaseid = JSON.parse(gameresult.dtbaseid);
    } catch (err) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_DTBASEID_ERROR
      );
    }

    if (dtbaseid.jp && gameresult.lines != 0) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_LINES,
          gameresult.lines,
          LINES
      );
    }
    // if (!isMyJP(gr.dtbaseid, baseid))
  }

  if (gameresult.lines != LINES) {
    if (!dtbaseid || !dtbaseid.jp) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_LINES,
          gameresult.lines,
          LINES
      );
    }
  }

  if (gameresult.gamedata) {
    if (!(dtbaseid && dtbaseid.jp)) {
      try {
        const gamedata = JSON.parse(gameresult.gamedata);
        if (!isArrayNumberNM(gamedata, GAMEHEIGHT, GAMEWIDTH)) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMEDATA
          );
        }
      } catch (err) {
        return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMEDATA);
      }
    }
  }

  if (gameresult.gameresult) {
    try {
      const gr = JSON.parse(gameresult.gameresult);
      if (!gr) {
        return newDTGameResultErr(
            messages.DTGameResultErrCode.DTGRE_GAMERESULT
        );
      }

      if (!dtbaseid || !dtbaseid.jp) {
        if (gr.lines != LINES) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_LINES,
              gr.lines,
              LINES
          );
        }

        if (gr.times != TIMES) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_TIMES,
              gr.times,
              TIMES
          );
        }

        if (!gameresult.hassubgame && gr.realwin != gameresult.win) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_WIN,
              gr.realwin,
              gameresult.win
          );
        }

        let totalwin = 0;
        for (let i = 0; i < gr.lst.length; ++i) {
          totalwin += gr.lst[i].win;
        }

        if (totalwin != gr.totalwin) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_SUM_WIN,
              totalwin,
              gr.totalwin
          );
        }
      } else {
        if (gr.data && gr.data.award != gameresult.win) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_INVALID_JPWIN,
              gr.data.award,
              gameresult.win
          );
        }
      }

      if (!gameresult.dtbaseid) {
        if (gr.bet * LINES * TIMES != gameresult.bet) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_BET,
              gr.bet * LINES * TIMES,
              gameresult.bet
          );
        }
      }
    } catch (err) {
      console.log('crystal.checkGameResult ' + err);

      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMERESULT);
    }
  }

  if (Array.isArray(gameresult.children)) {
    let injackpotnums = 0;
    let jackpotnums = 0;
    for (let i = 0; i < gameresult.children.length; ++i) {
      if (gameresult.children[i].dtbaseid) {
        try {
          const curdtid = JSON.parse(gameresult.children[i].dtbaseid);
          if (curdtid && curdtid.jp) {
            ++jackpotnums;
          }
        } catch (err) {}
      }

      if (gameresult.children[i].gameresult) {
        try {
          const gr = JSON.parse(gameresult.children[i].gameresult);
          if (gr && gr.injackpot) {
            ++injackpotnums;
          }
        } catch (err) {}
      }
    }

    if (injackpotnums != jackpotnums) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_SUBGAME_INVALID_JP,
          injackpotnums,
          jackpotnums
      );
    }
  }

  return mgrDTGame._checkBaseGameResult(gameresult);
}

/**
 * countfgnums
 * @param {Array} children - gameresult.children
 * @param {string} baseid - baseid
 * @param {bool} isroot - this is a root game
 * @return {number} fgnums - fg nums
 */
function countfgnums(children, baseid, isroot) {
  if (isroot) {
    for (let i = 0; i < children.length; ++i) {
      const curgr = children[i];
      if (curgr.gameresult) {
        try {
          const gr = JSON.parse(curgr.gameresult);
          if (gr) {
            if (!gr.dtbaseid || isMyRespin(gr.dtbaseid, baseid)) {
              if (gr.realfgnums > 0) {
                return gr.realfgnums;
              }
            }
          }
        } catch (err) {
          console.log(GAMECODE + '.countfgnums catch err ' + err);
        }
      }
    }
  } else {
    for (let i = 0; i < children.length; ++i) {
      const curgr = children[i];
      if (curgr.gameresult) {
        try {
          const gr = JSON.parse(curgr.gameresult);
          if (gr) {
            if (gr.dtbaseid && !isMyRespin(gr.dtbaseid, baseid)) {
              if (gr.fgnums > 0) {
                return gr.fgnums;
              }
            }
          }
        } catch (err) {
          console.log(GAMECODE + '.countfgnums catch err ' + err);
        }
      }
    }
  }

  return 0;
}

/**
 * countTotalFGNums
 * @param {object} gameresult - gameresult
 * @return {number} fgnums - fg nums
 */
function countTotalFGNums(gameresult) {
  if (gameresult.children) {
    const bgfgnums = countfgnums(gameresult.children, gameresult.id, true);
    const fgnums = countfgnums(gameresult.children, gameresult.id, false);

    return bgfgnums + fgnums;
  }

  return 0;
}

mgrDTGame.regGame(GAMECODE, checkGameResult, countTotalFGNums);
