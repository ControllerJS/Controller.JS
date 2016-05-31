
import * as path from 'path';
import * as glob from 'glob';
import {Sequelize} from 'sequelize';

import {App} from '../app';
import {Configuration, DatabaseDialect} from './../util/configuration';

export class Client {

  private app: App;
  private sequelize: Sequelize;

  private options: any;

  private database: string;
  private username: string;
  private password: string;

  constructor () {
    this.app = App.instance;
    this.sequelize = null;

    let config = Configuration.instance.config.config.db;
    let options = {
      pool: config.pool
    };

    if (config.dialect ===  DatabaseDialect.mysql
      || config.dialect === DatabaseDialect.mariadb
      || config.dialect === DatabaseDialect.mssql
      || config.dialect === DatabaseDialect.postgres) {

      Object.assign(options, {
        host: config[config.dialect].host,
        port: config[config.dialect].port,
        dialect: config.dialect
      });
    }

    if (config.dialect === DatabaseDialect.sqlite) {
      Object.assign(options, {
        dialect: 'sqlite',
        storage: (
          config.sqlite.storage.startsWith('./') ?
            path.normalize(location + '/' + config.sqlite.storage)
            :
            path.resolve(config.sqlite.storage)
        )
      });
    }

    if (this.app.config.config.db.debug) {
      Object.assign(options, {
        logging: (input) => {this.app.log.debug(input);}
      });
    } else {
      Object.assign(options, {
        logging: false
      });
    }

    this.options = options;
    this.database = config.database;
    this.username = config.authentication.username;
    this.password = config.authentication.password;
  }

  /**
   * Connect to the database.
   * @async
   */
  public connect () {
    this.sequelize = new Sequelize.Sequelize(this.database, this.username, this.password, this.options);
  }

  /**
   * Sync Database
   * @return {Promise<any>}
   * @async
   */
  public async sync () {
    return this.sequelize.sync();
  }

  /**
   * Load All Models for the Core.
   */
  public async loadCoreModels () {
    let list = glob.sync(path.normalize(__dirname + '/../Models/') + '*.js');

    if (list.length > 0) {
      list.forEach((file) => {
        // Import sequelize model.
        let model:any = this.sequelize.import(file);

        // Save to model storage of app.
        this.app.models[model.name] = model;
      });
    }
  }

}
