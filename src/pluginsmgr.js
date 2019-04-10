

/**
 * plugins manager
 */
class PluginsMgr {
  /**
 * plugins manager
 * @constructor
 */
  constructor() {
    this.lstPlugins = [];
    this.mapPlugins = {};
  }

  /**
 * register export article plugin
 * @param {string} pluginname - plugin name
 * @param {function} ismine - bool ismine(url)
 * @param {function} exportArticle - async expaticleresult exportArticle(page)
 */
  regExportArticle(pluginname, ismine, exportArticle) {
    if (this.mapPlugins[pluginname] != undefined) {
      return;
    }

    this.mapPlugins[pluginname] = this.lstPlugins.length;

    this.lstPlugins.push({
      ismine: ismine,
      exportArticle: exportArticle,
    });
  }

  /**
 * register get articles plugin
 * @param {string} pluginname - plugin name
 * @param {function} ismine - bool ismine(url)
 * @param {function} getArticles - async result getArticles(page)
 */
  regGetArticles(pluginname, ismine, getArticles) {
    if (this.mapPlugins[pluginname] != undefined) {
      return;
    }

    this.mapPlugins[pluginname] = this.lstPlugins.length;

    this.lstPlugins.push({
      ismine: ismine,
      getArticles: getArticles,
    });
  }

  /**
 * exportArticle
 * @param {string} url - url
 * @param {object} page - puppeteer page
 * @return {object} ArticleList - articles
 */
  async exportArticle(url, page) {
    for (let i = 0; i < this.lstPlugins.length; ++i) {
      if (this.lstPlugins[i].ismine(url)) {
        return await this.lstPlugins[i].exportArticle(page);
      }
    }

    return undefined;
  }

  /**
 * getArticles
 * @param {string} url - url
 * @param {object} page - puppeteer page
 * @return {object} ArticleList - articles
 */
  async getArticles(url, page) {
    for (let i = 0; i < this.lstPlugins.length; ++i) {
      if (this.lstPlugins[i].ismine(url)) {
        return await this.lstPlugins[i].getArticles(page);
      }
    }

    return undefined;
  }
}

exports.PluginsMgr = PluginsMgr;
