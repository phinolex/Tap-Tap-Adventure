/* global log, _, Modules, Packets */

define([
  "../renderer/grids",
  "../entity/character/character",
  "../entity/character/player/player",
  "./sprites"
], function(Grids, Character, Player, Sprites) {
  return Class.extend({
    init: function(game) {
      var self = this;

      self.game = game;
      self.renderer = game.renderer;

      self.grids = null;
      self.sprites = null;

      self.entities = {};
      self.decrepit = {};
    },

    load: function() {
      var self = this;

      self.game.app.sendStatus("Inviting craziness...");

      if (!self.sprites) {
        self.sprites = new Sprites(self.game.renderer);
      }

      self.game.app.sendStatus("Lots of spooky monsters...");
    },

    update: function() {
      var self = this;

      if (self.sprites) self.sprites.updateSprites();
    },

    create: function(info) {
      var self = this,
        entity = new Player();

      entity.setGridPosition(0, 0);

      // set the default character sprite
      entity.setSprite(self.getSprite("clotharmor"));
      entity.idle();

      entity.loadHandler(self.game);

      self.addEntity(entity);

      entity.setGridPosition(0, 0);

      entity.idle();

      self.addEntity(entity);

      if (entity.handler) {
        entity.handler.setGame(self.game);
        entity.handler.load();
      }

      /**
       * Get ready for errors!
       */
    },

    get: function(id) {
      var self = this;

      if (id in self.entities) return self.entities[id];

      return null;
    },

    exists: function(id) {
      return id in this.entities;
    },

    clearPlayers: function(exception) {
      var self = this;

      _.each(self.entities, function(entity) {
        if (entity.id !== exception.id && entity.type === "player") {
          self.grids.removeFromRenderingGrid(
            entity,
            entity.gridX,
            entity.gridY
          );
          self.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

          delete self.entities[entity.id];
        }
      });

      self.grids.resetPathingGrid();
    },

    addEntity: function(entity) {
      var self = this;

      if (self.entities[entity.id]) return;

      self.entities[entity.id] = entity;
      self.registerPosition(entity);

      if (
        !(entity instanceof Item && entity.dropped) &&
        !self.renderer.isPortableDevice()
      )
        entity.fadeIn(self.game.time);
    },

    removeItem: function(item) {
      var self = this;

      if (!item) return;

      self.grids.removeFromItemGrid(item, item.gridX, item.gridY);
      self.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

      delete self.entities[item.id];
    },

    registerPosition: function(entity) {
      var self = this;

      if (!entity) return;

      if (
        entity.type === "player" ||
        entity.type === "mob" ||
        entity.type === "npc" ||
        entity.type === "chest"
      ) {
        self.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

        if (entity.type !== "player" || entity.nonPathable)
          self.grids.addToPathingGrid(entity.gridX, entity.gridY);
      }

      if (entity.type === "item")
        self.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

      self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
    },

    registerDuality: function(entity) {
      var self = this;

      if (!entity) return;

      self.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

      self.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

      if (entity.nextGridX > -1 && entity.nextGridY > -1) {
        self.grids.entityGrid[entity.nextGridY][entity.nextGridX][
          entity.id
        ] = entity;

        if (!(entity instanceof Player))
          self.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
      }
    },

    unregisterPosition: function(entity) {
      var self = this;

      if (!entity) return;

      self.grids.removeEntity(entity);
    },

    getSprite: function(name) {
      return this.sprites.sprites[name];
    },

    getAll: function() {
      return this.entities;
    },

    forEachEntity: function(callback) {
      _.each(this.entities, function(entity) {
        callback(entity);
      });
    },

    forEachEntityAround: function(x, y, radius, callback) {
      var self = this;

      for (var i = x - radius, max_i = x + radius; i <= max_i; i++) {
        for (var j = y - radius, max_j = y + radius; j <= max_j; j++) {
          if (self.map.isOutOfBounds(i, j)) continue;

          _.each(self.grids.renderingGrid[j][i], function(entity) {
            callback(entity);
          });
        }
      }
    }
  });
});
