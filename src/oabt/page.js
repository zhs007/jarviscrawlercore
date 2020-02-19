// const {sleep} = require('../utils');
const {WaitAllResponse} = require('../waitallresponse');
const log = require('../log');
const {disableDownloadOthers} = require('../page.utils');
// const {DownloadList} = require('../request');
// const path = require('path');
// const fs = require('fs');

const oabturl = 'http://oabt008.com/';

/**
 * oabtPage - oabt page
 * @param {object} browser - browser
 * @param {string} pageindex - pageindex
 * @param {number} timeout - timeout in microseconds
 * @return {object} ret - {error, ret}
 */
async function oabtPage(browser, pageindex, timeout) {
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
    log.error('oabtPage.setViewport', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  let baseurl = oabturl + 'index/index';
  if (pageindex > 1) {
    baseurl = oabturl + 'index/index/p/' + pageindex;
  }

  await page
      .goto(baseurl, {
        timeout: timeout,
      })
      .catch((err) => {
        awaiterr = err;
      });

  if (awaiterr) {
    log.error('oabtPage.goto', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  const isdone = await waitAllResponse.waitDone(timeout);
  if (!isdone) {
    const err = new Error('oabtPage.waitDone timeout');

    log.error('oabtPage.waitDone', err);

    await page.close();

    return {error: err.toString()};
  }

  const lst = await page
      .$$eval('.link-list', (eles) => {
        if (eles.length > 0) {
          const lst = [];
          for (let i = 0; i < eles.length; ++i) {
            for (let j = 0; j < eles[i].children.length; ++j) {
              const cn = {};

              const lstname = eles[i].children[j].getElementsByClassName('name');
              if (lstname.length > 0) {
                cn.name = lstname[0].innerText;
              }

              const ds = eles[i].children[j].dataset;
              if (ds) {
                cn.id = ds.id;
                cn.magnet = ds.magnet;
                cn.ed2k = ds.ed2k;
                cn.cat = ds.cat;
              }

              lst.push(cn);
            }
          }
          return lst;
        }

        return [];
      })
      .catch((err) => {
        awaiterr = err;
      });
  if (awaiterr) {
    log.error('oabtPage.$$eval .link-list', awaiterr);

    await page.close();

    return {error: awaiterr.toString()};
  }

  await page.close();

  const ret = {lst: []};

  for (let i = 0; i < lst.length; ++i) {
    const ci = {
      fullname: lst[i].name,
      resid: lst[i].id,
      cat: lst[i].cat,
      lst: [],
    };

    if (lst[i].ed2k) {
      ci.lst.push({
        type: 0,
        url: lst[i].ed2k,
      });
    }

    if (lst[i].magnet) {
      ci.lst.push({
        type: 1,
        url: lst[i].magnet,
      });
    }

    ret.lst.push(ci);
  }

  return {ret: ret};
}

exports.oabtPage = oabtPage;
