const {mgrPlugins} = require('./pluginsmgr');
// const {jarviscrawlercore} = require('../../proto/result');
// const images = require('images');

/**
 * ismine
 * @param {string} url - URL
 * @return {bool} ismine
 */
function ismine(url) {
  if (url.indexOf('http://www.baijingapp.com/article/') == 0) {
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
      '.aw-mod.aw-question-detail',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

  let errret = undefined;
  const ret = await page.evaluate(async () => {
    const ret = {};
    ret.imgs = [];
    ret.paragraphs = [];
    // const ret = new jarviscrawlercore.ExportArticleResult();

    const body = $('body')[0];

    const lstmh = $('.mod-head');
    if (lstmh && lstmh.length > 0) {
      // const mh = lstmh[0];

      const mh = document.createElement('div');
      mh.className = 'article-head';

      let authorname = '';
      const lstauthorname = $('span.name');
      if (lstauthorname && lstauthorname.length > 0) {
        authorname = lstauthorname[0].innerText;

        ret.author = authorname;
      }

      let curtime = '';
      const lstcurtime = $('span.time');
      if (lstcurtime && lstcurtime.length > 0) {
        const varreg = new RegExp('([1-9]\\d{3}-(0[1-9]|1[0-2])-' +
        '(0[1-9]|[1-2][0-9]|3[0-1])\\s+(20|21|22|23|[0-1]\\d):[0-5]\\d)', 'ig');

        curtime = varreg.exec(lstcurtime[0].innerText)[0];

        ret.writeTime = curtime;
      }

      for (let i = 0; i < lstmh[0].childNodes.length; ++i) {
        if (lstmh[0].childNodes[i].tagName == 'H1') {
          mh.appendChild(lstmh[0].childNodes[i]);

          ret.title = lstmh[0].childNodes[i].innerText;
          // mh.childNodes[i].remove();
        }
      }

      const authotnode = document.createElement('div');
      authotnode.className = 'article-author';
      authotnode.innerText = authorname;
      mh.appendChild(authotnode);

      const curtimenode = document.createElement('div');
      curtimenode.className = 'article-time';
      curtimenode.innerText = curtime;
      mh.appendChild(curtimenode);

      body.appendChild(mh);
      // lstmh[0].parentNode.appendChild(mh);
      // lstmh[0].remove();
    }

    const lstmb = $('.mod-body');
    if (lstmb && lstmb.length > 0) {
      const mb = lstmb[0];

      const newbody = document.createElement('div');
      newbody.className = 'article-body';

      // mb.style.cssText = '';
      // mb.className = 'article-body';

      for (let i = 0; i < mb.children.length; ) {
        if (mb.children[i].id != 'message') {
          mb.children[i].remove();
        } else {
          ++i;
        }
      }

      for (let i = 0; i < mb.childNodes.length; ) {
        if (mb.childNodes[i].nodeName == '#text' ||
        mb.childNodes[i].nodeName == '#comment') {
          mb.childNodes[i].remove();
        } else {
          ++i;
        }
      }

      const lstp = $('p');
      if (lstp && lstp.length > 0) {
        for (let i = 0; i < lstp.length; ++i) {
          const curimgs = lstp[i].getElementsByTagName('img');
          if (!curimgs || curimgs.length == 0) {
            // lstp[i].innerHTML = lstp[i].innerText;
            // lstp[i].style.cssText = '';

            const curnode = document.createElement('p');
            curnode.innerText = lstp[i].innerText;

            ret.paragraphs.push({pt: 1, text: curnode.innerText});

            newbody.appendChild(curnode);
          } else {
            // lstp[i].style.cssText = 'text-align: center;';

            // lstp[i].appendChild(curimgs[0]);

            // const response = await fetch(curimgs[0].src);
            // const imgbuf = await response.arrayBuffer();
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

            newbody.appendChild(curnode);

            // for (let j = 0; j < lstp[i].children.length; ) {
            //   if (lstp[i].children[j].tagName != 'IMG') {
            //     lstp[i].children[j].remove();
            //   } else {
            //     ++j;
            //   }
            // }
          }
        }
      }

      body.appendChild(newbody);
      // lstmb[0].parentNode.appendChild(newbody);
      // lstmb[0].remove();

      // for (let i = 0; i < mb.children.length; ++i) {
      //   if (mb.children[i].id == 'message') {
      //     mb.children[i].remove();
      //     break;
      //   }
      // }
    }

    // for (let i = 0; i < body.childNodes.length; ) {
    //   if (body.childNodes[i].className != 'article-body' &&
    //   body.childNodes[i].className != 'article-head') {
    //     body.childNodes[i].remove();
    //   } else {
    //     ++i;
    //   }
    // }

    clearArticleElement(body);

    ret.article = body.innerText;

    // const lststyle = $('style');
    // if (lststyle && lststyle.length > 0) {
    //   for (let i = 0; i < lststyle.length; ++i) {
    //     lststyle[0].remove();
    //   }
    // }

    return ret;
  }).catch((err) => {
    console.log('baijingapp.article:exportArticle.evaluate', err);

    errret = err;
  });

  return {
    result: ret,
    err: errret,
  };
}

mgrPlugins.regExportArticle('baijingapp.article', ismine, exportArticle);
