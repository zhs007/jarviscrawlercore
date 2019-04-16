const {allUpdates} = require('./allupdates');
const {likePage} = require('./like');
const {addComment} = require('./addcomment');
const {
  attachJarvisCrawlerCore,
} = require('../utils');

/**
 * run actions
 * @param {object} page - puppeteer.page
 * @param {config} cfg - config
 */
async function runActions(page, cfg) {
  for (let i = 0; i < cfg.actions.length; ++i) {
    console.log(cfg.actions[i]);

    const curaction = cfg.actions[i];
    if (curaction.action === 'allupdates') {
      await attachJarvisCrawlerCore(page);
      // await page.addScriptTag({path: './browser/utils.js'});
      const allupdates = await allUpdates(page);

      console.log('%j', allupdates);
    } else if (curaction.action === 'like') {
      await likePage(page, cfg, curaction.pageid);
    } else if (curaction.action === 'addcomment') {
      // console.log(cfg.actions[i]);
      await addComment(page, cfg, curaction.pageid, curaction.comment);
    }
  }
}

exports.runActions = runActions;
