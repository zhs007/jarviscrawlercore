const messages = require('../../../pbjs/result_pb');
const {getGameID} = require('../utils');
const {newDTGameResultErr} = require('../../utils');
const log = require('../../log');

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
      return undefined;
    }

    if (!subgameResult.dtbaseid) {
      return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_NODTBASEID);
    }

    let dtbaseid = undefined;
    try {
      dtbaseid = JSON.parse(subgameResult.dtbaseid);
    } catch (err) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_DTBASEID_ERROR,
      );
    }

    if (!dtbaseid.baseid) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_DTBASEID_NOBASEID,
      );
    }

    const baseid = getGameID(dtbaseid.baseid);
    if (parentResult.id != baseid) {
      return newDTGameResultErr(
          messages.DTGameResultErrCode.DTGRE_DTBASEID_BASEID_ERROR,
          parentResult.id,
          baseid,
      );
    }

    if (dtbaseid.free) {
      const freeid = getGameID(dtbaseid.free);
      if (!this.hasSubGame(parentResult, freeid)) {
        return newDTGameResultErr(
            messages.DTGameResultErrCode.DTGRE_DTBASEID_FREE,
        );
      }
    }

    if (dtbaseid.respin) {
      const respin = getGameID(dtbaseid.respin);
      if (!this.hasSubGame(parentResult, respin)) {
        return newDTGameResultErr(
            messages.DTGameResultErrCode.DTGRE_DTBASEID_RESPIN,
        );
      }
    }

    return undefined;
  }

  /**
   * countTotalFGNums
   * @param {object} gameresult - gameresult
   * @return {number} fgnums - fgnums
   */
  countTotalFGNums(gameresult) {
    if (gameresult && gameresult.gamecode) {
      const func = this.mapCountTotalFGNums[gameresult.gamecode];

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
        gameresult.err = func(gameresult);

        if (gameresult.err) {
          return gameresult.err;
        }

        if (gameresult.hassubgame) {
          if (!Array.isArray(gameresult.children)) {
            gameresult.err = newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_NOCHILDREN,
            );

            return gameresult.err;
          }

          const realfgnums = this.countRealFGNums(gameresult);
          if (realfgnums > 0) {
            const totalfgnums = this.countTotalFGNums(gameresult);
            if (realfgnums != totalfgnums) {
              gameresult.err = newDTGameResultErr(
                  messages.DTGameResultErrCode.DTGRE_INVALID_FGNUMS,
                  realfgnums,
                  totalfgnums,
              );

              return gameresult.err;
            }
          }

          let hassuberr = false;
          for (let i = 0; i < gameresult.children.length; ++i) {
            let suberr = this.checkGameResult(gameresult.children[i]);

            if (suberr) {
              hassuberr = true;
            } else {
              suberr = this.checkSubGameDTGameID(
                  gameresult,
                  gameresult.children[i],
              );
              if (suberr) {
                gameresult.children[i].err = suberr;

                hassuberr = true;
              }
            }
          }

          if (hassuberr) {
            gameresult.err = newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_CHILDREN_ERROR,
            );
          }
        }
      }
    }

    return undefined;
  }

  /**
   * countRealFGNums
   * @param {object} gameresult - gameresult
   * @return {number} fgnums - fgnums
   */
  countRealFGNums(gameresult) {
    if (Array.isArray(gameresult.children)) {
      let fgnums = 0;
      for (let i = 0; i < gameresult.children.length; ++i) {
        if (gameresult.children[i].dtbaseid) {
          let dtbaseid = undefined;
          try {
            dtbaseid = JSON.parse(gameresult.children[i].dtbaseid);
            if (dtbaseid.free) {
              fgnums++;
            }
          } catch (err) {
            log.error('DTGamesMgr._countFGNums catch error ' + err);
          }
        }
      }

      return fgnums;
    }

    return 0;
  }

  /**
   * _checkBaseGameResult
   * @param {object} gameresult - gameresult
   * @return {DTGameResultErr} result - DTGameResultErr
   */
  _checkBaseGameResult(gameresult) {
    if (gameresult) {
      if (gameresult.off != gameresult.win - gameresult.bet) {
        return newDTGameResultErr(
            messages.DTGameResultErrCode.DTGRE_WINBETOFF,
            gameresult.off,
            gameresult.win - gameresult.bet,
        );
      }

      if (gameresult.datastate != '正常') {
        return newDTGameResultErr(messages.DTGameResultErrCode.DTGRE_GAMESTATE);
      }

      if (!gameresult.giftfreeid) {
        if (!gameresult.hassubgame) {
          if (gameresult.moneyend != gameresult.moneystart + gameresult.off) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_MONEYOFF,
                gameresult.moneyend,
                gameresult.moneystart + gameresult.off,
            );
          }
        }
      } else {
        if (!gameresult.hassubgame) {
          if (
            gameresult.moneyend !=
            gameresult.moneystart + gameresult.off + gameresult.bet
          ) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_MONEYOFF,
                gameresult.moneyend,
                gameresult.moneystart + gameresult.off + gameresult.bet,
            );
          }
        }
      }

      if (gameresult.rootgame) {
        if (gameresult.iscomplete) {
          return newDTGameResultErr(
              messages.DTGameResultErrCode.DTGRE_ISCOMPLETE,
          );
        }
      } else if (gameresult.dtbaseid) {
      } else {
        if (gameresult.iscomplete) {
          if (gameresult.hassubgame) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_ISCOMPLETE,
            );
          }
        } else {
          if (!gameresult.hassubgame) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_ISCOMPLETE,
            );
          }

          if (!Array.isArray(gameresult.children)) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_NOCHILDREN,
            );
          }

          let complatenums = 0;
          for (let i = 0; i < gameresult.children.length; ++i) {
            if (gameresult.children[i].iscomplete) {
              ++complatenums;
            }
          }

          if (complatenums == 0) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_SUBGAME_NOTCOMPLETE,
            );
          } else if (complatenums > 1) {
            return newDTGameResultErr(
                messages.DTGameResultErrCode.DTGRE_SUBGAME_REPEATED_COMPLETE,
            );
          }
        }
      }
    }

    return undefined;
  }
}

exports.mgrDTGame = new DTGamesMgr();
