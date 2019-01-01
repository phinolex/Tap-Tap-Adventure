define(["../character"], function(Character) {
  return Character.extend({
    init(id, kind) {
      var self = this;

      this._super(id, kind);

      this.name = name;

      this.hitPoints = -1;
      this.maxHitPoints = -1;

      this.type = "mob";
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
