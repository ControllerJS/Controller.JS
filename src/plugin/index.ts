

import {BaseFacade} from '../Util/Facade';
import {PluginManager} from './PluginManager';

export module Plugin {

  /**
   * Plugin Facade
   */
  export class Facade extends BaseFacade {

    public manager: PluginManager;

    constructor () {
      super();

      this.manager = new PluginManager();
    }

    public async init() {}

    public async run () {
    }

    public async stop() {}
  }
}
