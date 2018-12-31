/* global Modules, log, _ */

/**
 * Player
 * @class
 * @return {Character}
 */
define([
  "../character",
  "./equipment/armour",
  "./equipment/weapon",
  "./equipment/pendant",
  "./equipment/boots",
  "./equipment/ring"
], function(Character, Armour, Weapon, Pendant, Boots, Ring) {
  return Character.extend({
    constructor() {
      var self = this;

      self._super(-1, Modules.Types.Player);

      self.username = "";
      self.password = "";
      self.email = "";

      self.avatar = null;

      self.rights = 0;
      self.wanted = false;
      self.experience = -1;
      self.level = -1;
      self.pvpKills = -1;
      self.pvpDeaths = -1;

      self.hitPoints = -1;
      self.maxHitPoints = -1;
      self.mana = -1;
      self.maxMana = -1;

      self.prevX = 0;
      self.prevY = 0;

      self.direction = null;
      self.pvp = false;

      self.moveLeft = false;
      self.moveRight = false;
      self.moveUp = false;
      self.moveDown = false;
      self.disableAction = false;

      self.loadEquipment();
    },

    load(data) {
      var self = this;

      self.setId(data.instance);
      self.setGridPosition(data.x, data.y);
      self.setPointsData(data.hitPoints, data.mana);

      self.username = data.username;
      self.experience = data.experience;
      self.level = data.level;

      self.lastLogin = data.lastLogin;
      self.pvpKills = data.pvpKills;
      self.pvpDeaths = data.pvpDeaths;

      self.type = "player";
    },

    loadHandler(game) {
      var self = this;

      /**
       * This is for other player characters
       */

      self.handler.setGame(game);
      self.handler.load();
    },

    hasKeyboardMovement() {
      return this.moveLeft || this.moveRight || this.moveUp || this.moveDown;
    },

    stop(force) {
      this._super(force);
    },

    setId(id) {
      this.id = id;
    },

    idle() {
      this._super();
    },

    loadEquipment() {
      var self = this;

      self.armour = null;
      self.weapon = null;
      self.pendant = null;
      self.ring = null;
      self.boots = null;
    },

    isRanged() {
      return this.weapon && this.weapon.ranged;
    },

    follow(character) {
      this._super(character);
    },

    go(x, y, forced) {
      this._super(x, y, forced);
    },

    hasWeapon() {
      return this.weapon ? this.weapon.exists() : false;
    },

    performAction(orientation, action) {
      this._super(orientation, action);
    },

    setName(name) {
      var self = this;

      self.username = name;
      self.name = name;
    },

    setSprite(sprite) {
      this._super(sprite);
    },

    getSpriteName() {
      return this.armour ? this.armour.string : "clotharmor";
    },

    setGridPosition(x, y) {
      this._super(x, y);
    },

    setHitPoints(hitPoints) {
      this._super(hitPoints);
    },

    setMaxHitPoints(maxHitPoints) {
      this._super(maxHitPoints);
    },

    setMana(mana) {
      this.mana = mana;
    },

    setMaxMana(maxMana) {
      this.maxMana = maxMana;
    },

    clearHealthBar() {
      this._super();
    },

    getX() {
      return this.gridX;
    },

    getY() {
      return this.gridY;
    },

    setPointsData(hitPointsData, manaData) {
      var self = this,
        hitPoints = hitPointsData.shift(),
        maxHitPoints = hitPointsData.shift(),
        mana = manaData.shift(),
        maxMana = manaData.shift();

      self.setHitPoints(hitPoints);
      self.setMana(mana);

      self.setMaxHitPoints(maxHitPoints);
      self.setMaxMana(maxMana);
    },

    setEquipment(type, info) {
      var self = this,
        name = info.shift(),
        string = info.shift(),
        count = info.shift(),
        ability = info.shift(),
        abilityLevel = info.shift();

      switch (type) {
        case Modules.Equipment.Armour:
          if (!self.armour)
            self.armour = new Armour(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else self.armour.update(name, string, count, ability, abilityLevel);

          if (self.updateArmourCallback) self.updateArmourCallback(string);

          break;

        case Modules.Equipment.Weapon:
          if (!self.weapon)
            self.weapon = new Weapon(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else self.weapon.update(name, string, count, ability, abilityLevel);

          self.weapon.ranged = string.includes("bow");

          break;

        case Modules.Equipment.Pendant:
          if (!self.pendant)
            self.pendant = new Pendant(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else self.pendant.update(name, string, count, ability, abilityLevel);

          break;

        case Modules.Equipment.Ring:
          if (!self.ring)
            self.ring = new Ring(name, string, count, ability, abilityLevel);
          else self.ring.update(name, string, count, ability, abilityLevel);

          break;

        case Modules.Equipment.Boots:
          if (!self.boots)
            self.boots = new Boots(name, string, count, ability, abilityLevel);
          else self.boots.update(name, string, count, ability, abilityLevel);

          break;
      }
    },

    unequip(type) {
      var self = this;

      switch (type) {
        case "armour":
          self.armour.update("Cloth Armour", "clotharmor", 1, -1, -1);
          break;

        case "weapon":
          self.weapon.update(null, null, -1, -1, -1);
          break;

        case "pendant":
          self.pendant.update(null, null, -1, -1, -1);
          break;

        case "ring":
          self.ring.update(null, null, -1, -1, -1);
          break;

        case "boots":
          self.boots.update(null, null, -1, -1, -1);
          break;
      }
    },

    tempBlink() {
      var self = this;

      self.blink(90);

      if (!self.tempBlinkTimeout)
        self.tempBlinkTimeout = setTimeout(function() {
          self.stopBlinking();
        }, 500);
    },

    getDistance(entity) {
      return this._super(entity);
    },

    onUpdateArmour(callback) {
      this.updateArmourCallback = callback;
    }
  });
});
