var Combat = require("../../js/game/entity/character/combat/combat"),
  Packets = require("../../js/network/packets"),
  Messages = require("../../js/network/messages"),
  Utils = require("../../js/util/utils"),
  _ = require("underscore");

module.exports = QueenAnt = Combat.extend({
  /**
   * This is where bosses start to get a bit more complex.
   * The queen ant will do an AoE attack after staggering for five seconds,
   * indicating to the players. If players are caught up in this, the terror
   * explosion sprite is drawn above them.
   */

  constructor(character) {
    

    character.spawnDistance = 18;

    this.super(character);

    this.lastActionThreshold = 10000; //Due to the nature of the AoE attack

    this.character = character;

    this.aoeTimeout = null;

    this.aoeCountdown = 5;
    this.aoeRadius = 2;
    this.lastAoE = 0;

    this.minionCount = 7;
    this.lastSpawn = 0;
    this.minions = [];

    this.frozen = false;

    this.character.onDeath(function() {
      /**
       * This is to prevent the boss from dealing
       * any powerful AoE attack after dying.
       */

      this.lastSpawn = 0;

      if (this.aoeTimeout) {
        clearTimeout(this.aoeTimeout);
        this.aoeTimeout = null;
      }

      var listCopy = this.minions.slice();

      for (var i = 0; i < listCopy.length; i++) this.world.kill(listCopy[i]);
    });

    this.character.onReturn(function() {
      clearTimeout(this.aoeTimeout);
      this.aoeTimeout = null;
    });
  },

  begin(attacker) {
    

    this.resetAoE();

    this.super(attacker);
  },

  hit(attacker, target, hitInfo) {
    

    if (this.frozen) return;

    if (this.canCastAoE()) {
      this.doAoE();
      return;
    }

    if (this.canSpawn()) this.spawnMinions();

    if (this.isAttacked()) this.beginMinionAttack();

    this.super(attacker, target, hitInfo);
  },

  doAoE() {
    

    /**
     * The reason this function does not use its superclass
     * representation is because of the setTimeout function
     * which does not allow us to call super().
     */

    this.resetAoE();

    this.lastHit = this.getTime();

    this.pushFreeze(true);

    this.pushCountdown(this.aoeCountdown);

    this.aoeTimeout = setTimeout(function() {
      this.dealAoE(this.aoeRadius, true);

      this.pushFreeze(false);
    }, 5000);
  },

  spawnMinions() {
    

    this.lastSpawn = new Date().getTime();

    for (var i = 0; i < this.minionCount; i++)
      this.minions.push(
        this.world.spawnMob(13, this.character.x, this.character.y)
      );

    _.each(this.minions, function(minion) {
      minion.aggressive = true;
      minion.spawnDistance = 12;

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

  resetAoE() {
    this.lastAoE = new Date().getTime();
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

  pushFreeze(state) {
    

    this.character.frozen = state;
    this.character.stunned = state;
  },

  pushCountdown(count) {
    

    this.world.pushToAdjacentGroups(
      this.character.group,
      new Messages.NPC(Packets.NPCOpcode.Countdown, {
        id: this.character.instance,
        countdown: count
      })
    );
  },

  getMinions() {
    var self = this,
      grids = this.world.getGrids();
  },

  isLast() {
    return this.minions.length === 1;
  },

  hasMinions() {
    return this.minions.length > 0;
  },

  canCastAoE() {
    return new Date().getTime() - this.lastAoE > 30000;
  },

  canSpawn() {
    return (
      new Date().getTime() - this.lastSpawn > 45000 &&
      !this.hasMinions() &&
      this.isAttacked()
    );
  }
});
