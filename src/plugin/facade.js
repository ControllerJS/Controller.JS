'use strict';

import Facade  from './../lib/base-facade';

import PluginManager from './plugin';

/**
 * Plugin Facade
 *
 * @class PluginFacade
 * @type {PluginFacade}
 */
export default class PluginFacade extends Facade {

  constructor(app) {
    super(app);

    this.manager = new PluginManager(app);
  }

  /**
   * Construct plugins.
   * @returns {Promise}
   */
  init() {
    return this.manager.loadPlugins();
  }

  /**
   * Start plugins.
   * @returns {Promise}
   */
  run() {
    return this.manager.startPlugins();
  }
}
