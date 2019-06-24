
const fs = require('fs');
const jarviscrawlercore = require('../proto/result_pb.js');
const AdmZip = require('adm-zip');
const crypto = require('crypto');

/**
 * save protobuf message
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveMessage(filename, msg) {
  fs.writeFileSync(filename,
      msg.serializeBinary());
}


/**
 * save protobuf message with zip
 * @param {string} filename - output file
 * @param {string} msg - message
 */
function saveZipMessage(filename, msg) {
  const zip = new AdmZip();
  zip.addFile('msg.pb',
      msg.serializeBinary());
  zip.writeZip(filename);
}

/**
 * hash md5
 * @param {buffer} buf - buffer
 * @return {string} md5 - md5 string
 */
function hashMD5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
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
 * @return {jarviscrawlercore.Paragraph} paragraph - Paragraph
 */
function newParagraph(obj) {
  const result = new jarviscrawlercore.Paragraph();

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
 * @return {jarviscrawlercore.ImageInfo} imginfo - ImageInfo
 */
function newImageInfo(obj) {
  const result = new jarviscrawlercore.ImageInfo();

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
 * @return {jarviscrawlercore.ExportArticleResult} ear - ExportArticleResult
 */
function newExportArticleResult(obj) {
  const result = new jarviscrawlercore.ExportArticleResult();

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
 * @return {jarviscrawlercore.Article} ear - Article
 */
function newArticle(obj) {
  const result = new jarviscrawlercore.Article();

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
 * @return {jarviscrawlercore.ArticleList} ear - ArticleList
 */
function newArticleList(obj) {
  const result = new jarviscrawlercore.ArticleList();

  if (obj.articles) {
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
  const jquery = await page.evaluate(()=>{
    return typeof $;
  });

  if (jquery !== 'function') {
    // await page.waitForFunction(() => {
    //   document.head != null;
    // });

    // let isok = true;

    // do {
    await page.addScriptTag({path: './browser/jquery3.3.1.min.js'}).catch((err) => {
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

  await page.waitForFunction('typeof jarvisCrawlerCoreVer === "string"').catch((err) => {
    console.log('attachJQuery:waitForFunction', err);
  });
}

/**
 * new DTBusinessGameReport with object
 * @param {object} obj - DTBusinessGameReport object
 * @return {jarviscrawlercore.DTBusinessGameReport} result - DTBusinessGameReport
 */
function newDTBusinessGameReport(obj) {
  const result = new jarviscrawlercore.DTBusinessGameReport();

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
 * @return {jarviscrawlercore.DTTodayGameData} result - DTTodayGameData
 */
function newDTTodayGameData(obj) {
  const result = new jarviscrawlercore.DTTodayGameData();

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
 * sleep
 * @param {number} ms - ms
 * @return {Promise} result -
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
exports.sleep = sleep;
