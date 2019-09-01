const {sleep} = require('../utils');

/**
 * getColorName - get color name
 * @param {object} page - page
 * @return {string} str - color name
 */
async function getColorName(page) {
  let awaiterr;
  const name = await page
      .$$eval('.buybox__title-color-name', (eles) => {
        if (eles.length > 0) {
          return eles[0].innerText;
        }

        return '';
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return '';
  }

  return name;
}

/**
 * getSizeList - get size list
 * @param {object} page - page
 * @return {object} ret - {size, sizeValid}
 */
async function getSizeList(page) {
  let awaiterr;
  const obj = await page
      .$$eval('.buybox__size-item', (eles) => {
        if (eles.length > 0) {
          const size = [];
          const sizeValid = [];

          for (let i = 0; i < eles.length; ++i) {
            size.push(eles[i].innerText);
            if (eles[i].children.length == 1) {
              sizeValid.push(true);
            } else {
              const arr = eles[i].getElementsByClassName('buybox__cross-line');
              if (arr.length > 0) {
                if (arr[0].style.display == 'none') {
                  sizeValid.push(true);
                } else {
                  sizeValid.push(false);
                }
              } else {
                sizeValid.push(true);
              }
            }
          }

          return {size: size, sizeValid: sizeValid};
        }

        return undefined;
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    return undefined;
  }

  return obj;
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
  // await page.setRequestInterception(true);
  // page.on('request', async (req) => {
  //   const rt = req.resourceType();
  //   if (rt == 'image' || rt == 'media' || rt == 'font') {
  //     await req.abort();

  //     return;
  //   }

  //   await req.continue();
  // });

  await page
      .goto('https://www.steepandcheap.com/' + url, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    console.log('steepandcheapProduct.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.waitForSelector('.the-wall').catch((err) => {
    awaiterr = err;
  });

  if (awaiterr) {
    console.log('steepandcheapProduct.waitForSelector .the-wall', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

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
    console.log('steepandcheapProduct.$$eval .crumb', awaiterr);

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
    console.log(
        'steepandcheapProduct.$$eval .ui-mediacarousel__list',
        awaiterr
    );

    await page.close();

    return {error: awaiterr.toString()};
  }

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
    console.log('steepandcheapProduct.$$eval .sku-id', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let lastname = '';
  const lstcolor = await page.$$('.buybox__color-item').catch((err) => {
    awaiterr = err;
  });
  if (lstcolor.length > 0) {
    ret.color = [];

    for (let i = 0; i < lstcolor.length; ++i) {
      await lstcolor[i].click();

      while (true) {
        const curname = await getColorName(page);

        if (curname != lastname) {
          lastname = curname;

          break;
        }

        await sleep(1000);
      }

      const curcolor = {
        color: lastname,
      };

      const curret = await getSizeList(page);
      if (curret) {
        curcolor.size = curret.size;
        curcolor.sizeValid = curret.sizeValid;
      }

      ret.color.push(curcolor);
    }
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
    console.log('steepandcheapProduct.$$eval .tech-specs-section', awaiterr);

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
    console.log('steepandcheapProduct.$$eval .product-information', awaiterr);

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
    console.log('steepandcheapProduct.$$eval .size-info', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  ret.lstReview = await page
      .$$eval('article.review', (eles) => {
        const lst = [];
        for (let i = 0; i < eles.length; ++i) {
          const curele = eles[i];
          const curreview = {};

          const lsttitle = curele.getElementsByClassName('user-content__title');
          if (lsttitle.length > 0) {
            curreview.title = lsttitle[0].innerText;
          }

          const lstrating = curele.getElementsByClassName(
              'user-content__rating-stars'
          );
          if (lstrating.length > 0) {
            try {
              const arr = lstrating[0].classList[0].toString().split('-', -1);
              curreview.rating = parseFloat(arr[arr.length - 1]);
            } catch (err) {
              console.log(
                  'user-content__rating-stars className error. ' +
                lstrating[0].className
              );
            }
          }

          const lstdetails = curele.getElementsByClassName(
              'product-review-details'
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
              if (lstimg.src) {
                imgs.push(lstimg.src);
              } else {
                imgs.push(lstimg.dataset.src);
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
                'user-card__photo'
            );
            if (lstphoto.length > 0) {
              if (lstphoto[0].src) {
                curreview.user.photo = lstphoto[0].src;
              } else {
                curreview.user.photo = lstphoto[0].dataset.src;
              }
            }

            const lstname = lstuser[0].getElementsByClassName('user-card__name');
            if (lstname.length > 0) {
              curreview.user.name = lstname[0].innerText;
            }

            const lstheight = lstuser[0].getElementsByClassName(
                'user-card__height-value'
            );
            if (lstheight.length > 0) {
              curreview.user.height = lstheight[0].innerText;
            }

            const lstweight = lstuser[0].getElementsByClassName(
                'user-card__weight-value'
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
    console.log('steepandcheapProduct.$$eval article.review', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  return {ret: ret};
}

exports.steepandcheapProduct = steepandcheapProduct;
