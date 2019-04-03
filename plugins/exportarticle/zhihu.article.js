const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://zhuanlan.zhihu.com/p/') == 0) {
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
  const dom = await page.$eval(
      '.Post-content',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

  const ret = await page.evaluate(async () => {
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

      const imghead = getElement('.TitleImage');
      if (imghead) {
        ret.titleImage = await fetchImage(imghead.src);

        const curnode = document.createElement('p');
        curnode.style.cssText = 'text-align: center;';

        const curimg = document.createElement('img');
        curimg.src = imghead.src;

        curnode.appendChild(curimg);

        objhead.appendChild(curnode);
      }

      const title = getElement('h1');
      if (title) {
        const objtitle = document.createElement('h1');
        objtitle.innerText = title.innerText;
        objhead.appendChild(objtitle);

        ret.title = objtitle.innerText;
      }

      const author = getElement('.AuthorInfo-head');
      if (author) {
        const objauthor = document.createElement('div');
        objauthor.className = 'article-author';
        objauthor.innerText = author.children[0].innerText;
        objhead.appendChild(objauthor);

        ret.author = objauthor.innerText;
      }

      const articletime = getElement('.ContentItem-time');
      if (articletime) {
        const objarticletime = document.createElement('div');
        objarticletime.className = 'article-time';

        const varreg = new RegExp('([1-9]\\d{3}-(0[1-9]|1[0-2])-' +
          '(0[1-9]|[1-2][0-9]|3[0-1]))', 'ig');

        curtime = varreg.exec(articletime.innerText)[0];

        objarticletime.innerText = curtime;// articletime.innerText;
        objhead.appendChild(objarticletime);

        ret.writeTime = objarticletime.innerText;
      }

      const articlenode = getElement('.RichText.ztext.Post-RichText');
      if (articlenode) {
        // if (articlenode.children.length > 1) {
        //   articlenode = articlenode.children[1];
        // }

        for (let i = 0; i < articlenode.children.length; ++i) {
          if (articlenode.children[i].tagName != 'P' &&
              articlenode.children[i].tagName != 'H2' &&
              articlenode.children[i].tagName != 'FIGURE') {
            continue;
          }

          if (articlenode.children[i].tagName == 'FIGURE') {
            let curimgs = articlenode.children[i].getElementsByTagName('div');
            if (curimgs.length > 0) {
              ret.imgs.push(await fetchImage(curimgs[0].dataset['src']));
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

                // console.log(curimg.width);
                // console.log(curimg.height);
              };

              curimg.src = curimgs[0].dataset['src'];
              ++window.waitimgs;

              curnode.appendChild(curimg);

              objarticlebody.appendChild(curnode);

              continue;
            }

            curimgs = articlenode.children[i].getElementsByTagName('img');
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
            }
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
  });

  await page.waitForFunction('window.waitimgs == 0').catch((err) => {
    console.log('zhihu.article.formatArticle', err);
  });

  return ret;
}

mgrPlugins.regPlugin('zhihu.article', ismine, exportArticle);
