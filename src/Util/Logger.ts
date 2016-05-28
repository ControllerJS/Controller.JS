
import {Logger as Bunyan} from 'bunyan';
import PrettyStream = require('bunyan-prettystream');

export class Logger extends Bunyan {
  private static _instance: Logger;
  public static get instance() {
    if (! Logger._instance)
      Logger._instance = new Logger();
    return Logger._instance;
  }

  private pretty: PrettyStream;

  constructor () {
    let pretty = new PrettyStream();

    // TODO: Create dynamic log location.
    super({
      name: 'maniajs',
      streams: [
        {
          level: 'debug',
          type: 'raw',
          stream: pretty
        },
        {
          level: 'info',
          path: __dirname + '/../log/application.log'
        }
      ]
    });

    this.pretty = pretty;
    this.pretty.pipe(process.stdout);
  }
}
