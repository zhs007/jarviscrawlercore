const messages = require('../../../proto/result_pb');
const {techinasiaCompany} = require('../../techinasia/company');
const {techinasiaJob} = require('../../techinasia/job');
const {techinasiaJobs} = require('../../techinasia/jobs');
const {techinasiaJobTag} = require('../../techinasia/jobtag');
const {replyError, replyMsg, setReplyCrawler} = require('../utils');
const {newReplyTechInAsia} = require('../../utils');

/**
 * callTechInAsia - techinasia
 * @param {object} browser - browser
 * @param {object} cfg - cfg
 * @param {object} call - call
 * @param {object} param - RequestTechInAsia
 * @param {object} request - RequestCrawler
 */
function callTechInAsia(browser, cfg, call, param, request) {
  let timeout = 3 * 60 * 1000;
  if (request.getTimeout()) {
    timeout = request.getTimeout();
  }

  if (param.getMode() == messages.TechInAsiaMode.TIAM_COMPANY) {
    techinasiaCompany(browser, param.getCompanycode(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.TechInAsiaMode.TIAM_COMPANY, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TECHINASIA, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.TechInAsiaMode.TIAM_JOB) {
    techinasiaJob(browser, param.getJobcode(), timeout)
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
  } else if (param.getMode() == messages.TechInAsiaMode.TIAM_JOBLIST) {
    techinasiaJobs(browser, param.getJobnums(), param.getJobtag(), param.getJobsubtag(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.TechInAsiaMode.TIAM_JOBLIST, ret.ret);

          setReplyCrawler(reply, messages.CrawlerType.CT_TECHINASIA, val);

          replyMsg(call, reply, true);
        })
        .catch((err) => {
          replyError(call, err.toString(), true);
        });
  } else if (param.getMode() == messages.TechInAsiaMode.TIAM_JOBTAG) {
    techinasiaJobTag(browser, param.getJobtag(), timeout)
        .then((ret) => {
          if (ret.error) {
            replyError(call, ret.error, true);

            return;
          }

          const reply = new messages.ReplyCrawler();

          const val = newReplyTechInAsia(messages.TechInAsiaMode.TIAM_JOBTAG, ret.ret);

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
