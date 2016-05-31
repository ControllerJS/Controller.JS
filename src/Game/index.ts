

import {BaseFacade} from '../Util/Facade';
import Players from './Players';
import {Maps} from './Maps';

export module Game {
  export class Facade extends BaseFacade {

    public players: Players;
    public maps: Maps;

    constructor () {
      super();

      this.players = new Players();
      this.maps = new Maps();
    }

    public async init() {}

    public async run () {
      await this.players.boot();
      await this.maps.boot();
    }

    public async stop() {}
  }
}
