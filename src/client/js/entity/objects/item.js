define(["../entity"], function(Entity) {
  return Entity.extend({
    init(id, kind, count, ability, abilityLevel) {
      var self = this;

      this._super(id, kind);

      this.count = count;
      this.ability = ability;
      this.abilityLevel = abilityLevel;

      this.dropped = false;
      this.stackable = false;

      this.type = "item";
    },

    idle() {
      this.setAnimation("idle", 150);
    },

    setName(name) {
      this._super(name);
    },

    setAnimation(name, speed, count) {
      this._super(name, speed, count);
    },

    setGridPosition(x, y) {
      this._super(x, y);
    },

    setSprite(sprite) {
      this._super(sprite);
    },

    hasShadow() {
      return true;
    }
  });
});
