import * as Joi from 'joi';
import * as directory from './Directory'

import * as fs from 'fs';
import * as yaml from 'js-yaml';

let Package = require('./../../package.json');

/**
 * Configuration Class. Access by using the instance export.
 */
export class Configuration {
  private raw: any;
  private location: string;

  public  config: ConfigSchema;
  public  version: string;

  private static _instance: Configuration;

  public static get instance() {
    if (! Configuration._instance)
      Configuration._instance = new Configuration();
    return Configuration._instance;
  }

  constructor() {
    this.version = Package.version;
  }

  public load (location?: string): boolean {
    try {
      this.location = location || directory.rootPath() + 'config.yaml';
      this.config = yaml.safeLoad(fs.readFileSync(this.location, 'utf8'));
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  public validate(): boolean {
    var res = Joi.validate(this.config, schema);
    if (res.error) {
      throw res.error;
    }
    return true;
  }
}


let schema = {
  config: {
    debug: Joi.boolean(),
    server: {
      address: Joi.string().required(),
      port: Joi.number().required(),
      authentication: {
        username: Joi.string().required(),
        password: Joi.string().required()
      }
    },
    masteradmins: Joi.array().items(Joi.string()),
    db: {
      dialect: Joi.array().items(Joi.string().valid('mysql', 'mariadb', 'sqlite')),
      database: Joi.string(),
      authentication: {
        username: Joi.string(),
        password: Joi.string()
      }, pool: {
        max: Joi.number().required(),
        min: Joi.number().required(),
        idle: Joi.number().required()
      },
      mysql: {
        host: Joi.string().required(),
        port: Joi.number().required()
      },
      mariadb: {
        host: Joi.string().required(),
        port: Joi.number().required()
      },
      sqlite: {
        storage: Joi.string().required()
      }
    }
  },
  plugins: Joi.array()
};

export interface ConfigSchema {
  config: AppConfig,
  plugins:{
    [s: string]: PluginConfig
  }
}

export interface AppConfig {
  debug: boolean,
  server: {
    address: string,
    port: number,
    authentication: {
      username: string,
      password: string
    }
  },
  masteradmins?: string[],
  db: {
    dialect: DatabaseDialect,
    database: string,
    authentication: {
      username: string,
      password: string
    },
    pool: {
      min: number,
      max: number,
      idle: number
    },
    mysql: {
      host: number,
      port: number
    },
    mariadb: {
      host: number,
      port: number
    },
    sqlite: {
      storage: string
    },
    debug?: boolean
  }
}

export interface PluginConfig {

}

export enum DatabaseDialect {
  mssql,
  mysql,
  mariadb,
  sqlite,
  postgres
}
