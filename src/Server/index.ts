
import {BaseFacade} from '../Util/Facade';
import {Client} from './Client';

export module Server {
  export class Facade extends BaseFacade {

    public client: Client;

    constructor () {
      super();
    }

    public async init() {}
    public async run () {}
    public async stop () {}
  }
}
