/* global log, Packets */

define(["./character/character"], function(Character) {
  return Class.extend({
    init(entity) {
      var self = this;

      self.entity = entity;
      self.game = null;
      self.entities = null;
    },

    load() {
      var self = this;

      if (!self.entity || !self.game) return;

      if (self.isCharacter()) {
        self.entity.onRequestPath(function(x, y) {
          var ignored = [self.entity];

          return self.game.findPath(self.entity, x, y, ignored);
        });

        self.entity.onBeforeStep(function() {
          self.entities.unregisterPosition(self.entity);
        });

        self.entity.onStep(function() {
          self.entities.registerDuality(self.entity);

          self.entity.forEachAttacker(function(attacker) {
            if (
              attacker.hasTarget() &&
              attacker.target.id === self.entity.id &&
              !attacker.stunned
            )
              attacker.follow(self.entity);
          });

          if (self.entity.type === "mob")
            self.game.socket.send(Packets.Movement, [
              Packets.MovementOpcode.Entity,
              self.entity.id,
              self.entity.gridX,
              self.entity.gridY
            ]);

          if (
            self.entity.attackRange > 1 &&
            self.entity.hasTarget() &&
            self.entity.getDistance(self.entity.target) <=
              self.entity.attackRange
          )
            self.entity.stop(false);
        });

        self.entity.onStopPathing(function() {
          self.entities.grids.addToRenderingGrid(
            self.entity,
            self.entity.gridX,
            self.entity.gridY
          );

          self.entities.unregisterPosition(self.entity);
          self.entities.registerPosition(self.entity);
        });
      }
    },

    isCharacter() {
      return (
        this.entity.type &&
        (this.entity.type === "player" ||
          this.entity.type === "mob" ||
          this.entity.type === "npc")
      );
    },

    setGame(game) {
      var self = this;

      if (!self.game) self.game = game;

      self.setEntities(self.game.entities);
    },

    setEntities(entities) {
      var self = this;

      if (!self.entities) self.entities = entities;
    }
  });
});
