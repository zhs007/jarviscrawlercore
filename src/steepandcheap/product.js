const {sleep} = require('../utils');
const {isValidProductURL, closeDialog} = require('./utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {DEFAULT_REVIEWS_NUMS} = require('./basedef');

/**
 * validImageSrc - //a.b.c/d.jpg => https://a.b.c/d.jpg
 * @param {string} src - src
 * @return {string} str - valid source
 */
function validImageSrc(src) {
  if (src.indexOf('//') == 0) {
    return 'https:' + src;
  }

  return src;
}

// /**
//  * getColorName - get color name
//  * @param {object} page - page
//  * @return {string} str - color name
//  */
// async function getColorName(page) {
//   let awaiterr;
//   const name = await page
//       .$$eval('.buybox__title-color-name', (eles) => {
//         if (eles.length > 0) {
//           return eles[0].innerText;
//         }

//         return '';
//       })
//       .catch((err) => {
//         awaiterr = err;
//       });

//   if (awaiterr) {
//     return '';
//   }

//   return name;
// }

/**
 * isPageExpired - is page expired
 * @param {object} page - page
 * @return {bool} isexpired - is expired
 */
async function isPageExpired(page) {
  let awaiterr;
  const isexpired = await page
      .$$eval('h1', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText == 'Sorry, the page may have expired.';
        }

        return false;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return false;
  }

  return isexpired;
}

// /**
//  * getSizeList - get size list
//  * @param {object} page - page
//  * @return {object} ret - {size, sizeValid}
//  */
// async function getSizeList(page) {
//   let awaiterr;
//   const obj = await page
//       .$$eval('.buybox__size-item', (eles) => {
//         if (eles.length > 0) {
//           const size = [];
//           const sizeValid = [];

//           for (let i = 0; i < eles.length; ++i) {
//             size.push(eles[i].innerText);
//             if (eles[i].children.length == 1) {
//               sizeValid.push(true);
//             } else {
//               const arr = eles[i].getElementsByClassName('buybox__cross-line');
//               if (arr.length > 0) {
//                 if (arr[0].style.display == 'none') {
//                   sizeValid.push(true);
//                 } else {
//                   sizeValid.push(false);
//                 }
//               } else {
//                 sizeValid.push(true);
//               }
//             }
//           }

//           return {size: size, sizeValid: sizeValid};
//         }

//         return undefined;
//       })
//       .catch((err) => {
//         awaiterr = err;
//       });

//   if (awaiterr) {
//     return undefined;
//   }

//   return obj;
// }

/**
 * loadMoreReviews - load more reviews
 * @param {object} page - page
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} reviewCount - review nums
 * @param {number} timeout - timeout in microseconds
 * @return {error} err - error
 */
async function loadMoreReviews(page, waitAllResponse, reviewCount, timeout) {
  let awaiterr;
  const lstreviews = await page.$$('article.review').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    return awaiterr;
  }

  if (lstreviews.length >= reviewCount) {
    return undefined;
  }

  while (true) {
    await sleep(3 * 1000);

    const lstloadmores = await page.$$('.btn.js-load-more-btn').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    if (lstloadmores.length > 0) {
      const canclick = await page
          .$$eval('.btn.js-load-more-btn', (eles) => {
            if (eles.length > 0) {
              if (eles[0].style.display != 'none') {
                return true;
              }
            }

            return false;
          })
          .catch((err) => {
            awaiterr = err;
          });
      if (awaiterr) {
        return awaiterr;
      }

      if (canclick) {
        await lstloadmores[0].hover().catch((err) => {
          awaiterr = err;
        });
        if (awaiterr) {
          return awaiterr;
        }

        await sleep(3 * 1000);

        await lstloadmores[0].click().catch((err) => {
          awaiterr = err;
        });
        if (awaiterr) {
          return awaiterr;
        }
      } else {
        break;
      }

      const isok = await waitAllResponse.waitDone(timeout);
      if (!isok) {
        return new Error('loadMoreReviews.waitDone timeout.');
      }

      waitAllResponse.reset();

      const reviewnums = await page.$$eval('article.review', (eles) => {
        return eles.length;
      });

      if (reviewnums >= reviewCount) {
        return undefined;
      }
    } else {
      break;
    }
  }

  return undefined;
}

/**
 * getAllReviews - get all reviews
 * @param {object} page - page
 * @param {object} waitAllResponse - WaitAllResponse
 * @param {number} reviewCount - review nums
 * @param {number} timeout - timeout in microseconds
 * @return {error} err - error
 */
async function getAllReviews(page, waitAllResponse, reviewCount, timeout) {
  let awaiterr;
  await page
      .waitForSelector('a.pdp__tab-item.js-tabnavigation-tab', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return awaiterr;
  }

  const lsttabs = await page
      .$$('a.pdp__tab-item.js-tabnavigation-tab')
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    return awaiterr;
  }

  for (let i = 0; i < lsttabs.length; ++i) {
    let innerText = await lsttabs[i].getProperty('innerText').catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }

    innerText = await innerText.jsonValue().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      return awaiterr;
    }
    innerText = innerText.toString();

    if (innerText.trim().toLowerCase() == 'reviews') {
      await lsttabs[i].hover().catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return awaiterr;
      }

      await lsttabs[i].click().catch((err) => {
        awaiterr = err;
      });
      if (awaiterr) {
        return awaiterr;
      }

      if (reviewCount > DEFAULT_REVIEWS_NUMS) {
        reviewCount = DEFAULT_REVIEWS_NUMS;
      }

      // no need to get all the reviews
      // 不需要获取全部的reviews
      return undefined;

      awaiterr = await loadMoreReviews(
          page,
          waitAllResponse,
          reviewCount,
          timeout,
      );
      if (awaiterr) {
        return awaiterr;
      }

      return undefined;
    }
  }

  return undefined;
}

/**
 * getColorList2 - get color list v2
 * @param {object} page - page
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function getColorList2(page, timeout) {
  let awaiterr = undefined;
  const lst = await page
      .$$eval('div[itemprop="offers"]', (eles) => {
        const lst = [];

        for (let i = 0; i < eles.length; ++i) {
          const cd = {};
          const ele = eles[i];
          for (let j = 0; j < ele.children.length; ++j) {
            if (
              ele.children[j].tagName == 'META' &&
            ele.children[j].getAttribute('itemprop') == 'price'
            ) {
              cd.price = ele.children[j]
                  .getAttribute('content')
                  .split(',')
                  .join('');
            } else if (ele.children[j].tagName == 'DIV') {
              const elechild = ele.children[j];

              for (let k = 0; k < elechild.children.length; ++k) {
                if (
                  elechild.children[k].tagName == 'META' &&
                elechild.children[k].getAttribute('itemprop') == 'color'
                ) {
                  const str = elechild.children[k].getAttribute('content');
                  const arr = str.split(',');
                  if (arr.length == 2) {
                    cd.color = arr[0].trim();
                    cd.size = arr[1].trim();
                  }
                }
              }
            }
          }

          lst.push(cd);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return {error: err};
  }

  return {ret: lst};
}

/**
 * steepandcheapProduct - steepandcheap product
 * @param {object} browser - browser
 * @param {string} url - url
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function steepandcheapProduct(browser, url, timeout) {
  let awaiterr = undefined;
  const page = await browser.newPage();
  const baseurl = 'https://www.steepandcheap.com/' + url;

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
    log.error('steepandcheapProduct.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let noretry = false;
  page.on('framenavigated', (f) => {
    if (f == page.mainFrame()) {
      if (f.url().indexOf(baseurl) == 0) {
        return;
      } else {
        noretry = true;
      }
    }
  });

  if (!isValidProductURL(baseurl)) {
    noretry = true;
  }

  // await page.setRequestInterception(true);
  // page.on('request', async (req) => {
  //   const rt = req.resourceType();
  //   if (rt == 'image' || rt == 'media' || rt == 'font') {
  //     await req.abort();

  //     return;
  //   }

  //   await req.continue();
  // });

  const waitAllResponse = new WaitAllResponse(page);
  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.the-wall').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    if (noretry) {
      awaiterr = new Error('noretry:pagechange ' + baseurl);

      log.error('steepandcheapProduct.waitForSelector .the-wall', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    const isexpired = await isPageExpired(page);
    if (isexpired) {
      awaiterr = new Error('noretry:pageexpired ' + baseurl);
    }

    log.error('steepandcheapProduct.waitForSelector .the-wall', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await closeDialog(page);

  const ret = {};

  ret.category = await page
      .$$eval('.crumb', (eles) => {
        const lst = [];

        for (let i = 0; i < eles.length; ++i) {
          lst.push(eles[i].innerText);
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .crumb', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.imgs = await page
      .$$eval('.ui-mediacarousel__list', (eles) => {
        const lst = [];

        if (eles.length > 0) {
          const imgs = eles[0].getElementsByTagName('img');
          for (let i = 0; i < imgs.length; ++i) {
            if (imgs[i].src) {
              lst.push(imgs[i].src);
            } else {
              lst.push(imgs[i].dataset.src);
            }
          }
        }

        return lst;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .ui-mediacarousel__list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (ret.imgs) {
    for (let i = 0; i < ret.imgs.length; ++i) {
      ret.imgs[i] = validImageSrc(ret.imgs[i]);
    }
  }

  ret.price = await page
      .$$eval(
          '.product-pricing__inactive.js-product-pricing__inactive',
          (eles) => {
            if (eles.length > 0) {
              const pricearr = eles[0].innerText.split('$', -1);
              if (pricearr.length != 2) {
                console.log('invalid price ' + eles[0].innerText);
              } else {
                try {
                  return parseFloat(pricearr[1].split(',').join(''));
                } catch (err) {
                  console.log('invalid price ' + eles[0].innerText);
                }
              }
            }

            return undefined;
          },
      )
      .catch((err) => {
        awaiterr = err;
      });

  ret.skuid = await page
      .$$eval('.sku-id', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .sku-id', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  // let lastname = '';
  // const lstcolor = await page.$$('.buybox__color-item').catch((err) => {
  //   awaiterr = err;
  // });
  // if (lstcolor.length > 0) {
  //   ret.color = [];

  //   for (let i = 0; i < lstcolor.length; ++i) {
  //     await closeDialog(page);

  //     await lstcolor[i].click();

  //     const starttime = Date.now();
  //     while (true) {
  //       await sleep(1000);

  //       const curname = await getColorName(page);

  //       if (curname != lastname) {
  //         lastname = curname;

  //         break;
  //       }

  //       const curt = Date.now();
  //       if (curt > starttime + timeout) {
  //         await page.close();

  //         return {error: 'steepandcheapProduct.getColor timeout'};
  //       }
  //     }

  //     const curcolor = {
  //       color: lastname,
  //     };

  //     const curret = await getSizeList(page);
  //     if (curret) {
  //       curcolor.size = curret.size;
  //       curcolor.sizeValid = curret.sizeValid;
  //     }

  //     ret.color.push(curcolor);
  //   }
  // }

  const offersret = await getColorList2(page, timeout);
  if (offersret.error) {
    log.error('steepandcheapProduct.getColorList2', offersret.error);

    await page.close();

    return {error: offersret.error.toString()};
  }

  ret.offers = offersret.ret;

  const lsttabs = await page.$$('.pdp__recommendations').catch((err) => {
    awaiterr = err;
  });
  if (awaiterr) {
    log.error('steepandcheapProduct.pdp__recommendations', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (lsttabs.length > 0) {
    await lsttabs[0].hover().catch((err) => {
      awaiterr = err;
    });
    if (awaiterr) {
      log.error('steepandcheapProduct.pdp__recommendations.hover', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }

    await sleep(1000);
  }

  const techret = await page
      .$$eval('.tech-specs-section', (eles) => {
        if (eles.length > 0) {
          const lsttd = eles[0].getElementsByClassName('td');
          const techret = {};

          for (let i = 0; i < lsttd.length / 2; ++i) {
            if (lsttd[i * 2].innerText == 'Material:') {
              techret.material = lsttd[i * 2 + 1].innerText;
            } else if (lsttd[i * 2].innerText == 'Fit:') {
              techret.fit = lsttd[i * 2 + 1].innerText;
            } else if (lsttd[i * 2].innerText == 'Style:') {
              techret.style = lsttd[i * 2 + 1].innerText;
            } else if (lsttd[i * 2].innerText == 'UPF Rating:') {
              techret.ratingUPF = lsttd[i * 2 + 1].innerText;
            } else if (lsttd[i * 2].innerText == 'Claimed Weight:') {
              techret.strWeight = lsttd[i * 2 + 1].innerText;
            } else if (lsttd[i * 2].innerText == 'Recommended Use:') {
              techret.recommendedUse = lsttd[i * 2 + 1].innerText.split(',', -1);
            } else if (lsttd[i * 2].innerText == 'Manufacturer Warranty:') {
              techret.manufacturerWarranty = lsttd[i * 2 + 1].innerText;
            }
          }

          return techret;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .tech-specs-section', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  if (techret) {
    for (const k in techret) {
      if (Object.prototype.hasOwnProperty.call(techret, k)) {
        ret[k] = techret[k];
      }
    }
  }

  ret.information = await page
      .$$eval('.product-information', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerHTML;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .product-information', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.sizeChart = await page
      .$$eval('.size-info', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerHTML;
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .size-info', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let reviewCount = await page
      .$$eval('.review-count', (eles) => {
        if (eles.length > 0) {
          try {
            return parseInt(eles[0].innerText);
          } catch (err) {
            return 0;
          }
        }

        return 0;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('steepandcheapProduct.$$eval .review-count', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.reviews = reviewCount;
  reviewCount = 0;
  if (reviewCount > 0) {
    awaiterr = await getAllReviews(page, waitAllResponse, reviewCount, timeout);
    if (awaiterr) {
      log.error('steepandcheapProduct.getAllReviews ', awaiterr);

      // await page.close();

      // return {error: awaiterr.toString()};
    }

    await page
        .waitForSelector('article.review', {
          timeout: timeout,
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error(
          'steepandcheapProduct.waitForSelector article.review',
          awaiterr,
      );

      // await page.close();

      // return {error: awaiterr.toString()};
    } else {
      ret.lstReview = await page
          .$$eval('article.review', (eles) => {
            const lst = [];
            for (let i = 0; i < eles.length; ++i) {
              const curele = eles[i];
              const curreview = {};

              const lsttitle = curele.getElementsByClassName(
                  'user-content__title',
              );
              if (lsttitle.length > 0) {
                curreview.title = lsttitle[0].innerText;
              }

              const lstrating = curele.getElementsByClassName(
                  'user-content__rating-stars',
              );
              if (lstrating.length > 0) {
                try {
                  const arr = lstrating[0].classList[0].toString().split('-', -1);
                  curreview.rating = parseFloat(arr[arr.length - 1]);
                } catch (err) {
                  console.log(
                      'user-content__rating-stars className error. ' +
                    lstrating[0].className,
                  );
                }
              }

              const lstdetails = curele.getElementsByClassName(
                  'product-review-details',
              );
              if (lstdetails.length > 0) {
                const lstspan = lstdetails[0].getElementsByTagName('span');
                for (let j = 0; j < lstspan.length / 2; ++j) {
                  if (lstspan[j * 2].innerText.trim() == 'Familiarity:') {
                    curreview.familiarity = lstspan[j * 2 + 1].innerText.trim();
                  } else if (lstspan[j * 2].innerText.trim() == 'Fit:') {
                    curreview.fit = lstspan[j * 2 + 1].innerText.trim();
                  } else if (lstspan[j * 2].innerText.trim() == 'Size Bought:') {
                    curreview.sizeBought = lstspan[j * 2 + 1].innerText.trim();
                  }
                }
              }

              const lstimg = curele.getElementsByClassName('user-content__image');
              if (lstimg.length > 0) {
                const imgs = [];
                for (let j = 0; j < lstimg.length; ++j) {
                  if (lstimg[j].src) {
                    imgs.push(lstimg[j].src);
                  } else {
                    imgs.push(lstimg[j].dataset.src);
                  }
                }

                curreview.imgs = imgs;
              }

              const lstdesc = curele.getElementsByClassName('description');
              if (lstdesc.length > 0) {
                curreview.description = lstdesc[0].innerText;
              }

              const lstuser = curele.getElementsByClassName('user-card');
              if (lstuser.length > 0) {
                curreview.user = {};

                const lstphoto = lstuser[0].getElementsByClassName(
                    'user-card__photo',
                );
                if (lstphoto.length > 0) {
                  if (lstphoto[0].src) {
                    curreview.user.photo = lstphoto[0].src;
                  } else {
                    curreview.user.photo = lstphoto[0].dataset.src;
                  }
                }

                const lstname = lstuser[0].getElementsByClassName(
                    'user-card__name',
                );
                if (lstname.length > 0) {
                  curreview.user.name = lstname[0].innerText;
                }

                const lstheight = lstuser[0].getElementsByClassName(
                    'user-card__height-value',
                );
                if (lstheight.length > 0) {
                  curreview.user.height = lstheight[0].innerText;
                }

                const lstweight = lstuser[0].getElementsByClassName(
                    'user-card__weight-value',
                );
                if (lstweight.length > 0) {
                  curreview.user.weight = lstweight[0].innerText;
                }
              }

              lst.push(curreview);
            }

            return lst;
          })
          .catch((err) => {
            awaiterr = err;
          });

      if (awaiterr) {
        log.error('steepandcheapProduct.$$eval article.review', awaiterr);

        await page.close();

        return {error: awaiterr.toString()};
      }
    }

    if (ret.lstReview) {
      for (let i = 0; i < ret.lstReview.length; ++i) {
        const curreview = ret.lstReview[i];
        if (Array.isArray(curreview.imgs)) {
          for (let j = 0; j < curreview.imgs.length; ++j) {
            curreview.imgs[j] = validImageSrc(curreview.imgs[j]);
          }
        }

        if (curreview.user && curreview.user.photo) {
          curreview.user.photo = validImageSrc(curreview.user.photo);
        }
      }
    }
  }

  await page
      .waitForSelector('.product', {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error(
        'steepandcheapProduct.waitForSelector .product ' + url + ' error ',
        awaiterr,
    );

    // await page.close();

    // return {error: awaiterr.toString()};
  } else {
    ret.linkProducts = await page
        .$$eval('.product', (eles) => {
          if (eles.length > 0) {
            const lst = [];

            for (let i = 0; i < eles.length; ++i) {
              const lsta = eles[i].getElementsByTagName('a');
              if (lsta.length > 0) {
                lst.push(lsta[0].href);
              }
            }

            return lst;
          }
        })
        .catch((err) => {
          awaiterr = err;
        });

    if (awaiterr) {
      log.error('steepandcheapProduct.$$eval .product', awaiterr);

      await page.close();

      return {error: awaiterr.toString()};
    }
  }

  await page.close();

  return {ret: ret};
}

exports.steepandcheapProduct = steepandcheapProduct;
