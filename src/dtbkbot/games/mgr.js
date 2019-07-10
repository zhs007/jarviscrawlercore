const messages = require('../../../proto/result_pb');
const {getGameID} = require('../utils');

/**
 * DTGamesMgr class
 */
class DTGamesMgr {
  /**
   * constructor
   */
  constructor() {
    this.mapCheckGameResult = {};
    this.mapCountTotalFGNums = {};
  }

  /**
   * regGame
   * @param {string} gamecode - gamecode
   * @param {function} funcCheckGameResult - function checkGameResult(gameresult) errcode
   * @param {function} funcCountTotalFGNums - function countTotalFGNums(gameresult) int
   */
  regGame(gamecode, funcCheckGameResult, funcCountTotalFGNums) {
    this.mapCheckGameResult[gamecode] = funcCheckGameResult;
    this.mapCountTotalFGNums[gamecode] = funcCountTotalFGNums;
  }

  /**
   * hasSubGame
   * @param {object} parentResult - parentResult
   * @param {object} id - id
   * @return {bool} hasSubGame - has sub game
   */
  hasSubGame(parentResult, id) {
    for (let i = 0; i < parentResult.children.length; ++i) {
      if (parentResult.children[i].id == id) {
        return true;
      }
    }

    return false;
  }

  /**
   * checkSubGameDTGameID
   * @param {object} parentResult - parentResult
   * @param {object} subgameResult - subgameResult
   * @return {DTGameResultErr} result - DTGameResultErr
   */
  checkSubGameDTGameID(parentResult, subgameResult) {
    if (subgameResult.rootgame) {
      return messages.DTGameResultErr.DTGRE_NOERR;
    }

    if (!subgameResult.dtbaseid) {
      return messages.DTGameResultErr.DTGRE_NODTBASEID;
    }

    let dtbaseid = undefined;
    try {
      dtbaseid = JSON.parse(subgameResult.dtbaseid);
    } catch (err) {
      return messages.DTGameResultErr.DTGRE_DTBASEID_ERROR;
    }

    if (!dtbaseid.baseid) {
      return messages.DTGameResultErr.DTGRE_DTBASEID_NOBASEID;
    }

    const baseid = getGameID(dtbaseid.baseid);
    if (parentResult.id != baseid) {
      return messages.DTGameResultErr.DTGRE_DTBASEID_BASEID_ERROR;
    }

    if (dtbaseid.free) {
      const freeid = getGameID(dtbaseid.free);
      if (!this.hasSubGame(parentResult, freeid)) {
        return messages.DTGameResultErr.DTGRE_DTBASEID_FREE;
      }
    }

    if (dtbaseid.respin) {
      const respin = getGameID(dtbaseid.respin);
      if (!this.hasSubGame(parentResult, respin)) {
        return messages.DTGameResultErr.DTGRE_DTBASEID_RESPIN;
      }
    }

    return messages.DTGameResultErr.DTGRE_NOERR;
  }

  /**
   * countTotalFGNums
   * @param {object} gameresult - gameresult
   * @return {number} fgnums - fgnums
   */
  countTotalFGNums(gameresult) {
    if (gameresult && gameresult.gamecode) {
      const func = this.funcCountTotalFGNums[gameresult.gamecode];

      if (func) {
        return func(gameresult);
      }
    }

    return 0;
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

        if (gameresult.errcode != messages.DTGameResultErr.DTGRE_NOERR) {
          return gameresult.errcode;
        }

        if (gameresult.hassubgame) {
          if (!Array.isArray(gameresult.children)) {
            gameresult.errcode = messages.DTGameResultErr.DTGRE_NOCHILDREN;

            return messages.DTGameResultErr.DTGRE_NOCHILDREN;
          }

          let hassuberr = false;
          for (let i = 0; i < gameresult.children.length; ++i) {
            let suberr = this.checkGameResult(gameresult.children[i]);

            if (suberr != messages.DTGameResultErr.DTGRE_NOERR) {
              hassuberr = true;
            } else {
              suberr = this.checkSubGameDTGameID(
                  gameresult,
                  gameresult.children[i]
              );
              if (suberr != messages.DTGameResultErr.DTGRE_NOERR) {
                gameresult.children[i].errcode = suberr;

                hassuberr = true;
              }
            }
          }

          if (hassuberr) {
            gameresult.errcode = messages.DTGameResultErr.DTGRE_CHILDREN_ERROR;
          }

          return messages.DTGameResultErr.DTGRE_CHILDREN_ERROR;
        }
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
        if (!gameresult.hassubgame) {
          if (gameresult.moneyend != gameresult.moneystart + gameresult.off) {
            return messages.DTGameResultErr.DTGRE_MONEYOFF;
          }
        }
      } else {
        if (!gameresult.hassubgame) {
          if (
            gameresult.moneyend !=
            gameresult.moneystart + gameresult.off + gameresult.bet
          ) {
            return messages.DTGameResultErr.DTGRE_MONEYOFF;
          }
        }
      }

      if (gameresult.rootgame) {
        if (gameresult.iscomplete) {
          return messages.DTGameResultErr.DTGRE_ISCOMPLETE;
        }
      } else if (gameresult.dtbaseid) {
      } else {
        if (gameresult.iscomplete) {
          if (gameresult.hassubgame) {
            return messages.DTGameResultErr.DTGRE_ISCOMPLETE;
          }
        } else {
          if (!gameresult.hassubgame) {
            return messages.DTGameResultErr.DTGRE_ISCOMPLETE;
          }

          if (!Array.isArray(gameresult.children)) {
            return messages.DTGameResultErr.DTGRE_NOCHILDREN;
          }

          let iscomplete = false;
          for (let i = 0; i < gameresult.children.length; ++i) {
            if (gameresult.children[i].iscomplete) {
              iscomplete = true;
            }
          }

          if (!iscomplete) {
            return messages.DTGameResultErr.DTGRE_SUBGAME_NOTCOMPLETE;
          }
        }
      }
    }

    return messages.DTGameResultErr.DTGRE_NOERR;
  }
}

exports.mgrDTGame = new DTGamesMgr();
