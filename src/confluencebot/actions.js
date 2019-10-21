const {allUpdates} = require('./allupdates');
const {likePage} = require('./like');
const {addComment} = require('./addcomment');
const {attachJarvisCrawlerCore} = require('../utils');
const log = require('../log');

/**
 * run actions
 * @param {object} page - puppeteer.page
 * @param {config} cfg - config
 */
async function runActions(page, cfg) {
  for (let i = 0; i < cfg.actions.length; ++i) {
    log.debug(cfg.actions[i]);

    const curaction = cfg.actions[i];
    if (curaction.action === 'allupdates') {
      await attachJarvisCrawlerCore(page);
      // await page.addScriptTag({path: './browser/utils.js'});
      const allupdates = await allUpdates(page);

      log.debug('%j', allupdates);
    } else if (curaction.action === 'like') {
      await likePage(page, cfg, curaction.pageid);
    } else if (curaction.action === 'addcomment') {
      await addComment(page, cfg, curaction.pageid, curaction.comment);
    }
  }
}

exports.runActions = runActions;
