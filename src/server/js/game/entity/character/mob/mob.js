var Character = require("../character"),
  Mobs = require("../../../../util/mobs"),
  _ = require("underscore"),
  Utils = require("../../../../util/utils"),
  Items = require("../../../../util/items");

module.exports = Mob = Character.extend({
  constructor(id, instance, x, y) {
    

    this.super(id, "mob", instance, x, y);

    if (!Mobs.exists(id)) return;

    this.data = Mobs.Ids[this.id];
    this.hitPoints = this.data.hitPoints;
    this.maxHitPoints = this.data.hitPoints;
    this.drops = this.data.drops;

    this.respawnDelay = this.data.spawnDelay;

    this.level = this.data.level;

    this.armourLevel = this.data.armour;
    this.weaponLevel = this.data.weapon;
    this.attackRange = this.data.attackRange;
    this.aggroRange = this.data.aggroRange;
    this.aggressive = this.data.aggressive;

    this.spawnLocation = [x, y];

    this.dead = false;
    this.boss = false;
    this.static = false;

    this.projectileName = this.getProjectileName();
  },

  refresh() {
    

    this.hitPoints = this.data.hitPoints;
    this.maxHitPoints = this.data.hitPoints;

    if (this.refreshCallback) this.refreshCallback();
  },

  getDrop() {
    

    if (!this.drops) return null;

    var min = 0,
      percent = 0,
      random = Utils.randomInt(0, 1000);

    for (var drop in this.drops)
      if (this.drops.hasOwnProperty(drop)) {
        var chance = this.drops[drop];

        min = percent;
        percent += chance;

        if (random >= min && random < percent) {
          var count = 1;

          if (drop === "gold")
            count = Utils.randomInt(
              1,
              this.level *
                Math.floor(Math.pow(2, this.level / 7) / (this.level / 4))
            );

          return {
            id: Items.stringToId(drop),
            count: count
          };
        }
      }

    return null;
  },

  getProjectileName() {
    return this.data.projectileName
      ? this.data.projectileName
      : "projectile-pinearrow";
  },

  canAggro(player) {
    

    if (
      this.hasTarget() ||
      !this.aggressive ||
      Math.floor(this.level * 1.5) < player.level
    )
      return false;

    return this.isNear(player, this.aggroRange);
  },

  destroy() {
    

    this.dead = true;
    this.clearTarget();
    this.resetPosition();
    this.respawn();

    if (this.area) this.area.removeEntity(self);
  },

  return() {
    

    this.clearTarget();
    this.resetPosition();
    this.move(this.x, this.y);
  },

  isRanged() {
    return this.attackRange > 1;
  },

  distanceToSpawn() {
    return this.getCoordDistance(this.spawnLocation[0], this.spawnLocation[1]);
  },

  isAtSpawn() {
    return this.x === this.spawnLocation[0] && this.y === this.spawnLocation[1];
  },

  isOutsideSpawn() {
    return this.distanceToSpawn() > this.spawnDistance;
  },

  addToChestArea(chestAreas) {
    var self = this,
      area = _.find(chestAreas, function(area) {
        return area.contains(this.x, this.y);
      });

    if (area) area.addEntity(self);
  },

  respawn() {
    

    /**
     * Some entities are static (only spawned once during an event)
     * Meanwhile, other entities act as an illusion to another entity,
     * so the resawning script is handled elsewhere.
     */

    if (!this.static || this.respawnDelay === -1) return;

    setTimeout(function() {
      if (this.respawnCallback) this.respawnCallback();
    }, this.respawnDelay);
  },

  getState() {
    var self = this,
      base = this.super();

    base.hitPoints = this.hitPoints;
    base.maxHitPoints = this.maxHitPoints;
    base.attackRange = this.attackRange;
    base.level = this.level;

    return base;
  },

  resetPosition() {
    

    this.setPosition(this.spawnLocation[0], this.spawnLocation[1]);
  },

  onRespawn(callback) {
    this.respawnCallback = callback;
  },

  onMove(callback) {
    this.moveCallback = callback;
  },

  onReturn(callback) {
    this.returnCallback = callback;
  },

  onRefresh(callback) {
    this.refreshCallback = callback;
  },

  onDeath(callback) {
    this.deathCallback = callback;
  },

  move(x, y) {
    

    this.setPosition(x, y);

    if (this.moveCallback) this.moveCallback(self);
  }
});
