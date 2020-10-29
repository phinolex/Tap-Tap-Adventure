import Modules from '../utils/modules';

/**
 * Keeps track of the player's current direction
 * @class
 */
export default class Zone {
  /**
   * Default constructor
   * @param {Game} game instance of the game
   */
  constructor(game) {
    /**
     * Instance of the game
     * @type {Game}
     */
    this.game = game;

    /**
     * Instance of the game renderer
     * @type {Renderer}
     */
    this.renderer = game.renderer;

    /**
     * Instance of the game camera
     * @type {Camera}
     */
    this.camera = game.camera;

    /**
     * Instance of the game input
     * @type {Input}
     */
    this.input = game.input;

    /**
     * IThe direction
     * @type {Orientation}
     */
    this.direction = null;
  }

  /**
   * Reset the direction
   */
  reset() {
    this.direction = null;
  }

  /**
   * Set the direction to up
   */
  setUp() {
    this.direction = Modules.Orientation.Up;
  }

  /**
   * Set the direction to down
   */
  setDown() {
    this.direction = Modules.Orientation.Down;
  }

  /**
   * Set the direction to right
   */
  setRight() {
    this.direction = Modules.Orientation.Right;
  }

  /**
   * Set the direction to right
   */
  setLeft() {
    this.direction = Modules.Orientation.Left;
  }

  /**
   * Return the current direction
   * @return {Orientation} the direction for the zone
   */
  getDirection() {
    return this.direction;
  }
}
