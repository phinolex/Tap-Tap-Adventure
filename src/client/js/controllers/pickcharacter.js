import _ from 'underscore';
import Player from '../entity/character/player/player';
import Sprites from './sprites';
import Item from '../entity/objects/item';

export default class PickCharacter {
  constructor(game) {
    this.game = game;
    this.renderer = game.renderer;

    this.grids = null;
    this.sprites = null;

    this.entities = {};
    this.decrepit = {};
  }

  load() {
    this.game.app.sendStatus('Inviting craziness...');

    if (!this.sprites) {
      this.sprites = new Sprites(this.game.renderer);
    }

    this.game.app.sendStatus('Lots of spooky monsters...');
  }

  update() {
    if (this.sprites) this.sprites.updateSprites();
  }

  create() {
    const entity = new Player();

    entity.setGridPosition(0, 0);

    // set the default character sprite
    entity.setSprite(this.getSprite('clotharmor'));
    entity.idle();

    entity.loadHandler(this.game);

    this.addEntity(entity);

    entity.setGridPosition(0, 0);

    entity.idle();

    this.addEntity(entity);

    if (entity.handler) {
      entity.handler.setGame(this.game);
      entity.handler.load();
    }

    /**
     * Get ready for errors!
     */
  }

  get(id) {
    if (id in this.entities) return this.entities[id];

    return null;
  }

  exists(id) {
    return id in this.entities;
  }

  clearPlayers(exception) {
    _.each(this.entities, (entity) => {
      if (entity.id !== exception.id && entity.type === 'player') {
        this.grids.removeFromRenderingGrid(
          entity,
          entity.gridX,
          entity.gridY,
        );
        this.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

        delete this.entities[entity.id];
      }
    });

    this.grids.resetPathingGrid();
  }

  addEntity(entity) {
    if (this.entities[entity.id]) return;

    this.entities[entity.id] = entity;
    this.registerPosition(entity);

    if (
      !(entity instanceof Item && entity.dropped)
      && !this.renderer.isPortableDevice()
    ) entity.fadeIn(this.game.time);
  }

  removeItem(item) {
    if (!item) return;

    this.grids.removeFromItemGrid(item, item.gridX, item.gridY);
    this.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

    delete this.entities[item.id];
  }

  registerPosition(entity) {
    if (!entity) return;

    if (
      entity.type === 'player'
      || entity.type === 'mob'
      || entity.type === 'npc'
      || entity.type === 'chest'
    ) {
      this.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

      if (entity.type !== 'player' || entity.nonPathable) this.grids.addToPathingGrid(entity.gridX, entity.gridY);
    }

    if (entity.type === 'item') this.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

    this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
  }

  registerDuality(entity) {
    if (!entity) return;

    this.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

    this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

    if (entity.nextGridX > -1 && entity.nextGridY > -1) {
      this.grids.entityGrid[entity.nextGridY][entity.nextGridX][
        entity.id
      ] = entity;

      if (!(entity instanceof Player)) {
        this.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
      }
    }
  }

  unregisterPosition(entity) {
    if (!entity) return;

    this.grids.removeEntity(entity);
  }

  getSprite(name) {
    return this.sprites.sprites[name];
  }

  getAll() {
    return this.entities;
  }

  forEachEntity(callback) {
    _.each(this.entities, (entity) => {
      callback(entity);
    });
  }

  forEachEntityAround(x, y, radius, callback) {
    for (let i = x - radius, maxI = x + radius; i <= maxI; i += 1) {
      for (let j = y - radius, maxJ = y + radius; j <= maxJ; j += 1) {
        if (!this.map.isOutOfBounds(i, j)) {
          _.each(this.grids.renderingGrid[j][i], (entity) => {
            callback(entity);
          });
        }
      }
    }
  }
}
