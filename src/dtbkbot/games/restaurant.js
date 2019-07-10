const {mgrDTGame} = require('./mgr');
const {isArrayNumberNM} = require('../utils');
const messages = require('../../../proto/result_pb');

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
    return messages.DTGameResultErr.DTGRE_LINES;
  }

  if (gameresult.gamedata) {
    try {
      const gamedata = JSON.parse(gameresult.gamedata);
      if (!isArrayNumberNM(gamedata, GAMEHEIGHT, GAMEWIDTH)) {
        return messages.DTGameResultErr.DTGRE_GAMEDATA;
      }
    } catch (err) {
      return messages.DTGameResultErr.DTGRE_GAMEDATA;
    }
  }

  if (gameresult.gameresult) {
    try {
      const gr = JSON.parse(gameresult.gameresult);
      if (!gr) {
        return messages.DTGameResultErr.DTGRE_GAMERESULT;
      }

      if (gr.lines != LINES && gr.lines != 1) {
        return messages.DTGameResultErr.DTGRE_GAMERESULT_LINES;
      }

      if (gr.times != TIMES) {
        return messages.DTGameResultErr.DTGRE_GAMERESULT_TIMES;
      }

      if (!gameresult.dtbaseid) {
        if (gr.bet * LINES * TIMES != gameresult.bet) {
          return messages.DTGameResultErr.DTGRE_GAMERESULT_BET;
        }
      }

      if (
        !gameresult.hassubgame &&
        gr.realwin != gameresult.win
      ) {
        return messages.DTGameResultErr.DTGRE_GAMERESULT_WIN;
      }

      let totalwin = 0;
      for (let i = 0; i < gr.lst.length; ++i) {
        totalwin += gr.lst[i].win;
      }

      if (totalwin != gr.totalwin) {
        return messages.DTGameResultErr.DTGRE_GAMERESULT_SUM_WIN;
      }
    } catch (err) {
      return messages.DTGameResultErr.DTGRE_GAMERESULT;
    }
  }

  return mgrDTGame._checkBaseGameResult(gameresult);
}

mgrDTGame.regGame(GAMECODE, checkGameResult);
