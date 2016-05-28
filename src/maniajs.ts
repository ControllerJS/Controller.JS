/// <reference path="../typings/index.d.ts" />

import {Command} from 'commander';
import {Configuration} from './util/configuration';

let packageInfo = require('./../package.json');

let program: any = new Command()
  .version(packageInfo.version)
  .option('-v, --verbose', 'More debug information in logs and console.')
  .option('-c, --config [location]', 'Custom config location to load.')
  .parse(process.argv);

/**
 * Load Configuration
 */
let configuration = Configuration.instance;

try {
  var configPath = null;
  if (typeof program.config === 'string') {
    configPath = program.config;
  } else if (process.env.hasOwnProperty('MJS_CONFIG_PATH')) {
    configPath = process.env.MJS_CONFIG_PATH;
  } else {
    configPath = null;
  }
  configuration.load(configPath);
  configuration.validate();
} catch (err) {
  console.error('Error reading configuration (config.yaml), you could try to provide custom configuration path with ' +
    '-c/--config [path]:');
  console.error(err);
  process.exit(1);
}

/** Boot Controller */
// boot();
