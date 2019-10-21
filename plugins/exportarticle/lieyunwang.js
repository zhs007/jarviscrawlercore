const {mgrPlugins} = require('./pluginsmgr');
const log = require('../../src/log');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.lieyunwang.com/archives/') == 0) {
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
  const dom = await page.$eval('.article-main', (element) => {
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

          const imghead = getElement('.img-fuil.img-round');
          if (imghead) {
            ret.titleImage = await fetchImage(imghead.src);

            const curnode = document.createElement('p');
            curnode.style.cssText = 'text-align: center;';

            const curimg = document.createElement('img');
            curimg.src = imghead.src;

            curnode.appendChild(curimg);

            objhead.appendChild(curnode);
          }

          const articletime = getElement('.time');
          if (articletime) {
            ret.writeTime = articletime.innerText;
            articletime.remove();
          }

          const title = getElement('h1');
          if (title) {
            const objtitle = document.createElement('h1');
            objtitle.innerText = title.innerText;
            objhead.appendChild(objtitle);

            ret.title = objtitle.innerText;

            const objarticletime = document.createElement('div');
            objarticletime.className = 'article-time';

            objarticletime.innerText = ret.writeTime;
            objhead.appendChild(objarticletime);
          }

          // const author = getElement('.author');
          // if (author) {
          //   const objauthor = document.createElement('div');
          //   objauthor.className = 'article-author';
          //   objauthor.innerText = author.innerText;
          //   objhead.appendChild(objauthor);

          //   ret.author = objauthor.innerText;
          // }

          const objsummary = getElement('.article-digest.mb20');
          if (objsummary) {
            const objarticlesummary = document.createElement('div');
            objarticlesummary.className = 'article-summary';

            objarticlesummary.innerText = objsummary.innerText;
            objhead.appendChild(objarticlesummary);

            ret.summary = objarticlesummary.innerText;
          }

          const articlenode = getElement('.main-text');
          if (articlenode) {
          // if (articlenode.children.length > 1) {
          //   articlenode = articlenode.children[1];
          // }

            for (let i = 0; i < articlenode.children.length; ++i) {
              if (
                articlenode.children[i].tagName != 'P' &&
              articlenode.children[i].tagName != 'H2'
              ) {
                continue;
              }

              const curimgs = articlenode.children[i].getElementsByTagName('img');
              if (curimgs.length > 0) {
                ret.imgs.push(await fetchImage(curimgs[0].src));
                ret.paragraphs.push({pt: 2, imgURL: curimgs[0].src});

                const curnode = document.createElement('p');
                curnode.style.cssText = 'text-align: center;';

                const curimg = document.createElement('img');
                curimg.onload = () => {
                  ret.imgs[ret.imgs.length - 1].width = curimg.width;
                  ret.imgs[ret.imgs.length - 1].height = curimg.height;

                  if (window.waitimgs > 0) {
                    --window.waitimgs;
                  }
                };

                curimg.src = curimgs[0].src;
                ++window.waitimgs;

                curnode.appendChild(curimg);

                objarticlebody.appendChild(curnode);

                continue;
              } else if (articlenode.children[i].tagName == 'H2') {
                const curnode = document.createElement('h2');

                curnode.innerText = articlenode.children[i].innerText;
                // curnode.className = 'article-body-h1';

                ret.paragraphs.push({pt: 3, text: curnode.innerText});

                objarticlebody.appendChild(curnode);
              } else {
                const curnode = document.createElement('p');

                curnode.innerText = articlenode.children[i].innerText;

                ret.paragraphs.push({pt: 1, text: curnode.innerText});

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
        log.error('lieyunwang.article:exportArticle.evaluate', err);

        errret = err;
      });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regExportArticle('lieyunwang.article', ismine, exportArticle);
