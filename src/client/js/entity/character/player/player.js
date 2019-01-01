import Character from '../character';
import Armour from './equipment/armour';
import Weapon from './equipment/weapon';
import Pendant from './equipment/pendant';
import Boots from './equipment/boots';
import Ring from './equipment/ring';
import Modules from '../../../utils/modules';

/**
 * Player
 * @class
 * @return {Character}
 */
export default class Player extends Character {
  constructor() {
    super(-1, Modules.Types.Player);

    this.username = '';
    this.password = '';
    this.email = '';

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
  }

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

    this.type = 'player';
  }

  loadHandler(game) {
    /**
     * This is for other player characters
     */

    this.handler.setGame(game);
    this.handler.load();
  }

  hasKeyboardMovement() {
    return this.moveLeft || this.moveRight || this.moveUp || this.moveDown;
  }

  stop(force) {
    this.super(force);
  }

  setId(id) {
    this.id = id;
  }

  idle() {
    this.super();
  }

  loadEquipment() {
    this.armour = null;
    this.weapon = null;
    this.pendant = null;
    this.ring = null;
    this.boots = null;
  }

  isRanged() {
    return this.weapon && this.weapon.ranged;
  }

  follow(character) {
    this.super(character);
  }

  go(x, y, forced) {
    this.super(x, y, forced);
  }

  hasWeapon() {
    return this.weapon ? this.weapon.exists() : false;
  }

  performAction(orientation, action) {
    this.super(orientation, action);
  }

  setName(name) {
    this.username = name;
    this.name = name;
  }

  setSprite(sprite) {
    this.super(sprite);
  }

  getSpriteName() {
    return this.armour ? this.armour.string : 'clotharmor';
  }

  setGridPosition(x, y) {
    this.super(x, y);
  }

  setHitPoints(hitPoints) {
    this.super(hitPoints);
  }

  setMaxHitPoints(maxHitPoints) {
    this.super(maxHitPoints);
  }

  setMana(mana) {
    this.mana = mana;
  }

  setMaxMana(maxMana) {
    this.maxMana = maxMana;
  }

  clearHealthBar() {
    this.super();
  }

  getX() {
    return this.gridX;
  }

  getY() {
    return this.gridY;
  }

  setPointsData(hitPointsData, manaData) {
    const hitPoints = hitPointsData.shift();
    const maxHitPoints = hitPointsData.shift();
    const mana = manaData.shift();
    const maxMana = manaData.shift();

    this.setHitPoints(hitPoints);
    this.setMana(mana);

    this.setMaxHitPoints(maxHitPoints);
    this.setMaxMana(maxMana);
  }

  setEquipment(type, info) {
    const name = info.shift();


    const string = info.shift();


    const count = info.shift();


    const ability = info.shift();


    const abilityLevel = info.shift();

    switch (type) {
      case Modules.Equipment.Armour:
        if (!this.armour) {
          this.armour = new Armour(
            name,
            string,
            count,
            ability,
            abilityLevel,
          );
        } else this.armour.update(name, string, count, ability, abilityLevel);

        if (this.updateArmourCallback) this.updateArmourCallback(string);

        break;

      case Modules.Equipment.Weapon:
        if (!this.weapon) {
          this.weapon = new Weapon(
            name,
            string,
            count,
            ability,
            abilityLevel,
          );
        } else this.weapon.update(name, string, count, ability, abilityLevel);

        this.weapon.ranged = string.includes('bow');

        break;

      case Modules.Equipment.Pendant:
        if (!this.pendant) {
          this.pendant = new Pendant(
            name,
            string,
            count,
            ability,
            abilityLevel,
          );
        } else this.pendant.update(name, string, count, ability, abilityLevel);

        break;

      case Modules.Equipment.Ring:
        if (!this.ring) this.ring = new Ring(name, string, count, ability, abilityLevel);
        else this.ring.update(name, string, count, ability, abilityLevel);

        break;

      case Modules.Equipment.Boots:
        if (!this.boots) this.boots = new Boots(name, string, count, ability, abilityLevel);
        else this.boots.update(name, string, count, ability, abilityLevel);

        break;
      default:
        break;
    }
  }

  unequip(type) {
    switch (type) {
      case 'armour':
        this.armour.update('Cloth Armour', 'clotharmor', 1, -1, -1);
        break;

      case 'weapon':
        this.weapon.update(null, null, -1, -1, -1);
        break;

      case 'pendant':
        this.pendant.update(null, null, -1, -1, -1);
        break;

      case 'ring':
        this.ring.update(null, null, -1, -1, -1);
        break;

      case 'boots':
        this.boots.update(null, null, -1, -1, -1);
        break;
      default:
        break;
    }
  }

  tempBlink() {
    this.blink(90);

    if (!this.tempBlinkTimeout) {
      this.tempBlinkTimeout = setTimeout(() => {
        this.stopBlinking();
      }, 500);
    }
  }

  getDistance(entity) {
    return this.super(entity);
  }

  onUpdateArmour(callback) {
    this.updateArmourCallback = callback;
  }
}
