import _ from 'underscore';
import log from 'log';
import Area from '../area';
import map from '../../../data/map/world_server.json';

export default class ChestAreas {
  constructor(world) {
    this.world = world;

    this.chestAreas = [];

    this.load();
  }

  load() {
    _.each(map.chestAreas, (m) => {
      const chestArea = new Area(m.id, m.x, m.y, m.width, m.height);

      chestArea.maxEntities = m.entities;
      chestArea.items = m.i;
      chestArea.cX = m.tx;
      chestArea.cY = m.ty;

      this.chestAreas.push(chestArea);

      chestArea.onEmpty(() => {
        this.spawnChest(this);
      });

      chestArea.onSpawn(() => {
        this.removeChest(this);
      });
    });

    log.info(`Loaded ${this.chestAreas.length} chest areas.`);
  }

  standardize() {
    _.each(this.chestAreas, (chestArea) => {
      chestArea.setMaxEntities(chestArea.entities.length);
    });
  }

  spawnChest(chestArea) {
    chestArea.chest = this.world.spawnChest( // eslint-disable-line
      chestArea.items,
      chestArea.cX,
      chestArea.cY,
      false,
    );
  }

  removeChest(chestArea) {
    if (!chestArea.chest) {
      return;
    }

    this.world.removeChest(chestArea.chest);

    chestArea.chest = null; // eslint-disable-line
  }
}
