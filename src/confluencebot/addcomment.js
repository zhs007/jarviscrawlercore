const log = require('../log');

/**
 * add comment
 * @param {object} page - page
 * @param {config} cfg - config
 * @param {object} pageid - pageid
 * @param {object} comment - comment
 * @return {ExportArticleResult} result - result
 */
async function addComment(page, cfg, pageid, comment) {
  const url =
    cfg.url +
    '/pages/viewpage.action?pageId=' +
    pageid +
    '&showComments=true&showCommentArea=true#addcomment';

  log.debug(url);

  await page.goto(url);
  await page.waitForSelector('.hidden.tinymce-editor');
  await page.type('.hidden.tinymce-editor', comment);
  await page.click('#rte-button-publish');
  await page.waitForNavigation({waitUntil: 'load'}).catch((err) => {
    log.error('confluencebot.addComment:waitForNavigation ', err);
  });
}

exports.addComment = addComment;
