
import {BaseFacade} from './Facade';
import * as times from './Times';

export module Util {
  export class Facade extends BaseFacade {

    public times = times;
    public gbx = null; // todo

    constructor () {
      super();
    }

    public async init() {}
    public async run() {}
    public async stop() {}
  }
}
