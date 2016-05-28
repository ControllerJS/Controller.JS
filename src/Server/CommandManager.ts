/**
 * CommandManager
 */

import { EventEmitter } from 'events';
import {App} from '../App';
import {Client} from './Client';

export interface CommandOptions {
  level?: number;
  hide?: boolean;
  text?: string;
  strict?: boolean;
  admin?: boolean;
  command?: string;
}

/**
 * CommandManager - Holds events for '/' commands.
 */
export default class CommandManager extends EventEmitter {

  private app: App;
  private client: Client;

  private commands: {[s:string]:CommandOptions} = {};
  private adminCommands: {[s:string]:CommandOptions} = {};

  /**
   * @param {App} app
   * @param {ServerClient} client
   */
  constructor(client) {
    super();
    this.setMaxListeners(0);

    this.app = App.instance;
    this.client = client;

    this.commands = {};
    this.adminCommands = {};

    // Register chat event
    this.client.on('player.chat', (data) => {
      this.onChat(data);
    });
  }

  /**
   * Handle Player Command (chat) event.
   *
   * @param {{login: string, command: boolean, text: string}} data
   *
   * @private
   */
  private onChat (data) {
    if(data.command) {
      let parts = data.text.substr(1).split(' ');

      let command = parts[0];
      let params = parts.slice(1);

      if (!this.app.players.list.hasOwnProperty(data.login)) {
        return;
      }

      // Admin command?
      if (command === 'admin' && params.length >= 1) {
        if (this.commands.hasOwnProperty('admin__' + params[0])) {
          return this.handleAdmin(this.app.players.list[data.login], this.commands['admin__' + params[0]], params.slice(1), data);
        }
      }

      // Non-admin command (could still have level btw).
      if (this.commands.hasOwnProperty(command)) {
        return this.handle(this.app.players.list[data.login], this.commands[command], params, data);
      }

      // If not yet returned, show error.
      this.app.server.send().chat('Error, command doesn\'t exist!', {destination: data.login}).exec();
    }
  }

  /**
   * Handle Command.
   *
   * @param {Player} player
   * @param {CommandManager~CommandOptions} command
   * @param {string[]} params
   * @param {object} data Raw Data.
   */
  private handle (player, command, params, data) {
    if (player.level >= command.level) {
      return this.emit(command.command, this.app.players.list[data.login], params, data);
    }
    this.app.server.send().chat('Error, you are not allowed to use this command!', {destination: data.login}).exec();
  }

  /**
   * Handle Admin Command.
   *
   * @param {Player} player
   * @param {CommandManager~CommandOptions} command
   * @param {string[]} params
   * @param {object} data Raw Data.
   */
  private handleAdmin (player, command, params, data) {
    if (player.level >= command.level) {
      return this.emit(command.command, this.app.players.list[data.login], params, data);
    }
    this.app.server.send().chat('Error, you are not allowed to use this command!', {destination: data.login}).exec();
  }




  // Public Methods.

  /* tslint:disable */
  //noinspection JSAnnotator
  /**
   * Register callback for command.
   *
   * @param {string} command.
   * @param {CommandManager~CommandOptions} options Options, such as level, hide in help and comment.
   * @param {CommandManager~CommandCallback} callback
   */
  public on (command: string, options: CommandOptions, callback: Function) {
    this.register(command, options, callback, false);
  }

  //noinspection JSAnnotator
  /**
   * Register callback for command. (One single time).
   *
   * @param {string} command.
   * @param {number} [level] player minimum level.
   * @param {CommandManager~CommandCallback} callback
   */
  public once(command: string, level: number, callback: Function) {
    this.register(command, level, callback, true);
  }
  /* tslint:enable */

  /**
   * Register callback for command.
   *
   * @param {string} command.
   *
   * @param {CommandManager~CommandOptions|string|number} options Options, such as level, hide in help and comment. Give string for comment, number for level or object for mixed.
   * @param {CommandManager~CommandCallback} callback
   * @param {boolean} [single] Single time?
   */
  register(command: string, options: CommandOptions | string | number, callback: Function, single?: boolean) {
    // Parse optional and combined parameters.
    callback = callback || function() {};
    if (typeof options === 'number') {
      options = {level: options, hide: false, text: '', strict: false};
    }
    if (typeof options === 'string') {
      options = {level: 0, hide: false, text: options, strict: false};
    }
    if (! options.hide) options.hide = false;
    if (! options.text) options.text = '';
    if (! options.level) options.level = 0;
    if (! options.strict) options.strict = false;

    // /admin ...
    options.admin = options.admin || false;
    if (options.admin) { // Prefix the admin__.
      command = 'admin ' + command;
    }

    // Replace whitespaces for __
    command = command.replace(/\s/g, '__');

    options.command = command; // Save command in options itself too.

    if (options.level > 3 || options.level < 0) {
      options.level = 0;
    }
    single = single || false;

    // Strict mode on for commands?
    if (this.commands.hasOwnProperty(command)) { // && (this.commands[command].strict || options.strict)) {
      throw new Error('The command \''+command+'\' is already registered for a command! One of the commands has strict mode on!');
    }

    // Set options, register to commands array.
    this.commands[command] = options;

    // Register callback.
    if (single) {
      super.once(command, (player, params) => {
        callback(player, params);
      });
    } else {
      super.on(command, (player, params) => {
        callback(player, params);
      });
    }
  }

  /**
   * @callback CommandManager~CommandCallback
   *
   * @param {Player} player Player object.
   * @param {object} param Parameter array.
   */
}


