import Character from '../character';

/**
 * A mobile character, some can attack, others just move
 * @class
 */
export default class Mob extends Character {
  /**
   * Default constructor
   * @param {Number} id the ID of the {@link Entity}
   * @param {Number} kind the kind of {@link Entity} this is
   */
  constructor(id, kind) {
    super(id, kind);

    /**
     * The name of the character
     * @type {String}
     */
    this.name = null;

    /**
     * How many hit points the character has
     * @type {Number}
     */
    this.hitPoints = -1; // not applicable by default

    /**
     * Maximum hit points the character has
     * @type {Number}
     */
    this.maxHitPoints = -1; // not applicable by default

    /**
     * The type of character this is
     * @type {String}
     */
    this.type = 'mob';
  }

  /**
   * Sets the name of this character
   * @param {String} name character name
   */
  setName(name) {
    this.name = name;
  }
}
