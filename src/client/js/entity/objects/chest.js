define(["../entity"], function(Entity) {
  return Entity.extend({
    init(id, kind) {
      var self = this;

      self._super(id, kind);

      self.type = "chest";
    },

    idle() {
      this.setAnimation("idle_down", 150);
    },

    setName(name) {
      this._super(name);
    },

    setAnimation(name, speed, count, onEndCount) {
      this._super(name, speed, count, onEndCount);
    },

    setGridPosition(x, y) {
      this._super(x, y);
    },

    setSprite(sprite) {
      this._super(sprite);
    }
  });
});
