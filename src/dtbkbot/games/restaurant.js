const {mgrDTGame} = require('./mgr');
const {isArrayNumberNM} = require('../utils');
const messages = require('../../../proto/result_pb');
const {newDTGameResultErr} = require('../../utils');

const GAMECODE = 'restaurant';
const LINES = 25;
const TIMES = 1;
const GAMEWIDTH = 6;
const GAMEHEIGHT = 5;

/**
 * checkGameResult
 * @param {object} gameresult - gameresult
 * @return {DTGameResultErr} result - DTGameResultErr
 */
function checkGameResult(gameresult) {
  if (gameresult.lines != LINES) {
    return newDTGameResultErr(
        messages.DTGameResultErrCode.DTGRE_LINES,
        gameresult.lines,
        LINES
    );
  }

  if (gameresult.gamedata) {
    try {
      const gamedata = JSON.parse(gameresult.gamedata);
      if (!isArrayNumberNM(gamedata, GAMEHEIGHT, GAMEWIDTH)) {
        return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMEDATA);
      }
    } catch (err) {
      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMEDATA);
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

      if (gr.lines != LINES && gr.lines != 1) {
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

      if (gr.respin != 1) {
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
      }
    } catch (err) {
      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMERESULT);
    }
  }

  return mgrDTGame._checkBaseGameResult(gameresult);
}

/**
 * countTotalFGNums
 * @param {object} gameresult - gameresult
 * @return {number} fgnums - fg nums
 */
function countTotalFGNums(gameresult) {
  return 0;
}

mgrDTGame.regGame(GAMECODE, checkGameResult, countTotalFGNums);
