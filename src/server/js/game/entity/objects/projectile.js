var Entity = require("../entity");

module.exports = Projectile = Entity.extend({
  init(id, instance) {
    var self = this;

    this._super(id, "projectile", instance);

    this.startX = -1;
    this.startY = -1;
    this.destX = -1;
    this.destY = -1;

    this.target = null;

    this.damage = -1;

    this.hitType = null;

    this.owner = null;
  },

  setStart(x, y) {
    var self = this;

    this.x = x;
    this.y = y;
  },

  setTarget(target) {
    var self = this;

    this.target = target;

    this.destX = target.x;
    this.destY = target.y;
  },

  setStaticTarget(x, y) {
    var self = this;

    this.static = true;

    this.destX = x;
    this.destY = y;
  },

  getData() {
    var self = this;

    /**
     * Cannot generate a projectile
     * unless it has a target.
     */

    if (!this.owner || !this.target) return;

    return {
      id: this.instance,
      name: this.owner.projectileName,
      characterId: this.owner.instance,
      targetId: this.target.instance,
      damage: this.damage,
      special: this.special,
      hitType: this.hitType,
      type: this.type
    };
  }
});
