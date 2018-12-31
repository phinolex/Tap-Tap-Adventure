define(["../entity"], function(Entity) {
  return Entity.extend({
    init(id, kind, count, ability, abilityLevel) {
      var self = this;

      self._super(id, kind);

      self.count = count;
      self.ability = ability;
      self.abilityLevel = abilityLevel;

      self.dropped = false;
      self.stackable = false;

      self.type = "item";
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
