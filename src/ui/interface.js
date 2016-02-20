/**
 * Interface Building Class, will trigger the template engine and fill with data.
 */
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as Handlebars from 'handlebars';

/**
 * Interface Builder Class
 *
 * @class InterfaceBuilder
 *
 * @property {{}|null} plugin Plugin Context, null if not running in plugin!
 * @property {string}  templatePath Template Base Path.
 *
 * @property {[]|boolean} players Player Logins, false for global (all players).
 * @property {{}|null} template Handlebars Template Instance.
 * @property {{}} data Handlebars Data.
 */
export default class {

  /**
   * Construct the Interface Builder.
   * @param {App} app App Context.
   * @param {UIFacade} facade UI Facade.
   * @param {string} viewFile View File.
   * @param {{}} [plugin] Plugin Context, optional, only when calling from plugin.
   * @param {number} [version] ManiaLink Version, defaults to 2.
   */
  constructor (app, facade, viewFile, plugin, version) {
    plugin = plugin || false;
    version = version || 2;

    // ManiaLink ID.
    this.id = (plugin ? plugin.name : 'core') + '__' + viewFile.substr(viewFile.lastIndexOf('/'));

    this.facade = facade;
    this.app = app;
    this.plugin = plugin;
    this.file = viewFile;
    this.version = version;

    this.template = null;

    this.globalData = {};
    this.playerData = {};

    // Holds force and changed data for players. Cache.
    this.forceUpdate = true; // True will force to send to all players (global or per player).
    this.playersChanged = [];

    // Directly compile (sync).
    this.compile();
  }

  /**
   * Compile the template view file.
   *
   * @returns {Promise}
   */
  compile () {
    try {
      let source = fs.readFileSync(this.file, 'utf-8');
      this.template = Handlebars.compile (source);
    } catch (err) {
      this.app.log.error('Error with loading/compiling view (' + this.file + ').: ', err);
    }
  }

  /**
   * Set Data for the template.
   * @param {{}} data
   *
   * @returns {InterfaceBuilder}
   */
  global (data) {
    this.globalData = data;

    this.forceUpdate = true;
    return this;
  }

  /**
   * Set Data for the template, for a specific player.
   * @param {string} login Player Login.
   * @param {{}} data Data. Indexed by Player Logins.
   *
   * @returns {InterfaceBuilder}
   */
  player (login, data) {
    this.playerData[login] = data;

    this.playersChanged.push(login);
    return this;
  }


  /**
   * Update Interface. Will send update to the client(s).
   */
  update () {
    return this.facade.manager.update(this, this.forceUpdate, this.playersChanged);
  }

  /**
   * On Answer.
   * @param {string} action Action Name.
   * @param {callback} callback Callback.
   * @params {object} callback.data
   */
  on (action, callback) {
    this.facade.manager.on(action, callback);
  }

  /**
   * Once Answer.
   * @param {string} action Action Name.
   * @param {callback} callback Callback.
   * @params {object} callback.data
   */
  once (action, callback) {
    this.facade.manager.once(action, callback);
  }

}
