const {mgrDTGame} = require('./mgr');
const {isArrayNumberNM, isMyRespin} = require('../utils');
const messages = require('../../../proto/result_pb');
const {newDTGameResultErr} = require('../../utils');

const GAMECODE = 'hiphopman';
const LINES = 50;
const TIMES = 1;
const GAMEWIDTH = 5;
const GAMEHEIGHT = 4;

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
  }

  if (gameresult.lines != LINES) {
    return newDTGameResultErr(
        messages.DTGameResultErrCode.DTGRE_LINES,
        gameresult.lines,
        LINES
    );
  }

  if (gameresult.gamedata && (!dtbaseid || !dtbaseid.bonus)) {
    try {
      const gamedata = JSON.parse(gameresult.gamedata);
      if (!isArrayNumberNM(gamedata, GAMEHEIGHT, GAMEWIDTH)) {
        return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMEDATA);
      }
    } catch (err) {
      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMEDATA);
    }
  }

  if (gameresult.gameresult && (!dtbaseid || !dtbaseid.bonus)) {
    try {
      const gr = JSON.parse(gameresult.gameresult);
      if (!gr) {
        return newDTGameResultErr(
            messages.DTGameResultErrCode.DTGRE_GAMERESULT
        );
      }

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

      if (!gameresult.dtbaseid) {
        if (gr.bet * LINES * TIMES != gameresult.bet) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_GAMERESULT_BET,
              gr.bet * LINES * TIMES,
              gameresult.bet
          );
        }
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
    } catch (err) {
      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMERESULT);
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
