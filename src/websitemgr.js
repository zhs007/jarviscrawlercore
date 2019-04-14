const yaml = require('yaml-js');
const fs = require('fs');

/**
 * plugins manager
 */
class WebSiteMgr {
  /**
   * plugins manager
   * @constructor
   */
  constructor() {
    this.mapGetArticles = {};
    this.mapExportArticle = {};

    this.load('./cfg/website.yaml');
  }

  /**
 * load config
 * @param {string} cfgfile - cfgfile
 */
  load(cfgfile) {
    const fd = fs.readFileSync(cfgfile);
    if (fd) {
      const cfg = yaml.load(fd);

      this.mapGetArticles = cfg.getarticles;
      this.mapExportArticle = cfg.exportarticle;
    }
  }

  /**
   * get articles
   * @param {string} website - website
   * @return {object} objGetArticles - get articles config
   */
  getArticles(website) {
    if (this.mapGetArticles[website] != undefined) {
      return this.mapGetArticles[website];
    }

    return undefined;
  }

  /**
   * export article
   * @param {string} website - website
   * @return {object} objExportArticle - export article config
   */
  exportArticle(website) {
    if (this.mapExportArticle[website] != undefined) {
      return this.mapExportArticle[website];
    }

    return undefined;
  }
}

exports.mgrWebSite = new WebSiteMgr();
