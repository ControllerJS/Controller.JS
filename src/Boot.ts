/// <reference path="../typings/index.d.ts" />

import {Command} from 'commander';

import {Configuration} from './Util/Configuration';
import {Logger} from './Util/Logger';
import {App} from './App';

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

/** Prepare Logging */
let logger = Logger.instance;
logger.info('Starting ManiaJS...');

/**
 * Prepare Controller
 */
let app = App.instance;

/**
 * Exit/Error handlers.
 */
function exitHandler(options) {
  if (options.cleanup) {
    logger.info('ManiaJS is going to shutdown...');
    app.exit();
  }
  if (options.error)
    logger.error('Uncaught Exception: ', options.error.stack);
  if (options.exit) {
    process.exit();
  }
}
process.on('exit',              (   ) => exitHandler({cleanup: true}));
process.on('SIGINT',            (   ) => exitHandler({exit   : true}));
process.on('uncaughtException', (err) => exitHandler({error  : err}));


/**
 * Start Controller
 */
async function start () {
  await app.prepare();
  await app.run();
}
start().catch(err => logger.fatal(err));
