/**
 * Send anything to the MP Server.
 * Sending query builder.
 */

import {Client} from './Client';
import {App} from '../App';

/**
 * Global Send Queue. When using delayed sending.
 * @type {Array}
 * @todo Implement global queue, and runner.
 * @deprecated
 */
export var globalQueue = [];

/**
 * Send
 * @class Send
 * @type {Send}
 */
export class Send {

  private app: App;
  private client: Client;

  private queue: any[];

  /**
   * Construct sending query instance.
   *
   * @param {App} app
   * @param {ServerClient} client
   */
  constructor(client: Client) {
    this.app = App.instance;
    this.client = client;

    // Contains the sending queues. (raw).
    this.queue = [];
  }

  /**
   * Send chat message.
   *
   * @param {string} text
   * @param {object} options Optional options.
   * @param {string} options.source Source of message, could be 'player', 'server' or 'global' (default)
   * @param {string} options.destination Destination, false for all, string for login (default false).
   *
   * @return {Send}
   */
  public chat(text: string, options?: SendChatOptions): this {
    options = options || {};
    let source = options.source || SendChatSource.global;
    let destination = options.destination || false;

    var query = {};
    if (source === SendChatSource.global) {
      if (! destination) {
        query = {
          query: 'ChatSendServerMessage',
          params: [('»» ' + text)]
        }
      } else {
        query = {
          query: 'ChatSendServerMessageToLogin',
          params: [('» ' + text), destination]
        }
      }
      this.queue.push(query);
    }
    // TODO: Manipulate 'source'.

    return this;
  }

  /**
   * Custom Query (maniaplanet query).
   * @param {string} query query string.
   * @param {array} params array of parameters.
   * @return {Send}
   */
  public custom(query: string, params?: Array<any>): this {
    params = params || [];
    this.queue.push({
      query: query,
      params: params
    });
    return this;
  }

  /**
   * Execute builded query.
   *
   * @return {Promise|boolean}
   */
  public async exec() {
    if (! this.queue.length) {
      return false;
    }
    if (this.queue.length === 1) {
      return this.client.gbx.query(this.queue[0].query, this.queue[0].params);
    } else {
      // TODO: Calculate size of queue. Limit is 2MB (XML!!)
      // TODO: Add support for multicall (todo in gbxremote!).
      let params = [];
      this.queue.forEach((query) => {
        params.push({methodName: query.query, params: query.params});
      });
      let inspect = require('util').inspect;
      console.log(inspect(params, {colors: true}));

      return Promise.reject('No support for multicalls yet!');
      //return this.client.gbx.query('system.multicall', params);
    }
  }
}


interface SendChatOptions {
  source?: SendChatSource;
  destination?: boolean | string;
}
enum SendChatSource {
  player, server, global
}
