const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.techinasia.com/') == 0) {
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
  await page.waitForSelector('.infinite-scroll').catch((err) => {
    console.log('techinasia.article.exportArticle', err);
  });

  const dom = await page.$eval(
      '.site-main-content',
      (element) => {
        return element.innerHTML;
      });

  //   try {
  await page.setContent(dom).catch((err) => {
    console.log('techinasia.article.exportArticle', err);
  });
  //   } catch (err) {
  //     console.log('techinasia.article.exportArticle try', err);
  //   }

  let errret = undefined;
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

      const title = getElement('h1');
      if (title) {
        const objtitle = document.createElement('h1');
        objtitle.innerText = title.innerText;
        objhead.appendChild(objtitle);

        ret.title = objtitle.innerText;
      }

      //   const secondtitle = getElement('h2');
      //   if (secondtitle) {
      //     const objsecondtitle = document.createElement('h2');
      //     objsecondtitle.innerText = secondtitle.innerText;
      //     objhead.appendChild(objsecondtitle);

      //     ret.secondTitle = objsecondtitle.innerText;
      //   }

      //   const imghead = getElement('.article__featured-image');
      //   if (imghead) {
      //     ret.titleImage = await fetchImage(imghead.src);

      //     const curnode = document.createElement('p');
      //     curnode.style.cssText = 'text-align: center;';

      //     const curimg = document.createElement('img');
      //     curimg.src = imghead.src;

      //     curnode.appendChild(curimg);

      //     objhead.appendChild(curnode);
      //   }

      const author = getElement('.author.inline-block');
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

      const articlenode = getElement('.content');
      if (articlenode) {
        for (let i = 0; i < articlenode.children.length; ++i) {
          if (articlenode.children[i].tagName != 'P' &&
            articlenode.children[i].tagName != 'H2' &&
            articlenode.children[i].tagName != 'DIV') {
            continue;
          }

          if (articlenode.children[i].tagName == 'DIV') {
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

                // console.log(curimg.width);
                // console.log(curimg.height);
              };
              curimg.src = curimgs[0].src;

              curnode.appendChild(curimg);

              objarticlebody.appendChild(curnode);
            }
          } else if (articlenode.children[i].tagName == 'P') {
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

                // console.log(curimg.width);
                // console.log(curimg.height);
              };
              curimg.src = curimgs[0].src;

              curnode.appendChild(curimg);

              objarticlebody.appendChild(curnode);
            } else {
              const curnode = document.createElement('p');

              curnode.innerText = articlenode.children[i].innerText;

              ret.paragraphs.push({pt: 1, text: curnode.innerText});

              objarticlebody.appendChild(curnode);
            }
          } else if (articlenode.children[i].tagName == 'H2') {
            const curnode = document.createElement('h2');

            curnode.innerText = articlenode.children[i].innerText;
            // curnode.className = 'article-body-h1';

            ret.paragraphs.push({pt: 3, text: curnode.innerText});

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
  }).catch((err) => {
    console.log('techinasia.article:exportArticle.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regExportArticle('techinasia.article', ismine, exportArticle);
