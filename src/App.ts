/**
 * ManiaJS App Class.
 */

import {Logger} from './Util/Logger';
import {ConfigSchema, Configuration} from './Util/Configuration';

import {Server} from './Server/index';
import {Util} from './Util/index';
import {Database} from './Database/index';
import {Plugin} from './Plugin/index';
import {Game} from './Game/index';
import {UI} from './UI/index';

import {Client as ServerClient} from './Server/Client';


/**
 * ManiaJS App
 */
export class App {
  private static _instance: App;

  public static get instance() {
    if (! App._instance)
      App._instance = new App(Logger.instance, Configuration.instance.version, Configuration.instance.config);
    return App._instance;
  }

  public log: Logger;
  public version: string;
  public config: ConfigSchema;

  /**
   * INTERNAL FACADE
   * Facade classes of components.
   */
  public serverFacade: Server.Facade;
  public databaseFacade: Database.Facade;
  public pluginFacade: Plugin.Facade;
  public gameFacade: Game.Facade;
  public uiFacade: UI.Facade;
  public utilFacade: Util.Facade;

  /**
   * PUBLIC INTERFACE VARIABLES
   * Will be used for providing plugins features. Keep stable please.
   */
  public util;
  public ui;
  public players;
  public maps;
  public server: ServerClient;
  public models: { [s: string]: any } = {};
  public plugins: { [s: string]: any } = {}; // TODO: Change to ModulePlugin once the interface is converted too.

  constructor (
    logger: Logger,
    version: string,
    config: ConfigSchema
  ) {
    this.log = logger;
    this.version = version;
    this.config = config;

    this.serverFacade = new Server.Facade();
    this.databaseFacade = new Database.Facade();
    this.pluginFacade = new Plugin.Facade();
    this.gameFacade = new Game.Facade();
    this.uiFacade = new UI.Facade();
    this.utilFacade = new Util.Facade();

    this.players = this.gameFacade.players;
    this.maps = this.gameFacade.maps;
    this.server = this.serverFacade.client;

    this.util = this.utilFacade;
    this.ui = this.uiFacade;
  }

  public async prepare () {
    try {
      await this.serverFacade.init();
      await this.databaseFacade.init();
      await this.uiFacade.init();
      await this.pluginFacade.init();
      await this.gameFacade.init();
    } catch (err) {
      this.log.fatal(err);
      process.exit(1);
    }
  }

  public async run () {
    try {
      await this.serverFacade.run();
      await this.databaseFacade.run();
      await this.gameFacade.run();
      await this.uiFacade.run();
      await this.pluginFacade.run();

      this.log.info('Controller Ready!');
      await this.server.send().chat(`$o$f90Mania$z$o$f90JS$z$fff: Controller ready! $n(${this.version})`).exec();
    } catch (err) {
      this.log.fatal(err);
    }
  }

  public async exit () {
    this.server.send().chat('$o$f90Mania$z$o$f90JS$z$fff: Controller shutting down!').exec();
    this.pluginFacade.stop();
    this.uiFacade.stop();
    this.gameFacade.stop();
    this.serverFacade.stop();
    this.databaseFacade.stop();
    this.utilFacade.stop();
  }

}
