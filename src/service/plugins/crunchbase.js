const messages = require('../../../proto/result_pb');
const {searchInCrunchBase} = require('../../crunchbase/service');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newCrunchBaseOrganization} = require('../../utils');

/**
 * search in crunchbase
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestCrunchBaseCompany
 */
function callSearchInCrunchBase(browser, cfg, call, param) {
  if (!cfg.crunchbaseconfig) {
    replyError(call, 'no crunchbase config', true);

    return;
  }

  searchInCrunchBase(browser, cfg.crunchbaseconfig, param.getSearch())
      .then((ret) => {
        console.log(ret);

        if (ret.error) {
          replyError(call, ret.error, true);

          return;
        }

        if (ret.company) {
          const reply = new messages.ReplyCrawler();

          const val = newCrunchBaseOrganization(ret.company);
          setReplyCrawler(reply, messages.CrawlerType.CT_CB_COMPANY, val);

          replyMsg(call, reply, true);
        }
      })
      .catch((err) => {
        replyError(call, err.toString(), true);
      });
}

exports.callSearchInCrunchBase = callSearchInCrunchBase;
