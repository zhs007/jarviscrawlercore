// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
const {parseID} = require('./utils');

/**
 * hao6vResPage - hao6v respage page
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function hao6vResPage(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

  await disableDownloadOthers(page);
  const waitAllResponse = new WaitAllResponse(page);

  await page
      .setViewport({
        width: 1280,
        height: 600,
        deviceScaleFactor: 1,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('hao6vResPage.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const baseurl = url;

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('hao6vResPage.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('hao6vResPage.waitDone timeout');

    log.error('hao6vResPage.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const res = await page
      .$$eval('#endText', (eles) => {
        if (eles.length > 0) {
          const res = {lst: []};

          // table
          const lsttable = eles[0].getElementsByTagName('table');
          if (lsttable.length > 0) {
            const rows = lsttable[0].rows;
            for (let i = 0; i < rows.length; ++i) {
            // rows
              if (rows[i].children.length > 0) {
                const curtd = rows[i].children[0]; // td
                let curtype = 0;
                for (let j = 0; j < curtd.childNodes.length; ++j) {
                // td.childNodes
                  if (curtd.childNodes[j].nodeName == '#text') {
                    const cnodeval = curtd.childNodes[j].nodeValue.trim();
                    if (curtype == 0) {
                      if (cnodeval.indexOf('在线观看') >= 0) {
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({type: 3, url: lsta[0].href});
                        }

                        break;
                      } else if (cnodeval.indexOf('磁力') >= 0) {
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({
                            type: 2,
                            url: lsta[0].href,
                            name: lsta[0].innerText,
                          });
                        }

                        break;
                      } else if (cnodeval.indexOf('电驴') >= 0) {
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({
                            type: 1,
                            url: lsta[0].href,
                            name: lsta[0].innerText,
                          });
                        }

                        break;
                      } else if (cnodeval.indexOf('迅雷') >= 0) {
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({
                            type: 5,
                            url: lsta[0].href,
                            name: lsta[0].innerText,
                          });
                        }

                        break;
                      } else if (cnodeval.indexOf('网盘链接') >= 0) {
                        curtype = 4;
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({
                            type: 5,
                            url: lsta[0].href,
                            name: lsta[0].innerText,
                          });
                        }

                        break;
                      } else {
                        res.lst.push({
                          type: 0,
                          name: rows[i].innerHTML,
                        });

                        break;
                      }
                    } else if (curtype == 4) {
                      if (cnodeval.indexOf('提取码：') >= 0) {
                        const ctqm = cnodeval.split('提取码：');
                        const lsta = rows[i].getElementsByTagName('a');
                        if (lsta.length > 0) {
                          res.lst.push({
                            type: 4,
                            url: lsta[0].href,
                            code: ctqm[ctqm.length - 1],
                          });
                        }

                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          // p
          const lstp = eles[0].getElementsByTagName('p');
          if (lstp.length >= 2) {
            const lstimg = lstp[0].getElementsByTagName('img');
            if (lstimg.length > 0) {
              res.cover = lstimg[0].src;
            }

            // console.log(lstp[1].childNodes);

            let pinfotype = -1;
            for (let i = 0; i < lstp[1].childNodes.length; ++i) {
            // console.log(lstp[1].childNodes[i].nodeName);

              if (lstp[1].childNodes[i].nodeName == '#text') {
                const cnodeval = lstp[1].childNodes[i].nodeValue.trim();
                console.log(cnodeval);
                if (pinfotype == -1) {
                  if (cnodeval.indexOf('◎') >= 0) {
                    pinfotype = 0;
                  }
                }
                if (pinfotype == 0) {
                  if (cnodeval.indexOf('译　　名') >= 0) {
                    const arr = cnodeval.split('译　　名');
                    res.cnTitle = arr[arr.length - 1].trim();
                    console.log(arr);
                  } else if (cnodeval.indexOf('片　　名') >= 0) {
                    const arr = cnodeval.split('片　　名');
                    res.title = arr[arr.length - 1].trim();
                    console.log(arr);
                  } else if (cnodeval.indexOf('导　　演') >= 0) {
                    const arr = cnodeval.split('导　　演');
                    res.fulldirector = arr[arr.length - 1].trim();
                    console.log(arr);

                    break;
                  }
                }
              }
            }
          }

          return res;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('hao6vResPage.$$eval #endText', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: res};
}

exports.hao6vResPage = hao6vResPage;
