const log = require('../log');

/**
 * like page
 * @param {object} page - page
 * @param {config} cfg - config
 * @param {object} pageid - pageid
 * @return {ExportArticleResult} result - result
 */
async function likePage(page, cfg, pageid) {
  const url =
    cfg.url +
    '/pages/viewpage.action?pageId=' +
    pageid +
    '&showComments=true&showCommentArea=true#addcomment';
  await page.goto(url);
  await page.waitForSelector('.like-button');
  await page.click('.like-button');
  await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
    log.error('confluencebot.likePage:waitForNavigation ', err);
  });
}

exports.likePage = likePage;
