define(["../entity"], function(Entity) {
  return Entity.extend({
    init(id, kind, owner) {
      var self = this;

      self._super(id, kind);

      self.owner = owner;

      self.name = "";

      self.startX = -1;
      self.startY = -1;

      self.destX = -1;
      self.destY = -1;

      self.special = -1;

      self.static = false;
      self.dynamic = false;

      self.speed = 200;

      self.angle = 0;
    },

    getId() {
      return this.id;
    },

    impact() {
      if (this.impactCallback) this.impactCallback();
    },

    setSprite(sprite) {
      this._super(sprite);
    },

    setAnimation(name, speed, count, onEndCount) {
      this._super(name, speed, count, onEndCount);
    },

    setStart(x, y) {
      var self = this;

      self.setGridPosition(Math.floor(x / 16), Math.floor(y / 16));

      self.startX = x;
      self.startY = y;
    },

    setDestination(x, y) {
      var self = this;

      self.static = true;

      self.destX = x;
      self.destY = y;

      self.updateAngle();
    },

    setTarget(target) {
      var self = this;

      if (!target) return;

      self.dynamic = true;

      self.destX = target.x;
      self.destY = target.y;

      self.updateAngle();

      if (target.type !== "mob") return;

      target.onMove(function() {
        self.destX = target.x;
        self.destY = target.y;

        self.updateAngle();
      });
    },

    getSpeed() {
      var self = this;

      return 1;
    },

    updateTarget(x, y) {
      var self = this;

      self.destX = x;
      self.destY = y;
    },

    hasPath() {
      return false;
    },

    updateAngle() {
      this.angle =
        Math.atan2(this.destY - this.y, this.destX - this.x) * (180 / Math.PI) -
        90;
    },

    onImpact(callback) {
      this.impactCallback = callback;
    }
  });
});
