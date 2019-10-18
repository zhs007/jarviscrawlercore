const {mgrPlugins} = require('./pluginsmgr');
const log = require('../../src/log');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('medium.com/') > 0) {
    return true;
  }

  return false;
}

/**
 * exportArticle
 * @param {object} page - page
 * @return {ExportArticleResult} result - result
 */
async function exportArticle(page) {
  const dom = await page.$eval('main', (element) => {
    return element.innerHTML;
  });

  await page.setContent(dom);

  let errret = undefined;
  const ret = await page
      .evaluate(async () => {
        const ret = {};
        ret.imgs = [];
        ret.paragraphs = [];

        window.waitimgs = 0;

        const objbody = getElement('body');
        if (objbody) {
          const objhead = document.createElement('div');
          objhead.className = 'article-head';

          objbody.appendChild(objhead);

          const objarticlebody = document.createElement('div');
          objarticlebody.className = 'article-body';

          objbody.appendChild(objarticlebody);

          const title = getElement('h1');
          if (title) {
            const objtitle = document.createElement('h1');
            objtitle.innerText = title.innerText;
            objhead.appendChild(objtitle);

            ret.title = objtitle.innerText;
          }

          const author = getElement(
              '.ds-link.ds-link--styleSubtle.ui-captionStrong.u-inlineBlock.link.link--darken.link--darker'
          );
          if (author) {
            const objauthor = document.createElement('div');
            objauthor.className = 'article-author';
            objauthor.innerText = author.innerText;
            objhead.appendChild(objauthor);

            ret.author = objauthor.innerText;
          }

          const articletime = getElement('time');
          if (articletime) {
            const objarticletime = document.createElement('div');
            objarticletime.className = 'article-time';

            curtime = getElementAttributes(articletime, 'datetime');

            objarticletime.innerText = curtime;
            objhead.appendChild(objarticletime);

            ret.writeTime = objarticletime.innerText;
          }

          const lstsection = $('.section-inner.sectionLayout--insetColumn');
          for (let i = 0; i < lstsection.length; ++i) {
            const articlenode = lstsection[i];
            for (let i = 0; i < articlenode.children.length; ++i) {
              if (
                articlenode.children[i].tagName != 'P' &&
              articlenode.children[i].tagName != 'H3' &&
              articlenode.children[i].tagName != 'OL' &&
              articlenode.children[i].tagName != 'PRE'
              ) {
                continue;
              }

              if (articlenode.children[i].tagName == 'H3') {
                const curnode = document.createElement('h2');

                curnode.innerText = articlenode.children[i].innerText;

                ret.paragraphs.push({pt: 3, text: curnode.innerText});

                objarticlebody.appendChild(curnode);
              } else if (articlenode.children[i].tagName == 'P') {
                const curnode = document.createElement('p');

                curnode.innerText = articlenode.children[i].innerText;

                ret.paragraphs.push({pt: 1, text: curnode.innerText});

                objarticlebody.appendChild(curnode);
              } else if (articlenode.children[i].tagName == 'OL') {
                const curnode = document.createElement('h4');

                curnode.innerText = articlenode.children[i].innerText;

                ret.paragraphs.push({pt: 4, text: curnode.innerText});

                objarticlebody.appendChild(curnode);
              } else if (articlenode.children[i].tagName == 'PRE') {
                const curnode = document.createElement('p');

                curnode.innerText = articlenode.children[i].innerText;

                ret.paragraphs.push({pt: 4, text: curnode.innerText});

                objarticlebody.appendChild(curnode);
              }
            }
          }
        }

        // const lsttag = $('.column-link');
        // if (lsttag.length > 0) {
        //   ret.tags = [];

        //   for (let i = 0; i < lsttag.length; ++i) {
        //     ret.tags.push(lsttag[i].innerText);
        //   }
        // }

        clearArticleElement(objbody);

        ret.article = objbody.innerText;

        return ret;
      })
      .catch((err) => {
        log.error('medium.article:exportArticle.evaluate', err);

        errret = err;
      });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regExportArticle('medium.article', ismine, exportArticle);
