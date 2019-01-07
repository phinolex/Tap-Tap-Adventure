var Combat from "../../js/game/entity/character/combat/combat"),
  Utils from "../../js/util/utils"),
  _ from "underscore");

export default class SkeletonKing = Combat.extend({
  /**
   * First of its kind, the Skeleton King will spawn 4 minions.
   * Two sorcerers on (x + 1, y + 1) & (x - 1, y + 1)
   *
   * And two death knights on (x + 1, y - 1) & (x - 1, y - 1)
   */

  constructor(character) {
    

    this.super(character);

    character.spawnDistance = 10;

    this.lastSpawn = 0;

    this.minions = [];

    character.onDeath(function() {
      this.reset();
    });
  },

  reset() {
    

    this.lastSpawn = 0;

    var listCopy = this.minions.slice();

    for (var i = 0; i < listCopy.length; i += 1) this.world.kill(listCopy[i]);
  },

  hit(character, target, hitInfo) {
    

    if (this.isAttacked()) this.beginMinionAttack();

    if (this.canSpawn()) this.spawnMinions();

    this.super(character, target, hitInfo);
  },

  spawnMinions() {
    var 
      x = this.character.x,
      y = this.character.y;

    this.lastSpawn = new Date().getTime();

    if (!this.colliding(x + 2, y - 2))
      this.minions.push(this.world.spawnMob(17, x + 2, y + 2));

    if (!this.colliding(x - 2, y - 2))
      this.minions.push(this.world.spawnMob(17, x - 2, y + 2));

    if (!this.colliding(x + 1, y + 1))
      this.minions.push(this.world.spawnMob(11, x + 1, y - 1));

    if (!this.colliding(x - 1, y + 1))
      this.minions.push(this.world.spawnMob(11, x - 1, y - 1));

    _.each(this.minions, function(minion) {
      minion.onDeath(function() {
        if (this.isLast()) this.lastSpawn = new Date().getTime();

        this.minions.splice(this.minions.indexOf(minion), 1);
      });

      if (this.isAttacked()) this.beginMinionAttack();
    });
  },

  beginMinionAttack() {
    

    if (!this.hasMinions()) return;

    _.each(this.minions, function(minion) {
      var randomTarget = this.getRandomTarget();

      if (!minion.hasTarget() && randomTarget)
        minion.combat.begin(randomTarget);
    });
  },

  getRandomTarget() {
    

    if (this.isAttacked()) {
      var keys = Object.keys(this.attackers),
        randomAttacker = this.attackers[keys[Utils.randomInt(0, keys.length)]];

      if (randomAttacker) return randomAttacker;
    }

    if (this.character.hasTarget()) return this.character.target;

    return null;
  },

  hasMinions() {
    return this.minions.length > 0;
  },

  isLast() {
    return this.minions.length === 1;
  },

  canSpawn() {
    return (
      new Date().getTime() - this.lastSpawn > 25000 &&
      !this.hasMinions() &&
      this.isAttacked()
    );
  }
});
