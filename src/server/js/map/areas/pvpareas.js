import _ from 'underscore';
import log from '../../util/log';
import Area from '../area';
import map from '../../../data/map/world_server.json';

export default class PVPAreas {
  constructor() {
    this.pvpAreas = [];
    this.load();
  }

  load() {
    const
      list = map.pvpAreas;

    _.each(list, (p) => {
      const pvpArea = new Area(p.id, p.x, p.y, p.width, p.height);

      this.pvpAreas.push(pvpArea);
    });

    log.debug(`Loaded ${this.pvpAreas.length} PVP areas.`);
  }
}
