const {mgrPlugins} = require('./pluginsmgr');

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
 * ismine
 * @param {string} url - URL
 * @param {object} page -
 */
async function proc(url, page) {
  const dom = await page.$eval(
      '.aw-mod.aw-question-detail',
      (element) => {
        return element.innerHTML;
      });

  await page.setContent(dom);

  await formatArticle(page);
}

/**
 * formatArticle
 * @param {object} page - page
 */
async function formatArticle(page) {
  await page.evaluate(() => {
    const lstmh = $('.mod-head');
    if (lstmh && lstmh.length > 0) {
      const mh = lstmh[0];

      mh.style.cssText = '';
      mh.className = 'article-head';

      let authorname = '';
      const lstauthorname = $('span.name');
      if (lstauthorname && lstauthorname.length > 0) {
        authorname = lstauthorname[0].innerText;
      }

      let curtime = '';
      const lstcurtime = $('span.time');
      if (lstcurtime && lstcurtime.length > 0) {
        const varreg = /([1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d)/;
        curtime = varreg.exec(lstcurtime[0].innerText)[0];
      }

      for (let i = 0; i < mh.childNodes.length; ) {
        if (mh.childNodes[i].nodeName == '#text' ||
        mh.childNodes[i].nodeName == '#comment' ||
        mh.childNodes[i].nodeName == 'DIV') {
          mh.childNodes[i].remove();
        } else {
          ++i;
        }
      }

      const authotnode = document.createElement('p');
      authotnode.innerHTML = '<p>' + authorname + '</p>';
      mh.appendChild(authotnode);

      const curtimenode = document.createElement('p');
      curtimenode.innerHTML = '<p>' + curtime + '</p>';
      mh.appendChild(curtimenode);
    }

    const lstmb = $('.mod-body');
    if (lstmb && lstmb.length > 0) {
      const mb = lstmb[0];

      mb.style.cssText = '';
      mb.className = 'article-body';

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
    }

    const lststyle = $('style');
    if (lststyle && lststyle.length > 0) {
      for (let i = 0; i < lststyle.length; ++i) {
        lststyle[0].remove();
      }
    }

    const lstp = $('p');
    if (lstp && lstp.length > 0) {
      for (let i = 0; i < lstp.length; ++i) {
        const curimgs = lstp[i].getElementsByTagName('img');
        if (!curimgs || curimgs.length == 0) {
          lstp[i].innerHTML = lstp[i].innerText;
          lstp[i].style.cssText = '';
        } else {
          lstp[i].style.cssText = 'text-align: center;';

          lstp[i].appendChild(curimgs[0]);

          for (let j = 0; j < lstp[i].children.length; ) {
            if (lstp[i].children[j].tagName != 'IMG') {
              lstp[i].children[j].remove();
            } else {
              ++j;
            }
          }
        }
      }
    }
  });

  // await page.$eval(
  //     '.mod-body',
  //     (ele) => {
  //       for (let i = 0; i < ele.children.length; ) {
  //         if (ele.children[i].id != 'message') {
  //           ele.children[i].remove();
  //         } else {
  //           ++i;
  //         }
  //       }
  //     });

  // await page.$eval(
  //     'style',
  //     (lstele) => {
  //       for (let i = 0; i < lstele.length; ) {
  //         lstele[i].remove();
  //       }
  //     });

  // await page.$$eval(
  //     'p',
  //     (lstele) => {
  //       for (let i = 0; i < lstele.length; ) {
  //         lstele[i].innerText = lstele[i].innerHTML;
  //         lstele[i].style.cssText = '';
  //       }
  //     });
}

mgrPlugins.regPlugin('baijingapp.article', ismine, proc);
