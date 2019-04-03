

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
 * register plugin
 * @param {string} pluginname - plugin name
 * @param {function} ismine - bool ismine(url)
 * @param {function} exportArticle - async expaticleresult exportArticle(page)
 */
  regPlugin(pluginname, ismine, exportArticle) {
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
 * procTask
 * @param {string} url - url
 * @param {object} page - puppeteer page
 * @return {object} ExportArticleResult - export article result
 */
  async exportArticle(url, page) {
    for (let i = 0; i < this.lstPlugins.length; ++i) {
      if (this.lstPlugins[i].ismine(url)) {
        return await this.lstPlugins[i].exportArticle(page);
      }
    }

    return undefined;
  }
}

exports.PluginsMgr = PluginsMgr;
