const {mgrPlugins} = require('./pluginsmgr');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('https://www.huxiu.com/article/') == 0) {
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
      '.article-wrap',
      (element) => {
        return element.innerHTML;
      });

  //   console.log('geekpark.article');
  //   console.log(dom.length);

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

      const imghead = getElement('.article-img-box');
      if (imghead) {
        ret.titleImage = await fetchImage(imghead.children[0].src);

        const curnode = document.createElement('p');
        curnode.style.cssText = 'text-align: center;';

        const curimg = document.createElement('img');
        curimg.onload = () => {
          ret.imgs[ret.imgs.length - 1].width = curimg.width;
          ret.imgs[ret.imgs.length - 1].height = curimg.height;

          // if (window.waitimgs > 0) {
          //   --window.waitimgs;
          // }

          // console.log(curimg.width);
          // console.log(curimg.height);
        };
        curimg.src = imghead.children[0].src;

        curnode.appendChild(curimg);

        objhead.appendChild(curnode);
      }

      const title = getElement('.t-h1');
      if (title) {
        const objtitle = document.createElement('h1');
        objtitle.innerText = title.innerText;
        objhead.appendChild(objtitle);

        ret.title = objtitle.innerText;
      }

      const author = getElement('.author-name');
      if (author) {
        const objauthor = document.createElement('div');
        objauthor.className = 'article-author';
        objauthor.innerText = author.innerText;
        objhead.appendChild(objauthor);

        ret.author = objauthor.innerText;
      }

      const articletime = getElement('.article-time.pull-left');
      if (articletime) {
        const objarticletime = document.createElement('div');
        objarticletime.className = 'article-time';
        objarticletime.innerText = articletime.innerText;
        objhead.appendChild(objarticletime);

        ret.writeTime = objarticletime.innerText;
      }

      const articlenode = getElement('.article-content-wrap');
      if (articlenode) {
        for (let i = 0; i < articlenode.children.length; ++i) {
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
          } else if (articlenode.children[i].className == 'text-big-title') {
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

mgrPlugins.regExportArticle('huxiu.article', ismine, exportArticle);
