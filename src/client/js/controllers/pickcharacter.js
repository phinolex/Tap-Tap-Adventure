/* global log, _, Modules, Packets */

define([
  "../renderer/grids",
  "../entity/character/character",
  "../entity/character/player/player",
  "./sprites"
], function(Grids, Character, Player, Sprites) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;
      this.renderer = game.renderer;

      this.grids = null;
      this.sprites = null;

      this.entities = {};
      this.decrepit = {};
    },

    load() {
      var self = this;

      this.game.app.sendStatus("Inviting craziness...");

      if (!this.sprites) {
        this.sprites = new Sprites(this.game.renderer);
      }

      this.game.app.sendStatus("Lots of spooky monsters...");
    },

    update() {
      var self = this;

      if (this.sprites) this.sprites.updateSprites();
    },

    create(info) {
      var self = this,
        entity = new Player();

      entity.setGridPosition(0, 0);

      // set the default character sprite
      entity.setSprite(this.getSprite("clotharmor"));
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
    },

    get(id) {
      var self = this;

      if (id in this.entities) return this.entities[id];

      return null;
    },

    exists(id) {
      return id in this.entities;
    },

    clearPlayers(exception) {
      var self = this;

      _.each(this.entities, function(entity) {
        if (entity.id !== exception.id && entity.type === "player") {
          this.grids.removeFromRenderingGrid(
            entity,
            entity.gridX,
            entity.gridY
          );
          this.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

          delete this.entities[entity.id];
        }
      });

      this.grids.resetPathingGrid();
    },

    addEntity(entity) {
      var self = this;

      if (this.entities[entity.id]) return;

      this.entities[entity.id] = entity;
      this.registerPosition(entity);

      if (
        !(entity instanceof Item && entity.dropped) &&
        !this.renderer.isPortableDevice()
      )
        entity.fadeIn(this.game.time);
    },

    removeItem(item) {
      var self = this;

      if (!item) return;

      this.grids.removeFromItemGrid(item, item.gridX, item.gridY);
      this.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

      delete this.entities[item.id];
    },

    registerPosition(entity) {
      var self = this;

      if (!entity) return;

      if (
        entity.type === "player" ||
        entity.type === "mob" ||
        entity.type === "npc" ||
        entity.type === "chest"
      ) {
        this.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

        if (entity.type !== "player" || entity.nonPathable)
          this.grids.addToPathingGrid(entity.gridX, entity.gridY);
      }

      if (entity.type === "item")
        this.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

      this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
    },

    registerDuality(entity) {
      var self = this;

      if (!entity) return;

      this.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

      this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

      if (entity.nextGridX > -1 && entity.nextGridY > -1) {
        this.grids.entityGrid[entity.nextGridY][entity.nextGridX][
          entity.id
        ] = entity;

        if (!(entity instanceof Player))
          this.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
      }
    },

    unregisterPosition(entity) {
      var self = this;

      if (!entity) return;

      this.grids.removeEntity(entity);
    },

    getSprite(name) {
      return this.sprites.sprites[name];
    },

    getAll() {
      return this.entities;
    },

    forEachEntity(callback) {
      _.each(this.entities, function(entity) {
        callback(entity);
      });
    },

    forEachEntityAround(x, y, radius, callback) {
      var self = this;

      for (var i = x - radius, max_i = x + radius; i <= max_i; i++) {
        for (var j = y - radius, max_j = y + radius; j <= max_j; j++) {
          if (this.map.isOutOfBounds(i, j)) continue;

          _.each(this.grids.renderingGrid[j][i], function(entity) {
            callback(entity);
          });
        }
      }
    }
  });
});
