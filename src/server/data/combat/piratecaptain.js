var Combat = require("../../js/game/entity/character/combat/combat"),
  Utils = require("../../js/util/utils"),
  Messages = require("../../js/network/messages"),
  Modules = require("../../js/util/modules");

module.exports = PirateCaptain = Combat.extend({
  init(character) {
    var self = this;

    this._super(character);
    this.character = character;

    character.spawnDistance = 20;

    this.teleportLocations = [];

    this.lastTeleportIndex = 0;
    this.lastTeleport = 0;

    this.location = {
      x: this.character.x,
      y: this.character.y
    };

    this.load();
  },

  load() {
    var self = this,
      south = {x: 251, y: 574},
      west = {x: 243, y: 569},
      east = {x: 258, y: 568},
      north = {x: 251, y: 563};

    this.teleportLocations.push(north, south, west, east);
  },

  hit(character, target, hitInfo) {
    var self = this;
    if (this.canTeleport()) this.teleport();
    else this._super(character, target, hitInfo);
  },

  teleport() {
    var self = this,
      position = this.getRandomPosition();

    if (!position) return;

    this.stop();

    this.lastTeleport = new Date().getTime();
    this.lastTeleportIndex = position.index;

    this.character.setPosition(position.x, position.y);

    if (this.world)
      this.world.pushToGroup(
        this.character.group,
        new Messages.Teleport(
          this.character.instance,
          this.character.x,
          this.character.y,
          true
        )
      );

    this.forEachAttacker(function(attacker) {
      attacker.removeTarget();
    });

    if (this.character.hasTarget()) this.begin(this.character.target);
  },

  getRandomPosition() {
    var self = this,
      random = Utils.randomInt(0, this.teleportLocations.length - 1),
      position = this.teleportLocations[random];

    if (!position || random === this.lastTeleportIndex) return null;

    return {
      x: position.x,
      y: position.y,
      index: random
    };
  },

  canTeleport() {
    //Just randomize the teleportation for shits and giggles.
    return (
      new Date().getTime() - this.lastTeleport > 10000 &&
      Utils.randomInt(0, 4) === 2
    );
  },

  getHealthPercentage() {
    //Floor it to avoid random floats
    return Math.floor(
      (this.character.hitPoints / this.character.maxHitPoints) * 100
    );
  }
});
