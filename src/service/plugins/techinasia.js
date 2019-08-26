const messages = require('../../../proto/result_pb');
const {techinasiaCompany} = require('../../techinasia/company');
const {techinasiaJob} = require('../../techinasia/job');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyTechInAsia} = require('../../utils');

/**
 * callTechInAsia - techinasia
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTechInAsia
 */
function callTechInAsia(browser, cfg, call, param) {
  if (param.getMode() == messages.TechInAsiaMode.TIAM_COMPANY) {
    techinasiaCompany(browser, param.getCompanycode())
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(
              messages.TechInAsiaMode.TIAM_COMPANY,
              ret.ret
          );

          setReplyCrawler(reply, messages.CrawlerType.CT_TECHINASIA, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.TechInAsiaMode.TIAM_JOB) {
    techinasiaJob(browser, param.getJobcode())
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.TechInAsiaMode.TIAM_JOB, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TECHINASIA, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else {
    replyError(call, 'invalid mode', true);
  }
}

exports.callTechInAsia = callTechInAsia;
