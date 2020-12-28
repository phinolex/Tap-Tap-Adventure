import Character from '../character';
import Armour from './equipment/armour';
import Weapon from './equipment/weapon';
import Pendant from './equipment/pendant';
import Boots from './equipment/boots';
import Ring from './equipment/ring';
import Modules from '../../../utils/modules';

/**
 * A member's playable {@link Character} in the game
 * @class
 */
export default class Player extends Character {
  /**
   * Default constructor
   * id the ID of the {@link Entity} = -1
   * kind the kind of {@link Entity} this is (sprite name) = Modules.Types.Player
   */
  constructor() {
    super(-1, Modules.Types.Player);


    /**
     * The ID of the player in the database
     * @type {Number}
     */
    this.id = null;

    /**
     * The name of the player (not sure why we have this and the username???)
     * @type {String}
     */
    this.name = null;

    /**
     * Username of the player
     * @type {String}
     */
    this.username = '';

    /**
     * Password of the player
     * @type {String}
     */
    this.password = '';

    /**
     * Email of the player
     * @type {String}
     */
    this.email = '';

    /**
     * Avatar image for the player
     * @type {String}?
     */
    this.avatar = null;

    /**
     * Set the permissions of the player and it will change
     * the color of their name in the game to reflect their
     * permissions level
     * 0 = regular player, 1 = moderator, 2 = admin
     * @type {Number}
     */
    this.rights = 0;

    /**
     * Changes the player's name to red
     * @type {Boolean}
     */
    this.wanted = false;

    /**
     * How much experience the player has
     * @type {Number}
     */
    this.experience = -1;

    /**
     * What level the player is at
     * @type {Number}
     */
    this.level = -1;

    /**
     * How many player versus player kills they have
     * @type {Number}
     */
    this.pvpKills = -1;

    /**
     * How many player versus player deaths they have
     * @type {Number}
     */
    this.pvpDeaths = -1;

    /**
     * How many hit points they have (current health)
     * @type {Number}
     */
    this.hitPoints = -1;

    /**
     * Maximum hit points (full health)
     * @type {Number}
     */
    this.maxHitPoints = -1;

    /**
     * How much mana they have (current mana)
     * @type {Number}
     */
    this.mana = -1;

    /**
     * Maximum mana (full mana)
     * @type {Number}
     */
    this.maxMana = -1;

    /**
     * Previous X position
     * @type {Number}
     */
    this.prevX = 0;

    /**
     * Previous Y position
     * @type {Number}
     */
    this.prevY = 0;

    /**
     * Direction they are currently facing
     * @type {[type]}
     */
    this.direction = null;

    /**
     * The player they are fighting/is fighting them
     * @type {Boolean}
     */
    this.pvp = false;

    /**
     * Moving to the left (key board movement)
     * @type {Boolean}
     */
    this.moveLeft = false;

    /**
     * Moving to the right (key board movement)
     * @type {Boolean}
     */
    this.moveRight = false;

    /**
     * Moving up (key board movement)
     * @type {Boolean}
     */
    this.moveUp = false;

    /**
     * Moving down (key board movement)
     * @type {Boolean}
     */
    this.moveDown = false;

    /**
     * Disable the player actions
     * @type {Boolean}
     */
    this.disableAction = false;

    /**
     * Set their default armor
     * @type {Armour}
     */
    this.armour = null;

    /**
     * Set their default weapon
     * @type {Weapon}
     */
    this.weapon = null;

    /**
     * Set their default pendant
     * @type {Pendant}
     */
    this.pendant = null;

    /**
     * Set their default ring
     * @type {Ring}
     */
    this.ring = null;

    /**
     * Set their default boots
     * @type {Boots}
     */
    this.boots = null;

    /**
     * Last login datetime
     * @type {String}
     */
    this.lastLogin = null;

    /**
     * The type of character this is
     * @type {String}
     */
    this.type = 'player';

    /**
     * Used to set a temporary blink timeout
     * @type {Function}
     */
    this.tempBlinkTimeout = null;

    /**
     * Used to set a callback when armor is updated
     * @type {Function}
     */
    this.updateArmourCallback = null;
  }

  /**
   * Loads in all the data for the specific player
   * @param  {{
   *  instance: Object,
   *  x: Number,
   *  y: Number,
   *  hitPoints: Number,
   *  mana: Number,
   *  username: String,
   *  experience: Number,
   *  level: Number,
   *  lastLogin: String,
   *  pvpKills: Number,
   *  pvpDeaths: Number
   *  }} data all the information about the player from the database
   */
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
  }

  /**
   * Sets an instance of the game on the player then loads it
   * @param {Game} game an instance of the game
   * @TODO is this nesting necessary? Seems redundant
   * if you can access the global game state on the window?
   * Check into possibly removing these duplicate references if possible
   */
  loadHandler(game) {
    this.handler.setGame(game);
    this.handler.load();
  }

  /**
   * Check whether or not they have keyboard movement
   * @return {Boolean} check for any keyboard flags
   */
  hasKeyboardMovement() {
    return this.moveLeft || this.moveRight || this.moveUp || this.moveDown;
  }

  /**
   * Set the ID of the player
   * @param {Number} id player id
   */
  setId(id) {
    this.id = id;
  }

  /**
   * Returns true if they have a ranged weapon
   * @return {Boolean}
   */
  isRanged() {
    return this.weapon && this.weapon.ranged;
  }

  /**
   * Returns true if they have a weapon
   * @return {Boolean}
   */
  hasWeapon() {
    return this.weapon ? this.weapon.exists() : false;
  }

  /**
   * Sets the name and username for the player
   * @param {String} name name and username
   * @TODO figure out why we have 2 fields with the same value?
   */
  setName(name) {
    this.username = name;
    this.name = name;
  }

  /**
   * Returns the name of the sprite for the player given the armor
   * they currently have equipped
   * @return {String} sprite name to draw for the player
   */
  getSpriteName() {
    return this.armour
      ? this.armour.name
      : 'clotharmor';
  }

  /**
   * Set the mana for the player
   * @param {Number} mana how much mana they currently have
   */
  setMana(mana) {
    this.mana = mana;
  }

  /**
   * Override the maximum mana for the player
   * @param {Number} maxMana the maximum amount of mana they can have
   */
  setMaxMana(maxMana) {
    this.maxMana = maxMana;
  }

  /**
   * Get the player's X position on the grid
   * @return {Number} X coordinate
   */
  getX() {
    return this.gridX;
  }

  /**
   * Get the player's Y position on the grid
   * @return {Number} Y coordinate
   */
  getY() {
    return this.gridY;
  }

  /**
   * Set hit point and mana values for the player
   * @param {Array} hitPointsData hit point data
   * @param {Array} manaData mana data
   */
  setPointsData(hitPointsData, manaData) {
    // extract hit point data from the server message
    const hitPoints = hitPointsData.shift();
    const maxHitPoints = hitPointsData.shift();
    this.setHitPoints(hitPoints);
    this.setMaxHitPoints(maxHitPoints);

    // extract mana data from the server message
    const mana = manaData.shift();
    const maxMana = manaData.shift();
    this.setMana(mana);
    this.setMaxMana(maxMana);
  }

  /**
   * Set the player's equipment values
   * @param {Number} type the type of equipment we're loading values for
   * @param {Array} info information about the eqipment from the server
   */
  setEquipment(type, info) {
    // extract the equipment data from the server message
    const name = info.shift();
    const string = info.shift();
    const count = info.shift();
    const ability = info.shift();
    const abilityLevel = info.shift();

    // apply it to the correct piece of equipment depending
    // on the type of equipment this is
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
        } else {
          this.armour.update(name, string, count, ability, abilityLevel);
        }

        if (this.updateArmourCallback) {
          this.updateArmourCallback(string);
        }
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
        } else {
          this.weapon.update(name, string, count, ability, abilityLevel);
        }

        this.weapon.ranged = string && string.includes('bow');
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
        } else {
          this.pendant.update(name, string, count, ability, abilityLevel);
        }
        break;
      case Modules.Equipment.Ring:
        if (!this.ring) {
          this.ring = new Ring(name, string, count, ability, abilityLevel);
        } else {
          this.ring.update(name, string, count, ability, abilityLevel);
        }
        break;
      case Modules.Equipment.Boots:
        if (!this.boots) {
          this.boots = new Boots(name, string, count, ability, abilityLevel);
        } else {
          this.boots.update(name, string, count, ability, abilityLevel);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Remove a piece of equipment
   * @param  {String} type [description]
   * @return {[type]}      [description]
   * @TODO update this to use the numbers rather than the strings so we can
   * reference the constants in the switch case like we do for equipping
   */
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

  /**
   * Temporarily have the player blink
   */
  tempBlink() {
    this.blink(90);

    if (!this.tempBlinkTimeout) {
      this.tempBlinkTimeout = setTimeout(() => {
        this.stopBlinking();
      }, 500);
    }
  }

  /**
   * Trigger an update armour callback
   * @param  {Function} callback armor callback function
   */
  onUpdateArmour(callback) {
    this.updateArmourCallback = callback;
  }
}
