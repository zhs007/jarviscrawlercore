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
 * ismine
 * @param {string} url - URL
 * @param {object} page -
 */
async function proc(url, page) {
  // await page.waitForNavigation({waitUntil: 'domcontentloaded'}).catch((err) => {
  //   console.log('catch a err ', err);
  // });

  const dom = await page.$eval(
      '.Post-content',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);
  // console.log('zhihu');

  // const ele = await page.$(
  //     '.VagueImage.origin_image.zh-lightbox-thumb');

  // // console.log(ele.asElement());

  // const properties = await ele.getProperties();
  // for (const key of properties.keys()) {
  //   console.log(key);
  // }

  // const ele = await page.$eval(
  //     // '.RichText.ztext.Post-RichText',
  //     // '.VagueImage.origin_image.zh-lightbox-thumb',
  //     'figure',
  //     (element) => {
  //       console.log(element);

  //       return element.innerHTML;
  //     });

  // console.log(ele);

  // const jval = await ele.jsonValue();
  // console.log(ele);
  // console.log(jval);
}

/**
 * formatArticle
 * @param {object} page - page
 * @return {ExportArticleResult} result - result
 */
async function formatArticle(page) {
  const ret = await page.evaluate(async () => {
    const ret = {};
    ret.imgs = [];

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
            const curimgs = articlenode.children[i].getElementsByTagName('div');
            if (curimgs.length > 0) {
              ret.imgs.push(await fetchImage(curimgs[0].dataset['src']));

              const curnode = document.createElement('p');
              curnode.style.cssText = 'text-align: center;';

              const curimg = document.createElement('img');
              curimg.onload = () => {
                ret.imgs[ret.imgs.length - 1].width = curimg.width;
                ret.imgs[ret.imgs.length - 1].height = curimg.height;

                // console.log(curimg.width);
                // console.log(curimg.height);
              };

              curimg.src = curimgs[0].dataset['src'];

              curnode.appendChild(curimg);

              objarticlebody.appendChild(curnode);
            }
          } else if (articlenode.children[i].tagName == 'H2') {
            const curnode = document.createElement('h2');

            curnode.innerText = articlenode.children[i].innerText;
            // curnode.className = 'article-body-h1';

            objarticlebody.appendChild(curnode);
          } else {
            const curnode = document.createElement('p');

            curnode.innerText = articlenode.children[i].innerText;

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

    ret.article = objbody.innerHTML;

    return ret;
  });

  await page.waitForNavigation({waitUntil: 'networkidle0'}).catch((err) => {
    console.log('catch a err ', err);
  });

  return ret;
}

mgrPlugins.regPlugin('zhihu.article', ismine, proc, formatArticle);
