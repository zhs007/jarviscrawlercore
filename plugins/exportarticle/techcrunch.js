const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://techcrunch.com/') == 0) {
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
      '#tc-main-content',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

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

      const secondtitle = getElement('h2');
      if (secondtitle) {
        const objsecondtitle = document.createElement('h2');
        objsecondtitle.innerText = secondtitle.innerText;
        objhead.appendChild(objsecondtitle);

        ret.secondTitle = objsecondtitle.innerText;
      }

      const imghead = getElement('.article__featured-image');
      if (imghead) {
        ret.titleImage = await fetchImage(imghead.src);

        const curnode = document.createElement('p');
        curnode.style.cssText = 'text-align: center;';

        const curimg = document.createElement('img');
        curimg.src = imghead.src;

        curnode.appendChild(curimg);

        objhead.appendChild(curnode);
      }

      const author = getElement('.article__byline');
      if (author) {
        cura = author.getElementsByTagName('a');
        if (cura && cura.length > 0) {
          const objauthor = document.createElement('div');
          objauthor.className = 'article-author';
          objauthor.innerText = cura[0].innerText;
          objhead.appendChild(objauthor);

          ret.author = objauthor.innerText;
        }
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

      const articlenode = getElement('.article-content');
      if (articlenode) {
        for (let i = 0; i < articlenode.children.length; ++i) {
          if (articlenode.children[i].tagName != 'P' &&
            articlenode.children[i].tagName != 'DIV') {
            continue;
          }

          if (articlenode.children[i].tagName == 'P') {
            const curnode = document.createElement('p');

            curnode.innerText = articlenode.children[i].innerText;

            ret.paragraphs.push({pt: 1, text: curnode.innerText});

            objarticlebody.appendChild(curnode);
          } else {
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

            const curp = articlenode.children[i].getElementsByTagName('p');
            for (let j = 0; j < curp.length; ++j) {
              const curnode = document.createElement('p');

              curnode.innerText = curp[j].innerText;

              ret.paragraphs.push({pt: 5, text: curnode.innerText});

              objarticlebody.appendChild(curnode);
            }
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
    console.log('techcrunch.article:exportArticle.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regExportArticle('techcrunch.article', ismine, exportArticle);
