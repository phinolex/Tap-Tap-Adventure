define(["../character"], function(Character) {
  return Character.extend({
    init(id, kind) {
      var self = this;

      self._super(id, kind);

      self.name = name;

      self.hitPoints = -1;
      self.maxHitPoints = -1;

      self.type = "mob";
    },

    setHitPoints(hitPoints) {
      this._super(hitPoints);
    },

    setMaxHitPoints(maxHitPoints) {
      this._super(maxHitPoints);
    },

    idle() {
      this._super();
    },

    performAction(orientation, action) {
      this._super(orientation, action);
    },

    setSprite(sprite) {
      this._super(sprite);
    },

    setName(name) {
      this.name = name;
    },

    setGridPosition(x, y) {
      this._super(x, y);
    }
  });
});
