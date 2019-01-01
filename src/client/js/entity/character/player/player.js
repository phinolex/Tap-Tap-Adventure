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
      

      this._super(-1, Modules.Types.Player);

      this.username = "";
      this.password = "";
      this.email = "";

      this.avatar = null;

      this.rights = 0;
      this.wanted = false;
      this.experience = -1;
      this.level = -1;
      this.pvpKills = -1;
      this.pvpDeaths = -1;

      this.hitPoints = -1;
      this.maxHitPoints = -1;
      this.mana = -1;
      this.maxMana = -1;

      this.prevX = 0;
      this.prevY = 0;

      this.direction = null;
      this.pvp = false;

      this.moveLeft = false;
      this.moveRight = false;
      this.moveUp = false;
      this.moveDown = false;
      this.disableAction = false;

      this.loadEquipment();
    },

    load(data) {
      

      this.setId(data.instance);
      this.setGridPosition(data.x, data.y);
      this.setPointsData(data.hitPoints, data.mana);

      this.username = data.username;
      this.experience = data.experience;
      this.level = data.level;

      this.lastLogin = data.lastLogin;
      this.pvpKills = data.pvpKills;
      this.pvpDeaths = data.pvpDeaths;

      this.type = "player";
    },

    loadHandler(game) {
      

      /**
       * This is for other player characters
       */

      this.handler.setGame(game);
      this.handler.load();
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
      

      this.armour = null;
      this.weapon = null;
      this.pendant = null;
      this.ring = null;
      this.boots = null;
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
      

      this.username = name;
      this.name = name;
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

      this.setHitPoints(hitPoints);
      this.setMana(mana);

      this.setMaxHitPoints(maxHitPoints);
      this.setMaxMana(maxMana);
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
          if (!this.armour)
            this.armour = new Armour(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else this.armour.update(name, string, count, ability, abilityLevel);

          if (this.updateArmourCallback) this.updateArmourCallback(string);

          break;

        case Modules.Equipment.Weapon:
          if (!this.weapon)
            this.weapon = new Weapon(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else this.weapon.update(name, string, count, ability, abilityLevel);

          this.weapon.ranged = string.includes("bow");

          break;

        case Modules.Equipment.Pendant:
          if (!this.pendant)
            this.pendant = new Pendant(
              name,
              string,
              count,
              ability,
              abilityLevel
            );
          else this.pendant.update(name, string, count, ability, abilityLevel);

          break;

        case Modules.Equipment.Ring:
          if (!this.ring)
            this.ring = new Ring(name, string, count, ability, abilityLevel);
          else this.ring.update(name, string, count, ability, abilityLevel);

          break;

        case Modules.Equipment.Boots:
          if (!this.boots)
            this.boots = new Boots(name, string, count, ability, abilityLevel);
          else this.boots.update(name, string, count, ability, abilityLevel);

          break;
      }
    },

    unequip(type) {
      

      switch (type) {
        case "armour":
          this.armour.update("Cloth Armour", "clotharmor", 1, -1, -1);
          break;

        case "weapon":
          this.weapon.update(null, null, -1, -1, -1);
          break;

        case "pendant":
          this.pendant.update(null, null, -1, -1, -1);
          break;

        case "ring":
          this.ring.update(null, null, -1, -1, -1);
          break;

        case "boots":
          this.boots.update(null, null, -1, -1, -1);
          break;
      }
    },

    tempBlink() {
      

      this.blink(90);

      if (!this.tempBlinkTimeout)
        this.tempBlinkTimeout = setTimeout(function() {
          this.stopBlinking();
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
