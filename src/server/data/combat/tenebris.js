var Combat = require("../../js/game/entity/character/combat/combat"),
  Messages = require("../../js/network/messages"),
  Packets = require("../../js/network/packets"),
  Utils = require("../../js/util/utils");

module.exports = Tenebris = Combat.extend({
  init(character) {
    var self = this;

    this._super(character);

    character.spawnDistance = 24;

    this.illusions = [];
    this.firstIllusionKilled = false;

    this.lastIllusion = new Date().getTime();
    this.respawnDelay = 95000;

    character.onDeath(function() {
      if (this.isIllusion())
        if (!this.firstIllusionKilled) this.spawnTenbris();
        else {
          this.removeIllusions();

          this.reset();
        }
    });

    if (!this.isIllusion()) this.forceTalk("Who dares summon Tenebris!");
  },

  reset() {
    var self = this;

    this.illusions = [];
    this.firstIllusionKilled = false;

    setTimeout(function() {
      var offset = Utils.positionOffset(4);

      this.world.spawnMob(105, 48 + offset.x, 338 + offset.y);
    }, this.respawnDelay);
  },

  hit(attacker, target, hitInfo) {
    var self = this;

    if (this.isAttacked()) this.beginIllusionAttack();

    if (this.canSpawn()) this.spawnIllusions();

    this._super(attacker, target, hitInfo);
  },

  spawnTenbris() {
    var self = this;

    this.world.spawnMob(104, this.character.x, this.character.y);
  },

  spawnIllusions() {
    var self = this;

    this.illusions.push(
      this.world.spawnMob(105, this.character.x + 1, this.character.y + 1)
    );
    this.illusions.push(
      this.world.spawnMob(105, this.character.x - 1, this.character.y + 1)
    );

    _.each(this.illusions, function(illusion) {
      illusion.onDeath(function() {
        if (this.isLast()) this.lastIllusion = new Date().getTime();

        this.illusions.splice(this.illusions.indexOf(illusion), 1);
      });

      if (this.isAttacked()) this.beginIllusionAttack();
    });

    this.character.setPosition(62, 343);
    this.world.pushToGroup(
      this.character.group,
      new Messages.Teleport(
        this.character.instance,
        this.character.x,
        this.character.y,
        true
      )
    );
  },

  removeIllusions() {
    var self = this;

    this.lastIllusion = 0;

    var listCopy = this.illusions.slice();

    for (var i = 0; i < listCopy.length; i++) this.world.kill(listCopy[i]);
  },

  beginIllusionAttack() {
    var self = this;

    if (!this.hasIllusions()) return;

    _.each(this.illusions, function(illusion) {
      var target = this.getRandomTarget();

      if (!illusion.hasTarget && target) illusion.combat.begin(target);
    });
  },

  getRandomTarget() {
    var self = this;

    if (this.isAttacked()) {
      var keys = Object.keys(this.attackers),
        randomAttacker = this.attackers[keys[Utils.randomInt(0, keys.length)]];

      if (randomAttacker) return randomAttacker;
    }

    if (this.character.hasTarget()) return this.character.target;

    return null;
  },

  forceTalk(instance, message) {
    var self = this;

    if (!this.world) return;

    this.world.pushToAdjacentGroups(
      this.character.target.group,
      new Messages.NPC(Packets.NPCOpcode.Talk, {
        id: instance,
        text: message,
        nonNPC: true
      })
    );
  },

  isLast() {
    return this.illusions.length === 1;
  },

  canSpawn() {
    return (
      !this.isIllusion() &&
      !this.hasIllusions &&
      new Date().getTime() - this.lastIllusion === 45000 &&
      Utils.randomInt(0, 4) === 2
    );
  },

  isIllusion() {
    return this.character.id === 105;
  },

  hasIllusions() {
    return this.illusions.length > 0;
  }
});
