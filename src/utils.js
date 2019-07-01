const fs = require('fs');
const messages = require('../proto/result_pb');
const AdmZip = require('adm-zip');
const crypto = require('crypto');

/**
 * save protobuf message
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveMessage(filename, msg) {
  fs.writeFileSync(filename, msg.serializeBinary());
}

/**
 * save protobuf message with zip
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveZipMessage(filename, msg) {
  const zip = new AdmZip();
  zip.addFile('msg.pb', msg.serializeBinary());
  zip.writeZip(filename);
}

/**
 * hash md5
 * @param {buffer} buf - buffer
 * @return {string} md5 - md5 string
 */
function hashMD5(buf) {
  return crypto
      .createHash('md5')
      .update(buf)
      .digest('hex');
}

/**
 * set ImageInfo with img
 * @param {object} img - img object
 * @param {object} mapResponse - map response
 * @param {bool} isoutpurimages - is output images
 * @return {ImageInfo} imginfo - imginfo
 */
function setImageInfo(img, mapResponse, isoutpurimages) {
  if (mapResponse[img.url]) {
    img.data = mapResponse[img.url];

    img.hashName = hashMD5(img.data);

    if (isoutpurimages) {
      fs.writeFileSync('./output/' + img.hashName + '.jpg', img.data);
    }
  }

  return img;
}

/**
 * set ImageInfo with img
 * @param {string} url - url
 * @param {object} mapResponse - map response
 * @return {string} hashname - maybe undefined
 */
function getImageHashName(url, mapResponse) {
  if (mapResponse[url]) {
    return hashMD5(mapResponse[url]);
  }

  return undefined;
}

/**
 * new Paragraph with object
 * @param {object} obj - Paragraph object
 * @return {messages.Paragraph} paragraph - Paragraph
 */
function newParagraph(obj) {
  const result = new messages.Paragraph();

  if (obj.pt) {
    result.setPt(obj.pt);
  }

  if (obj.imgHashName) {
    result.setImghashname(obj.imgHashName);
  }

  if (obj.text) {
    result.setText(obj.text);
  }

  if (obj.imgURL) {
    result.setImgURL(obj.imgURL);
  }

  return result;
}

/**
 * new ImageInfo with object
 * @param {object} obj - ImageInfo object
 * @return {messages.ImageInfo} imginfo - ImageInfo
 */
function newImageInfo(obj) {
  const result = new messages.ImageInfo();

  if (obj.hashName) {
    result.setHashname(obj.hashName);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.width) {
    result.setWidth(obj.width);
  }

  if (obj.height) {
    result.setHeight(obj.height);
  }

  if (obj.data) {
    result.setData(obj.data);
  }

  return result;
}

/**
 * new ExportArticleResult with object
 * @param {object} obj - ExportArticleResult object
 * @return {messages.ExportArticleResult} ear - ExportArticleResult
 */
function newExportArticleResult(obj) {
  const result = new messages.ExportArticleResult();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.author) {
    result.setAuthor(obj.author);
  }

  if (obj.writeTime) {
    result.setWritetime(obj.writeTime);
  }

  if (obj.article) {
    result.setArticle(obj.article);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.imgs) {
    for (let i = 0; i < obj.imgs.length; ++i) {
      result.addImgs(newImageInfo(obj.imgs[i]), i);
    }
  }

  if (obj.titleImage) {
    result.setTitleimage(newImageInfo(obj.titleImage));
  }

  if (obj.tags) {
    for (let i = 0; i < obj.tags.length; ++i) {
      result.addTags(obj.tags[i], i);
    }
  }

  if (obj.paragraphs) {
    for (let i = 0; i < obj.paragraphs.length; ++i) {
      result.addParagraphs(newParagraph(obj.paragraphs[i]), i);
    }
  }

  if (obj.summary) {
    result.setSummary(obj.summary);
  }

  return result;
}

/**
 * new Article with object
 * @param {object} obj - Article object
 * @return {messages.Article} ear - Article
 */
function newArticle(obj) {
  const result = new messages.Article();

  if (obj.title) {
    result.setTitle(obj.title);
  }

  if (obj.author) {
    result.setAuthor(obj.author);
  }

  if (obj.writeTime) {
    result.setWritetime(obj.writeTime);
  }

  if (obj.url) {
    result.setUrl(obj.url);
  }

  if (obj.image) {
    result.setTitleimage(newImageInfo(obj.image));
  }

  if (obj.summary) {
    result.setSummary(obj.summary);
  }

  if (obj.secondTitle) {
    result.setSecondtitle(obj.secondTitle);
  }

  return result;
}

/**
 * new ArticleList with object
 * @param {object} obj - ArticleList object
 * @return {messages.ArticleList} ear - ArticleList
 */
function newArticleList(obj) {
  const result = new messages.ArticleList();

  if (Array.isArray(obj.articles)) {
    for (let i = 0; i < obj.articles.length; ++i) {
      result.addArticles(newArticle(obj.articles[i]), i);
    }
  }

  return result;
}

/**
 * attachJQuery
 * @param {object} page - page
 */
async function attachJQuery(page) {
  const jquery = await page.evaluate(() => {
    return typeof $;
  });

  if (jquery !== 'function') {
    // await page.waitForFunction(() => {
    //   document.head != null;
    // });

    // let isok = true;

    // do {
    await page
        .addScriptTag({path: './browser/jquery3.3.1.min.js'})
        .catch((err) => {
          console.log('attachJQuery:addScriptTag', err);
        // isok = false;
        });
    // } while (!isok);

    await page.waitForFunction('typeof $ === "function"').catch((err) => {
      console.log('attachJQuery:waitForFunction', err);
    });
  }
}

/**
 * attachJarvisCrawlerCore
 * @param {object} page - page
 */
async function attachJarvisCrawlerCore(page) {
  // await page.waitForFunction(() => {
  //   document.head !== null;
  // });

  await page.addScriptTag({path: './browser/utils.js'}).catch((err) => {
    console.log('attachJarvisCrawlerCore:addScriptTag', err);
    // isok = false;
  });

  await page
      .waitForFunction('typeof jarvisCrawlerCoreVer === "string"')
      .catch((err) => {
        console.log('attachJQuery:waitForFunction', err);
      });
}

/**
 * new DTBusinessGameReport with object
 * @param {object} obj - DTBusinessGameReport object
 * @return {messages.DTBusinessGameReport} result - DTBusinessGameReport
 */
function newDTBusinessGameReport(obj) {
  const result = new messages.DTBusinessGameReport();

  if (obj.businessid) {
    result.setBusinessid(obj.businessid);
  }

  if (obj.gamecode) {
    result.setGamecode(obj.gamecode);
  }

  if (obj.totalWin) {
    result.setTotalwin(obj.totalWin);
  }

  if (obj.totalBet) {
    result.setTotalbet(obj.totalBet);
  }

  if (obj.gameNums) {
    result.setGamenums(obj.gameNums);
  }

  if (obj.currency) {
    result.setCurrency(obj.currency);
  }

  return result;
}

/**
 * new DTTodayGameData with object
 * @param {object} obj - DTTodayGameData object
 * @return {messages.DTTodayGameData} result - DTTodayGameData
 */
function newDTTodayGameData(obj) {
  const result = new messages.DTTodayGameData();

  if (obj.totalWin) {
    result.setTotalwin(obj.totalWin);
  }

  if (obj.totalBet) {
    result.setTotalbet(obj.totalBet);
  }

  if (obj.gameNums) {
    result.setGamenums(obj.gameNums);
  }

  return result;
}

/**
 * new CrunchBaseOrganization with object
 * @param {object} obj - CrunchBaseOrganization object
 * @return {messages.CrunchBaseOrganization} result - CrunchBaseOrganization
 */
function newCrunchBaseOrganization(obj) {
  const result = new messages.CrunchBaseOrganization();

  if (obj.name) {
    result.setName(obj.name);
  }

  if (obj.code) {
    result.setCode(obj.code);
  }

  if (Array.isArray(obj.categories)) {
    result.setCategoriesList(obj.categories);
  }

  if (Array.isArray(obj.headquartersRegions)) {
    result.setHeadquartersregionsList(obj.headquartersRegions);
  }

  if (obj.foundeddate) {
    result.setFoundeddate(obj.foundeddate);
  }

  if (Array.isArray(obj.founders)) {
    result.setFoundersList(obj.founders);
  }

  if (obj.operatingstatus) {
    result.setOperatingstatus(obj.operatingstatus);
  }

  if (obj.fundingstatus) {
    result.setFundingstatus(obj.fundingstatus);
  }

  if (obj.lastfundingtype) {
    result.setLastfundingtype(obj.lastfundingtype);
  }

  if (obj.legalname) {
    result.setLegalname(obj.legalname);
  }

  if (obj.stocksymbol) {
    result.setStocksymbol(obj.stocksymbol);
  }

  if (obj.valuationipo) {
    result.setValuationipo(obj.valuationipo);
  }

  if (obj.priceipo) {
    result.setPriceipo(obj.priceipo);
  }

  if (obj.dateipo) {
    result.setDateipo(obj.dateipo);
  }

  if (obj.moneyraisedipo) {
    result.setMoneyraisedipo(obj.moneyraisedipo);
  }

  if (Array.isArray(obj.fundingrounds)) {
    for (let i = 0; i < obj.fundingrounds.length; ++i) {
      result.addFundingrounds(
          newCrunchBaseFundingRound(obj.fundingrounds[i]),
          i
      );
    }
    // result.setFoundersList(obj.fundingrounds);
  }

  return result;
}

/**
 * new CrunchBaseFundingRound with object
 * @param {object} obj - CrunchBaseFundingRound object
 * @return {messages.CrunchBaseFundingRound} result - CrunchBaseFundingRound
 */
function newCrunchBaseFundingRound(obj) {
  const result = new messages.CrunchBaseFundingRound();

  if (obj.announceddate) {
    result.setAnnounceddate(obj.announceddate);
  }

  if (obj.transactionname) {
    result.setTransactionname(obj.transactionname);
  }

  if (obj.moneyraised) {
    result.setMoneyraised(obj.moneyraised);
  }

  if (Array.isArray(obj.investors)) {
    for (let i = 0; i < obj.investors.length; ++i) {
      result.addInvestors(newCrunchBaseInvestor(obj.investors[i]), i);
    }
  }

  return result;
}

/**
 * new CrunchBaseInvestor with object
 * @param {object} obj - CrunchBaseInvestor object
 * @return {messages.CrunchBaseInvestor} result - CrunchBaseInvestor
 */
function newCrunchBaseInvestor(obj) {
  const result = new messages.CrunchBaseInvestor();

  if (obj.investorname) {
    result.setInvestorname(obj.investorname);
  }

  if (obj.leadinvestor) {
    result.setLeadinvestor(obj.leadinvestor);
  }

  if (Array.isArray(obj.partners)) {
    result.setPartnersList(obj.partners);
  }

  return result;
}

/**
 * sleep
 * @param {number} ms - ms
 * @return {Promise} result -
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * mouseMove
 * @param {object} page - page
 * @param {number} x - screen x
 * @param {number} y - screen y
 * @param {number} cx - client x
 * @param {number} cy - client y
 */
async function mouseMove(page, x, y, cx, cy) {
  await page
      .evaluate(
          (param) => {
            console.log(param);

            const e = new MouseEvent('mousemove', {
              screenX: param.x,
              screenY: param.y,
              clientX: param.cx,
              clientY: param.cy,
            });
            document.body.dispatchEvent(e);
          },
          {x: x, y: y, cx: cx, cy: cy}
      )
      .catch((err) => {
        console.log('mouseMove ' + err);
      });
}

/**
 * mouseMoveToEle
 * @param {object} page - page
 * @param {string} selector - selector
 */
async function mouseMoveToEle(page, selector) {
  const ele = await page.$(selector).catch((err) => {
    console.log('mouseMoveToEle ' + err);
  });

  if (ele) {
    const bbox = await ele.boundingBox();
    console.log(bbox);
    await page.mouse.move(
        Math.floor(bbox.x + bbox.width / 2),
        Math.floor(bbox.y + bbox.height / 2)
    );
  }
}

/**
 * mouseMoveToEleEx
 * @param {object} page - page
 * @param {string} selector - selector
 * @param {function} isThis - async function (ElementHandle) bool
 */
async function mouseMoveToEleEx(page, selector, isThis) {
  const eles = await page.$$(selector).catch((err) => {
    console.log('mouseMoveToEleEx ' + err);
  });

  for (let i = 0; i < eles.length; ++i) {
    if (await isThis(eles[i])) {
      const bbox = await eles[i].boundingBox();
      console.log(bbox);
      await page.mouse.move(
          Math.floor(bbox.x + bbox.width / 2),
          Math.floor(bbox.y + bbox.height / 2)
      );

      return;
    }
  }
}

/**
 * mouseMoveToFrameEleEx
 * @param {object} page - page
 * @param {string} selector - selector
 * @param {function} isFrame - async function (Frame) bool
 * @param {function} isThis - async function (ElementHandle) bool
 */
async function mouseMoveToFrameEleEx(page, selector, isFrame, isThis) {
  const lstFrames = await page.frames();

  for (let i = 0; i < lstFrames.length; ++i) {
    const frame = lstFrames[i];
    if (isFrame(frame)) {
      const eles = await frame.$$(selector).catch((err) => {
        console.log('mouseMoveToFrameEleEx:$$(' + selector + ') ' + err);
      });

      for (let j = 0; j < eles.length; ++j) {
        if (await isThis(eles[j])) {
          const bbox = await eles[j].boundingBox();
          console.log(bbox);
          await page.mouse.move(
              Math.floor(bbox.x + bbox.width / 2),
              Math.floor(bbox.y + bbox.height / 2)
          );

          return;
        }
      }
    }
  }
}

/**
 * mouseClickEle
 * @param {object} page - page
 * @param {string} selector - selector
 */
async function mouseClickEle(page, selector) {
  const ele = await page.$(selector).catch((err) => {
    console.log('mouseClickEle ' + err);
  });

  if (ele) {
    const bbox = await ele.boundingBox();
    console.log(bbox);
    await page.mouse.move(
        Math.floor(bbox.x + bbox.width / 2),
        Math.floor(bbox.y + bbox.height / 2)
    );
    await page.mouse.down();
    await page.mouse.up();
  }
}

/**
 * mouseClickFrameEleEx
 * @param {object} page - page
 * @param {string} selector - selector
 * @param {function} isFrame - async function (Frame) bool
 * @param {function} isThis - async function (ElementHandle) bool
 */
async function mouseClickFrameEleEx(page, selector, isFrame, isThis) {
  const lstFrames = await page.frames();

  for (let i = 0; i < lstFrames.length; ++i) {
    const frame = lstFrames[i];
    if (isFrame(frame)) {
      const eles = await frame.$$(selector).catch((err) => {
        console.log('mouseClickFrameEleEx:$$(' + selector + ') ' + err);
      });

      for (let j = 0; j < eles.length; ++j) {
        if (await isThis(eles[j])) {
          const bbox = await eles[j].boundingBox();
          console.log(bbox);
          await page.mouse.move(
              Math.floor(bbox.x + bbox.width / 2),
              Math.floor(bbox.y + bbox.height / 2)
          );
          await page.mouse.down();
          await page.mouse.up();

          return;
        }
      }
    }
  }
}

/**
 * mouseHoldFrameEleEx
 * @param {object} page - page
 * @param {string} selector - selector
 * @param {function} isFrame - async function (Frame) bool
 * @param {function} isThis - async function (ElementHandle) bool
 * @param {number} timeHold - time to hold
 */
async function mouseHoldFrameEleEx(page, selector, isFrame, isThis, timeHold) {
  const lstFrames = await page.frames();

  for (let i = 0; i < lstFrames.length; ++i) {
    const frame = lstFrames[i];
    if (isFrame(frame)) {
      const eles = await frame.$$(selector).catch((err) => {
        console.log('mouseHoldFrameEleEx:$$(' + selector + ') ' + err);
      });

      for (let j = 0; j < eles.length; ++j) {
        if (await isThis(eles[j])) {
          const bbox = await eles[j].boundingBox();
          console.log(bbox);
          await page.mouse.move(
              Math.floor(bbox.x + bbox.width / 2),
              Math.floor(bbox.y + bbox.height / 2)
          );
          await page.mouse.down();
          await sleep(timeHold);
          await page.mouse.up();

          return;
        }
      }
    }
  }
}

exports.saveMessage = saveMessage;
exports.saveZipMessage = saveZipMessage;
exports.hashMD5 = hashMD5;
exports.setImageInfo = setImageInfo;
exports.getImageHashName = getImageHashName;
exports.newParagraph = newParagraph;
exports.newImageInfo = newImageInfo;
exports.newExportArticleResult = newExportArticleResult;
exports.newArticle = newArticle;
exports.newArticleList = newArticleList;
exports.attachJQuery = attachJQuery;
exports.attachJarvisCrawlerCore = attachJarvisCrawlerCore;
exports.newDTBusinessGameReport = newDTBusinessGameReport;
exports.newDTTodayGameData = newDTTodayGameData;
exports.newCrunchBaseOrganization = newCrunchBaseOrganization;
exports.newCrunchBaseFundingRound = newCrunchBaseFundingRound;
exports.newCrunchBaseInvestor = newCrunchBaseInvestor;
exports.mouseMove = mouseMove;
exports.mouseMoveToEle = mouseMoveToEle;
exports.mouseMoveToEleEx = mouseMoveToEleEx;
exports.mouseMoveToFrameEleEx = mouseMoveToFrameEleEx;
exports.mouseClickEle = mouseClickEle;
exports.mouseClickFrameEleEx = mouseClickFrameEleEx;
exports.mouseHoldFrameEleEx = mouseHoldFrameEleEx;
exports.sleep = sleep;
