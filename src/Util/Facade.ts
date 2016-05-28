
import {App} from '../App';
import {Logger} from './Logger';

export abstract class BaseFacade {

  protected app: App;
  protected log: Logger;

  constructor () {
    this.app = App.instance;
    this.log = Logger.instance;
  }

  public abstract async init();
  public abstract async run();
  public abstract async stop();
}
