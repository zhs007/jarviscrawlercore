const messages = require('../../../proto/result_pb');

/**
 * DTGamesMgr class
 */
class DTGamesMgr {
  /**
   * constructor
   */
  constructor() {
    this.mapCheckGameResult = {};
  }

  /**
   * regGame
   * @param {string} gamecode - gamecode
   * @param {function} funcCheckGameResult - function checkGameResult(gameresult) errcode
   */
  regGame(gamecode, funcCheckGameResult) {
    this.mapCheckGameResult[gamecode] = funcCheckGameResult;
  }

  /**
   * checkGameResult
   * @param {object} gameresult - gameresult
   * @return {DTGameResultErr} result - DTGameResultErr
   */
  checkGameResult(gameresult) {
    if (gameresult && gameresult.gamecode) {
      const func = this.mapCheckGameResult[gameresult.gamecode];

      if (func) {
        gameresult.errcode = func(gameresult);

        return gameresult.errcode;
      }
    }

    return messages.DTGameResultErr.DTGRE_NOERR;
  }

  /**
   * _checkBaseGameResult
   * @param {object} gameresult - gameresult
   * @return {DTGameResultErr} result - DTGameResultErr
   */
  _checkBaseGameResult(gameresult) {
    if (gameresult) {
      if (gameresult.off != gameresult.win - gameresult.bet) {
        return messages.DTGameResultErr.DTGRE_WINBETOFF;
      }

      if (gameresult.datastate != '正常') {
        return messages.DTGameResultErr.DTGRE_GAMESTATE;
      }

      if (!gameresult.giftfreeid) {
        if (gameresult.moneyend != gameresult.moneystart + gameresult.off) {
          return messages.DTGameResultErr.DTGRE_MONEYOFF;
        }
      } else {
        if (
          gameresult.moneyend !=
          gameresult.moneystart + gameresult.off + gameresult.bet
        ) {
          return messages.DTGameResultErr.DTGRE_MONEYOFF;
        }
      }

      if (gameresult.iscomplete) {
        if (gameresult.hassubgame) {
          return messages.DTGameResultErr.DTGRE_ISCOMPLETE;
        }
      } else {
        if (!gameresult.hassubgame) {
          return messages.DTGameResultErr.DTGRE_ISCOMPLETE;
        }
      }
    }

    return messages.DTGameResultErr.DTGRE_NOERR;
  }
}

exports.mgrDTGame = new DTGamesMgr();
