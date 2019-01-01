/* global _, Modules */

define(["../utils/queue", "../renderer/infos/splat"], function(Queue, Splat) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;

      this.infos = {};
      this.destroyQueue = new Queue();
    },

    create(type, data, x, y) {
      var self = this;

      switch (type) {
        case Modules.Hits.Damage:
        case Modules.Hits.Stun:
        case Modules.Hits.Critical:
          var damage = data.shift(),
            isTarget = data.shift(),
            dId = this.generateId(this.game.time, damage, x, y);

          if (damage < 1 || !isInt(damage)) damage = "MISS";

          var hitSplat = new Splat(dId, type, damage, x, y, false),
            dColour = isTarget
              ? Modules.DamageColours.received
              : Modules.DamageColours.inflicted;

          hitSplat.setColours(dColour.fill, dColour.stroke);

          this.addInfo(hitSplat);

          break;

        case Modules.Hits.Heal:
        case Modules.Hits.Mana:
        case Modules.Hits.Experience:
          var amount = data.shift(),
            id = this.generateId(this.game.time, amount, x, y),
            text = "+",
            colour;

          if (amount < 1 || !isInt(amount)) return;

          if (type !== Modules.Hits.Experience) text = "++";

          var splat = new Splat(id, type, text + amount, x, y, false);

          if (type === Modules.Hits.Heal) colour = Modules.DamageColours.healed;
          else if (type === Modules.Hits.Mana)
            colour = Modules.DamageColours.mana;
          else if (type === Modules.Hits.Experience)
            colour = Modules.DamageColours.exp;

          splat.setColours(colour.fill, colour.stroke);

          this.addInfo(splat);

          break;

        case Modules.Hits.LevelUp:
          var lId = this.generateId(this.game.time, "-1", x, y),
            levelSplat = new Splat(lId, type, "Level Up!", x, y, false),
            lColour = Modules.DamageColours.exp;

          levelSplat.setColours(lColour.fill, lColour.stroke);

          this.addInfo(levelSplat);

          break;
      }
    },

    getCount() {
      return Object.keys(this.infos).length;
    },

    addInfo(info) {
      var self = this;

      this.infos[info.id] = info;

      info.onDestroy(function(id) {
        this.destroyQueue.add(id);
      });
    },

    update(time) {
      var self = this;

      this.forEachInfo(function(info) {
        info.update(time);
      });

      this.destroyQueue.forEachQueue(function(id) {
        delete this.infos[id];
      });

      this.destroyQueue.reset();
    },

    forEachInfo(callback) {
      _.each(this.infos, function(info) {
        callback(info);
      });
    },

    generateId(time, info, x, y) {
      return time + "" + Math.abs(info) + "" + x + "" + y;
    }
  });
});
