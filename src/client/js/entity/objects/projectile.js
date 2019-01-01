define(["../entity"], function(Entity) {
  return Entity.extend({
    init(id, kind, owner) {
      var self = this;

      this._super(id, kind);

      this.owner = owner;

      this.name = "";

      this.startX = -1;
      this.startY = -1;

      this.destX = -1;
      this.destY = -1;

      this.special = -1;

      this.static = false;
      this.dynamic = false;

      this.speed = 200;

      this.angle = 0;
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

      this.setGridPosition(Math.floor(x / 16), Math.floor(y / 16));

      this.startX = x;
      this.startY = y;
    },

    setDestination(x, y) {
      var self = this;

      this.static = true;

      this.destX = x;
      this.destY = y;

      this.updateAngle();
    },

    setTarget(target) {
      var self = this;

      if (!target) return;

      this.dynamic = true;

      this.destX = target.x;
      this.destY = target.y;

      this.updateAngle();

      if (target.type !== "mob") return;

      target.onMove(function() {
        this.destX = target.x;
        this.destY = target.y;

        this.updateAngle();
      });
    },

    getSpeed() {
      var self = this;

      return 1;
    },

    updateTarget(x, y) {
      var self = this;

      this.destX = x;
      this.destY = y;
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
