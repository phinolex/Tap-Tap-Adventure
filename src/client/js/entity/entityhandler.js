/* global log, Packets */

define(["./character/character"], function(Character) {
  return Class.extend({
    init(entity) {
      var self = this;

      this.entity = entity;
      this.game = null;
      this.entities = null;
    },

    load() {
      var self = this;

      if (!this.entity || !this.game) return;

      if (this.isCharacter()) {
        this.entity.onRequestPath(function(x, y) {
          var ignored = [this.entity];

          return this.game.findPath(this.entity, x, y, ignored);
        });

        this.entity.onBeforeStep(function() {
          this.entities.unregisterPosition(this.entity);
        });

        this.entity.onStep(function() {
          this.entities.registerDuality(this.entity);

          this.entity.forEachAttacker(function(attacker) {
            if (
              attacker.hasTarget() &&
              attacker.target.id === this.entity.id &&
              !attacker.stunned
            )
              attacker.follow(this.entity);
          });

          if (this.entity.type === "mob")
            this.game.socket.send(Packets.Movement, [
              Packets.MovementOpcode.Entity,
              this.entity.id,
              this.entity.gridX,
              this.entity.gridY
            ]);

          if (
            this.entity.attackRange > 1 &&
            this.entity.hasTarget() &&
            this.entity.getDistance(this.entity.target) <=
              this.entity.attackRange
          )
            this.entity.stop(false);
        });

        this.entity.onStopPathing(function() {
          this.entities.grids.addToRenderingGrid(
            this.entity,
            this.entity.gridX,
            this.entity.gridY
          );

          this.entities.unregisterPosition(this.entity);
          this.entities.registerPosition(this.entity);
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

      if (!this.game) this.game = game;

      this.setEntities(this.game.entities);
    },

    setEntities(entities) {
      var self = this;

      if (!this.entities) this.entities = entities;
    }
  });
});
