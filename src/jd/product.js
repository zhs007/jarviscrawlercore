const {
  sleep,
  clearCookies,
  clearSessionStorage,
  clearLocalStorage,
  clearIndexedDB,
} = require('../utils');
const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {parsePercent, parseMoney, checkBan} = require('./utils');

/**
 * getComments - get comments
 * @param {object} page - page
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getComments(page, waitAllResponse, timeout) {
  let awaiterr = undefined;

  await page
      .$$eval('#detail', (eles) => {
        if (eles.length > 0) {
          const lstli = eles[0].getElementsByTagName('li');
          for (let i = 0; i < lstli.length; ++i) {
            if (lstli[i].innerText.indexOf('商品评价') == 0) {
              lstli[i].className = 'jcjdcomments';

              return;
            }
          }
        }
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getComments#detail ' + awaiterr);

    return {error: err};
  }

  const licomment = await page.$('.jcjdcomments');
  if (licomment != undefined) {
    await licomment.hover().catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('getComments.hover ' + awaiterr);

      return {error: err};
    }

    await sleep(3 * 1000);

    await licomment.click().catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('getComments.click ' + awaiterr);

      return {error: err};
    }

    const isok = await waitAllResponse.waitDone(timeout);
    if (!isok) {
      return {error: new Error('getComments.waitDone timeout.')};
    }

    waitAllResponse.reset();

    const ret = {};

    ret.percent = await page
        .$$eval('.percent-con', (eles) => {
          if (eles.length > 0) {
            return eles[0].innerText;
          }

          return '';
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('getComments.percent-con', awaiterr);

      return {error: awaiterr.toString()};
    }

    const percent = parsePercent(ret.percent);
    if (percent == undefined) {
      const err = new Error('getComments.parsePercent return undefined');

      log.error('getComments.parsePercent', err);

      return {error: err.toString()};
    }

    if (percent.err) {
      log.error('getComments.parsePercent', percent.err);

      return {error: percent.err.toString()};
    }

    ret.percent = percent.percent;

    ret.tags = await page
        .$$eval('.percent-info', (eles) => {
          if (eles.length > 0) {
            const tags = [];
            const lsttag = eles[0].getElementsByTagName('span');

            for (let i = 0; i < lsttag.length; ++i) {
              tags.push(lsttag[i].innerText);
            }

            return tags;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('getComments.percent-con', awaiterr);

      return {error: awaiterr.toString()};
    }

    ret.lst = await page
        .$$eval('.J-comments-list.comments-list.ETab', (eles) => {
          if (eles.length > 0) {
            const lstsmall = eles[0].getElementsByClassName('tab-main small');
            if (lstsmall.length > 0) {
              const lst = [];
              const lstli = lstsmall[0].getElementsByTagName('li');
              for (let i = 0; i < lstli.length; ++i) {
                const cli = {};

                if (
                  lstli[i].className == 'current' ||
                lstli[i].className == 'J-addComment'
                ) {
                  cli.type = lstli[i].innerText;

                  if (lstli[i].dataset && lstli[i].dataset.num) {
                    cli.nums = lstli[i].dataset.num;
                  }

                  lst.push(cli);
                } else if (lstli[i].className == '') {
                  cli.type = lstli[i].innerText;

                  if (lstli[i].dataset && lstli[i].dataset.num) {
                    cli.nums = lstli[i].dataset.num;
                  }

                  lst.push(cli);
                }
              }

              return lst;
            }
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('getComments.percent-con', awaiterr);

      return {error: awaiterr.toString()};
    }

    if (ret.lst) {
      for (let i = 0; i < ret.lst.length; ++i) {
        try {
          ret.lst[i].nums = parseInt(ret.lst[i].nums);
        } catch (err) {
          log.error('getComments.parseInt(lst[i].nums)', err);

          return {error: err.toString()};
        }
      }
    }

    return {ret: ret};
  }

  return undefined;
}

/**
 * getPingou - get pingou
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getPingou(page, timeout) {
  let awaiterr = undefined;
  const ret = {};

  const pingouret = await page
      .$$eval('.activity-message', (eles) => {
        if (eles.length > 0) {
          const pingouret = {};
          const lstitem = eles[0].getElementsByClassName('item');
          if (lstitem.length == 2) {
            const lstc = lstitem[0].getElementsByClassName('J-count');
            if (lstc.length > 0) {
              pingouret.preOrders = lstc[0].innerText;
            }

            const lstt = lstitem[1].getElementsByClassName('J-time');
            if (lstt.length > 0) {
              pingouret.strLastTime = lstt[0].innerText;
            }
          }

          return pingouret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.activity-message', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (pingouret != undefined) {
    try {
      pingouret.preOrders = parseInt(pingouret.preOrders);
    } catch (err) {
      log.error('jdProduct.pingouret.parseInt', err);

      return {error: err.toString()};
    }

    ret.pingou = {
      preOrders: pingouret.preOrders,
      strLastTime: pingouret.strLastTime,
    };
  }

  const pingouprice = await page
      .$$eval('.summary-price-wrap', (eles) => {
        if (eles.length > 0) {
          const lst = eles[0].getElementsByClassName('summary-price');
          const pingouprice = {};
          for (let i = 0; i < lst.length; ++i) {
            const jp = lst[i].getElementsByClassName('price J-earnest');
            if (jp.length > 0) {
              pingouprice.scheduledPrice = jp[0].innerText;
            }

            const p = lst[i].getElementsByClassName('price J-presale-price');
            if (p.length > 0) {
              pingouprice.price = p[0].innerText;
            }
          }

          return pingouprice;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.summary-price-wrap', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (pingouprice != undefined) {
    if (ret.pingou == undefined) {
      ret.pingou = {};
    }

    try {
      if (pingouprice.scheduledPrice) {
        pingouprice.scheduledPrice = parseFloat(pingouprice.scheduledPrice);
      }

      if (pingouprice.price) {
        pingouprice.price = parseFloat(pingouprice.price);
      }
    } catch (err) {
      log.error('jdProduct.pingouprice.parseFloat', err);

      return {error: err.toString()};
    }

    ret.pingou.scheduledPrice = pingouprice.scheduledPrice;
    ret.pingou.price = pingouprice.price;
  }

  return {ret: ret.pingou};
}

/**
 * getNormalPrice - get normal price
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getNormalPrice(page, timeout) {
  let awaiterr = undefined;

  let ret = await page
      .$$eval('#summary', (eles) => {
        if (eles.length > 0) {
          const ret = {};

          const lstprice = document.getElementById('jd-price');
          if (lstprice) {
            ret.price = lstprice.innerText;
          } else {
            lstprice = eles[0].getElementsByClassName('p-price');
            if (lstprice.length > 0) {
              ret.price = lstprice[0].innerText;
            }
          }

          const lstoldprice = document.getElementById('page_maprice');
          if (lstoldprice) {
            ret.oldPrice = lstoldprice.innerText;
          }

          const lstquan = eles[0].getElementsByClassName('quan-item');
          if (lstquan.length > 0) {
            ret.coupons = [];
            for (let i = 0; i < lstquan.length; ++i) {
              ret.coupons.push(lstquan[i].innerText);
            }
          }

          const lstprom = eles[0].getElementsByClassName('prom-item');
          if (lstprom.length > 0) {
            ret.promotionals = [];
            for (let i = 0; i < lstprom.length; ++i) {
              if (lstprom[i].children.length >= 2) {
                ret.promotionals.push({
                  title: lstprom[i].children[0].innerText,
                  info: lstprom[i].children[1].innerText,
                });
              }
            }
          }

          return ret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getNormalPrice#summary', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (ret == undefined) {
    ret = await page
        .$$eval('.summary', (eles) => {
          if (eles.length > 0) {
            const ret = {};

            let lstprice = document.getElementById('jd-price');
            if (lstprice) {
              ret.price = lstprice.innerText;
            } else {
              lstprice = eles[0].getElementsByClassName('p-price');
              if (lstprice.length > 0) {
                ret.price = lstprice[0].innerText;
              }
            }

            const lstoldprice = document.getElementById('page_maprice');
            if (lstoldprice) {
              ret.oldPrice = lstoldprice.innerText;
            }

            const lstquan = eles[0].getElementsByClassName('quan-item');
            if (lstquan.length > 0) {
              ret.coupons = [];
              for (let i = 0; i < lstquan.length; ++i) {
                ret.coupons.push(lstquan[i].innerText);
              }
            }

            const lstprom = eles[0].getElementsByClassName('prom-item');
            if (lstprom.length > 0) {
              ret.promotionals = [];
              for (let i = 0; i < lstprom.length; ++i) {
                if (lstprom[i].children.length >= 2) {
                  ret.promotionals.push({
                    title: lstprom[i].children[0].innerText,
                    info: lstprom[i].children[1].innerText,
                  });
                }
              }
            }

            return ret;
          }

          return undefined;
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('getNormalPrice#summary', awaiterr);

      return {error: awaiterr.toString()};
    }
  }

  if (ret) {
    if (ret.price) {
      const priceret = parseMoney(ret.price);
      if (priceret.err) {
        log.error('getNormalPrice.parseMoney.price', priceret.err);

        return {error: priceret.err.toString()};
      }

      ret.price = priceret.money;
    }

    if (ret.oldPrice) {
      const priceret = parseMoney(ret.oldPrice);
      if (priceret.err) {
        log.error('getNormalPrice.parseMoney.oldPrice', priceret.err);

        return {error: priceret.err.toString()};
      }

      ret.oldPrice = priceret.money;
    }
  }

  return {ret: ret};
}

/**
 * getShangou - get shangou
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getShangou(page, timeout) {
  let awaiterr = undefined;

  const sangou = {};

  const lasttime = await page
      .$$eval('.activity-message', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getShangou.activity-message', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (lasttime) {
    sangou.strLastTime = lasttime;
  }

  const price = await page
      .$$eval('.summary-price-wrap', (eles) => {
        if (eles.length > 0) {
          const lstp = eles[0].getElementsByClassName('p-price');
          if (lstp.length > 0) {
            return lstp[0].innerText;
          }
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getShangou.summary-price-wrap', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (price) {
    const priceret = parseMoney(price);
    if (priceret.err) {
      log.error('getShangou.parseMoney.price', priceret.err);

      return {error: priceret.err.toString()};
    }

    sangou.price = priceret.money;
  }

  const oldprice = await page
      .$$eval('#page_opprice', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('getShangou#page_opprice', awaiterr);

    return {error: awaiterr.toString()};
  }

  if (oldprice) {
    const priceret = parseMoney(oldprice);
    if (priceret.err) {
      log.error('getShangou.parseMoney.oldprice', priceret.err);

      return {error: priceret.err.toString()};
    }

    sangou.oldPrice = priceret.money;
  }

  return {ret: sangou};
}

/**
 * jdProduct - jd product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdProduct(browser, url, timeout) {
  let awaiterr = undefined;
  let banret = -1;
  const page = await browser.newPage();

  const waitAllResponse = new WaitAllResponse(page);

  checkBan(page, 'https://item.jd.com/' + url, (bantype) => {
    banret = bantype;
  });

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
    log.error('jdProduct.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page
      .goto('https://item.jd.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearCookies(page);
  if (awaiterr) {
    log.error('jdProduct.clearCookies', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearSessionStorage(page);
  if (awaiterr) {
    log.error('jdProduct.clearSessionStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearLocalStorage(page);
  if (awaiterr) {
    log.error('jdProduct.clearLocalStorage', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  awaiterr = await clearIndexedDB(page);
  if (awaiterr) {
    log.error('jdProduct.clearIndexedDB', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('jdProduct.waitDone timeout.');

    log.error('jdProduct.waitDone ', err);

    await page.close();

    return {erroor: err};
  }

  waitAllResponse.reset();

  await sleep(3 * 1000);

  const ret = {url: url};

  const breadcrumbsret = await page
      .$$eval('.crumb.fl.clearfix', (eles) => {
        if (eles.length > 0) {
          const breadcrumbsret = {
            breadCrumbs: [],
          };

          const lstitems = eles[0].getElementsByClassName('item');
          for (let i = 0; i < lstitems.length; ++i) {
            const lstbrand = lstitems[i].getElementsByClassName(
                'J-crumb-br crumb-br EDropdown'
            );
            if (lstbrand.length > 0) {
              breadcrumbsret.brand = lstitems[i].innerText;
            }

            let isvaliditem = true;
            if (lstitems[i].classList.length > 1) {
              if (lstitems[i].classList[1] == 'sep') {
                isvaliditem = false;
              }
            }

            if (isvaliditem) {
              breadcrumbsret.breadCrumbs.push(lstitems[i].innerText);
            }
          }

          return breadcrumbsret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.crumb.fl.clearfix', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (breadcrumbsret != undefined) {
    ret.breadCrumbs = breadcrumbsret.breadCrumbs;

    if (breadcrumbsret.brand) {
      const lststr = breadcrumbsret.brand.split('（');
      if (lststr.length > 1) {
        const lststr1 = lststr[1].split('）');
        ret.brandChs = lststr[0];
        ret.brandEng = lststr1[0];
      }
    }
  }

  const skunameret = await page
      .$$eval('.sku-name', (eles) => {
        if (eles.length > 0) {
          const skunameret = {name: eles[0].innerText};
          const lstimgs = eles[0].getElementsByTagName('img');
          if (lstimgs.length > 0) {
            skunameret.tag = lstimgs[0].alt;
          }

          return skunameret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.sku-name', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (skunameret != undefined) {
    ret.nameTag = skunameret.tag;
    ret.name = skunameret.name;
  }

  const info = await page
      .$$eval('.news', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.news', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.info = info;

  const bannertype = await page
      .$$eval('.activity-banner', (eles) => {
        if (eles.length > 0) {
          if (eles[0].id == 'pingou-banner') {
            return 'pingou';
          } else if (eles[0].id == 'banner-shangou') {
            return 'shangou';
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct.activity-banner', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (bannertype == 'pingou') {
    const pingouret = await getPingou(page, timeout);
    if (pingouret.error) {
      log.error('jdProduct.getPingou', pingouret.error);

      await page.close();

      return {error: pingouret.error.toString()};
    }

    ret.pingou = pingouret.ret;

    const summaryService = await page
        .$$eval('.summary-service', (eles) => {
          if (eles.length > 0) {
            const lstspan = eles[0].getElementsByTagName('span');
            if (lstspan.length > 0) {
              return lstspan[0].innerText;
            }
          }

          return '';
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct.summary-service', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.summaryService = summaryService;

    const strShipTime = await page
        .$$eval('#summary-yushou-ship', (eles) => {
          if (eles.length > 0) {
            const lstdd = eles[0].getElementsByClassName('dd');
            if (lstdd.length > 0) {
              return lstdd[0].innerText;
            }
          }

          return '';
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct#summary-yushou-ship', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.strShipTime = strShipTime;
  } else if (bannertype == 'shangou') {
    const shangouret = await getShangou(page, timeout);
    if (shangouret.error) {
      log.error('jdProduct.getShangou', shangouret.error);

      await page.close();

      return {error: shangouret.error.toString()};
    }

    ret.shangou = shangouret.ret;

    const summaryService = await page
        .$$eval('#summary-service', (eles) => {
          if (eles.length > 0) {
            const lsthl = eles[0].getElementsByClassName('hl_red');
            if (lsthl.length > 0) {
              return lsthl[0].innerText;
            }
          }

          return '';
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct#summary-service', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.summaryService = summaryService;
  } else {
    const priceret = await getNormalPrice(page, timeout);
    if (priceret.error) {
      log.error('jdProduct.getNormalPrice', priceret.error);

      await page.close();

      return {error: priceret.error.toString()};
    }

    ret.price = priceret.ret;

    const summaryService = await page
        .$$eval('#summary-service', (eles) => {
          if (eles.length > 0) {
            const lsthl = eles[0].getElementsByClassName('hl_red');
            if (lsthl.length > 0) {
              return lsthl[0].innerText;
            }
          }

          return '';
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('jdProduct#summary-service', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    ret.summaryService = summaryService;
  }

  const strWeight = await page
      .$$eval('#summary-weight', (eles) => {
        if (eles.length > 0) {
          const lstdd = eles[0].getElementsByClassName('dd');
          if (lstdd.length > 0) {
            return lstdd[0].innerText;
          }
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct#summary-weight', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.strWeight = strWeight;

  ret.SKUs = await page
      .$$eval('#choose-attrs', (eles) => {
        if (eles.length > 0) {
          const skus = [];
          const lsttype = eles[0].getElementsByClassName('li p-choose');

          for (let i = 0; i < lsttype.length; ++i) {
            let skutype = '';
            if (lsttype[0].dataset && lsttype[0].dataset.type) {
              if (lsttype[0].dataset.type == '颜色') {
                skutype = 'color';
              } else if (lsttype[0].dataset.type == '系列') {
                skutype = 'series';
              } else if (lsttype[0].dataset.type == '品种') {
                skutype = 'variety';
              } else if (lsttype[0].dataset.type == '尺寸') {
                skutype = 'size';
              } else if (lsttype[0].dataset.type == '尺码') {
                skutype = 'size';
              } else if (lsttype[0].dataset.type == '匹数') {
                skutype = 'size';
              } else if (lsttype[0].dataset.type == '规格') {
                skutype = 'size';
              } else if (lsttype[0].dataset.type == '版本') {
                skutype = 'model';
              } else if (lsttype[0].dataset.type == '购买方式') {
                skutype = 'purchase';
              } else if (lsttype[0].dataset.type == '类别') {
                skutype = 'category';
              } else if (lsttype[0].dataset.type == '产品') {
                skutype = 'productType';
              } else if (lsttype[0].dataset.type == '粘度') {
                skutype = 'productType';
              } else if (lsttype[0].dataset.type == '材质') {
                skutype = 'productType';
              } else if (lsttype[0].dataset.type == '型号') {
                skutype = 'productType';
              } else if (lsttype[0].dataset.type == '口味') {
                skutype = 'category';
              } else if (lsttype[0].dataset.type == '轮胎性能') {
                skutype = 'series';
              } else if (lsttype[0].dataset.type == '轮胎花纹') {
                skutype = 'variety';
              } else if (lsttype[0].dataset.type == '选择规格尺寸') {
                skutype = 'size';
              } else if (lsttype[0].dataset.type == '科目') {
                skutype = 'category';
              } else if (lsttype[0].dataset.type == '段位') {
                skutype = 'category';
              } else if (lsttype[0].dataset.type == '套装') {
                skutype = 'series';
              } else if (lsttype[0].dataset.type == '种类') {
                skutype = 'category';
              } else if (lsttype[0].dataset.type == '功效') {
                skutype = 'category';
              }
            }

            if (skutype == '') {
              if (lsttype.length == 1) {
                skutype = 'category';
              }
            }

            const lstitem = lsttype[i].getElementsByClassName('item');
            for (let j = 0; j < lstitem.length; ++j) {
              const sku = {type: skutype};
              if (lstitem[j].dataset && lstitem[j].dataset.sku) {
                sku.skuID = lstitem[j].dataset.sku;
              }

              if (lstitem[j].classList.length > 0) {
                for (let k = 0; k < lstitem[j].classList.length; ++k) {
                  if (lstitem[j].classList[k] == 'selected') {
                    sku.selected = true;
                  } else if (lstitem[j].classList[k] == 'disabled') {
                    sku.disabled = true;
                  }
                }
              }

              if (skutype == 'color') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.color = lstitem[j].dataset.value;
                }
              } else if (skutype == 'series') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.series = lstitem[j].dataset.value;
                }
              } else if (skutype == 'variety') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.variety = lstitem[j].dataset.value;
                }
              } else if (skutype == 'size') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.size = lstitem[j].dataset.value;
                }
              } else if (skutype == 'model') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.model = lstitem[j].dataset.value;
                }
              } else if (skutype == 'purchase') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.purchase = lstitem[j].dataset.value;
                }
              } else if (skutype == 'category') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.category = lstitem[j].dataset.value;
                }
              } else if (skutype == 'productType') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.productType = lstitem[j].dataset.value;
                }
              }

              skus.push(sku);
            }
          }

          return skus;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('jdProduct#choose-attrs', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const commentret = await getComments(page, waitAllResponse, timeout);
  if (commentret) {
    if (commentret.err) {
      log.error('jdProduct.getComments ', commentret.err);

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (commentret.ret) {
      ret.comment = commentret.ret;
    }
  }

  if (banret >= 0) {
    if (banret == 0) {
      awaiterr = new Error('noretry:ban ' + 'https://item.jd.com/' + url);
    } else if (banret == 1) {
      awaiterr = new Error('noretry:error ' + 'https://item.jd.com/' + url);
    }

    log.error('jdProduct.isban ', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.jdProduct = jdProduct;
