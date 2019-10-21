const {sleep} = require('../utils');
const log = require('../log');
const {WaitAllResponse} = require('../waitallresponse');
const {parsePercent} = require('./utils');

/**
 * getComments - get comments
 * @param {object} page - page
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {err, ret}
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

    return {err: err};
  }

  const licomment = await page.$('.jcjdcomments');
  if (licomment != undefined) {
    await licomment.hover().catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('getComments.hover ' + awaiterr);

      return {err: err};
    }

    await sleep(3 * 1000);

    await licomment.click().catch((err) => {
      awaiterr = err;
    });

    if (awaiterr) {
      log.error('getComments.click ' + awaiterr);

      return {err: err};
    }

    const isok = await waitAllResponse.waitDone(timeout);
    if (!isok) {
      return {err: new Error('getComments.waitDone timeout.')};
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
 * jdProduct - jd product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function jdProduct(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();

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

  const isok = await waitAllResponse.waitDone(timeout);
  if (!isok) {
    const err = new Error('jdProduct.waitDone timeout.');

    log.error('jdProduct.waitDone ', err);

    await page.close();

    return {err: err};
  }

  waitAllResponse.reset();

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

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (pingouret != undefined) {
      try {
        pingouret.preOrders = parseInt(pingouret.preOrders);
      } catch (err) {
        log.error('jdProduct.pingouret.parseInt', err);

        await page.close();

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
            if (lst.length == 2) {
              const jp = lst[0].getElementsByClassName('price J-earnest');
              if (jp.length > 0) {
                pingouprice.scheduledPrice = jp[0].innerText;
              }

              const p = lst[1].getElementsByClassName('price J-presale-price');
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

      await page.close();

      return {error: awaiterr.toString()};
    }

    if (pingouprice != undefined) {
      if (ret.pingou == undefined) {
        ret.pingou = {};
      }

      try {
        pingouprice.scheduledPrice = parseFloat(pingouprice.scheduledPrice);
        pingouprice.price = parseFloat(pingouprice.price);
      } catch (err) {
        log.error('jdProduct.pingouprice.parseFloat', err);

        await page.close();

        return {error: err.toString()};
      }

      ret.pingou.scheduledPrice = pingouprice.scheduledPrice;
      ret.pingou.price = pingouprice.price;
    }
  }

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
              }
            }

            const lstitem = lsttype[i].getElementsByClassName('item');
            for (let j = 0; j < lstitem.length; ++j) {
              const sku = {type: skutype};
              if (lstitem[j].dataset && lstitem[j].dataset.sku) {
                sku.skuID = lstitem[j].dataset.sku;
              }

              if (skutype == 'color') {
                if (lstitem[j].dataset && lstitem[j].dataset.value) {
                  sku.color = lstitem[j].dataset.value;
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
  if (commentret == undefined) {
    log.error('jdProduct.getComments undefined');

    await page.close();

    return {error: 'jdProduct.getComments undefined'};
  }

  if (commentret && commentret.err) {
    log.error('jdProduct.getComments ', commentret.err);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (commentret.ret) {
    ret.comment = commentret.ret;
  }

  await page.close();

  return {ret: ret};
}

exports.jdProduct = jdProduct;
