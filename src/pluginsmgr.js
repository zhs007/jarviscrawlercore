

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
 * @param {function} proc - async proc(url, page)
 * @param {function} formatArticle - async expaticleresult formatArticle(page)
 */
  regPlugin(pluginname, ismine, proc, formatArticle) {
    if (this.mapPlugins[pluginname] != undefined) {
      return;
    }

    this.mapPlugins[pluginname] = this.lstPlugins.length;

    this.lstPlugins.push({
      ismine: ismine,
      proc: proc,
      formatArticle: formatArticle,
    });
  }

  /**
 * procTask
 * @param {string} url - url
 * @param {object} page - puppeteer page
 * @return {object} ExportArticleResult - export article result
 */
  async procTask(url, page) {
    for (let i = 0; i < this.lstPlugins.length; ++i) {
      if (this.lstPlugins[i].ismine(url)) {
        await this.lstPlugins[i].proc(url, page);

        return await this.lstPlugins[i].formatArticle(page);
      }
    }

    return undefined;
  }
}

exports.PluginsMgr = PluginsMgr;
