const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.tmtpost.com/') == 0) {
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
      'article',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

  return await page.evaluate(async () => {
    const ret = {};
    ret.imgs = [];
    ret.paragraphs = [];

    const objbody = getElement('body');
    if (objbody) {
      const objhead = document.createElement('div');
      objhead.className = 'article-head';

      objbody.appendChild(objhead);

      const objarticlebody = document.createElement('div');
      objarticlebody.className = 'article-body';

      objbody.appendChild(objarticlebody);

      // const imghead = getElement('.article-img-box');
      // if (imghead) {
      //   ret.titleImage = await fetchImage(imghead.children[0].src);

      //   const curnode = document.createElement('p');
      //   curnode.style.cssText = 'text-align: center;';

      //   const curimg = document.createElement('img');
      //   curimg.onload = () => {
      //     ret.imgs[ret.imgs.length - 1].width = curimg.width;
      //     ret.imgs[ret.imgs.length - 1].height = curimg.height;

      //     // if (window.waitimgs > 0) {
      //     //   --window.waitimgs;
      //     // }

      //     // console.log(curimg.width);
      //     // console.log(curimg.height);
      //   };
      //   curimg.src = imghead.children[0].src;

      //   curnode.appendChild(curimg);

      //   objhead.appendChild(curnode);
      // }

      const title = getElement('h1');
      if (title) {
        const objtitle = document.createElement('h1');
        objtitle.innerText = title.innerText;
        objhead.appendChild(objtitle);

        ret.title = objtitle.innerText;
      }

      const author = getElement('.color-orange');
      if (author) {
        const objauthor = document.createElement('div');
        objauthor.className = 'article-author';
        objauthor.innerText = author.innerText;
        objhead.appendChild(objauthor);

        ret.author = objauthor.innerText;
      }

      const articletime = getElement('.time');
      if (articletime) {
        const objarticletime = document.createElement('div');
        objarticletime.className = 'article-time';
        objarticletime.innerText = articletime.innerText;
        objhead.appendChild(objarticletime);

        ret.writeTime = objarticletime.innerText;
      }

      const objsummary = getElement('.post-abstract');
      if (objsummary) {
        const objarticlesummary = document.createElement('div');
        objarticlesummary.className = 'article-summary';

        objarticlesummary.innerText = objsummary.innerText;
        objhead.appendChild(objarticlesummary);

        ret.summary = objarticlesummary.innerText;
      }

      const articlenode = getElement('.inner');
      if (articlenode) {
        for (let i = 0; i < articlenode.childNodes.length; ++i) {
          if (articlenode.childNodes[i].nodeName == '#comment') {
            break;
          }

          if (articlenode.childNodes[i].nodeName == '#text') {
            continue;
          }

          if (articlenode.childNodes[i].nodeName == 'P' &&
              articlenode.childNodes[i].className == 'caption') {
            continue;
          }

          const curimgs = articlenode.childNodes[i].getElementsByTagName('img');
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
          } else if (articlenode.childNodes[i].nodeName == 'H2') {
            const curnode = document.createElement('h2');

            curnode.innerText = articlenode.childNodes[i].innerText;
            // curnode.className = 'article-body-h1';

            ret.paragraphs.push({pt: 3, text: curnode.innerText});

            objarticlebody.appendChild(curnode);
          } else {
            const curnode = document.createElement('p');

            curnode.innerText = articlenode.childNodes[i].innerText;

            ret.paragraphs.push({pt: 1, text: curnode.innerText});

            objarticlebody.appendChild(curnode);
          }
        }
      }
    }

    const lsttag = $('.column-link');
    if (lsttag.length > 0) {
      ret.tags = [];

      for (let i = 0; i < lsttag.length; ++i) {
        ret.tags.push(lsttag[i].innerText);
      }
    }

    clearArticleElement(objbody);

    ret.article = objbody.innerText;

    return ret;
  });
}

mgrPlugins.regPlugin('tmtpost.article', ismine, exportArticle);
