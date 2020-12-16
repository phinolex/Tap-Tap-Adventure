import EntityHandler from './entityhandler';
import log from '../lib/log';

/**
 * Initialize a new entity:
 * - {@link Character}
 *   - {@link Mob}
 *   - {@link Npc}
 *   - {@link Player}
 * - {@link Chest}
 * - {@link Item}
 * - {@link Projectile}
 * @class
 * @example const myEntity = new Entity(1, 'player');
 */
export default class Entity {
  /**
   * Constructor to initialize a new entity
   * @param {Number} id the entity id
   * @param {String} kind the type of entity this is
   */
  constructor(id, kind) {
    log.debug('Entity - constructor()', id, kind);
    this.id = id;
    this.kind = kind;

    this.x = 0;
    this.y = 0;
    this.gridX = 0;
    this.gridY = 0;

    this.name = '';

    this.sprite = null;
    this.spriteFlipX = false;
    this.spriteFlipY = false;

    this.animations = null;
    this.currentAnimation = null;

    this.shadowOffsetY = 0;
    this.hidden = false;

    this.spriteLoaded = false;
    this.visible = true;
    this.fading = false;
    this.handler = new EntityHandler(this);

    this.angled = false;
    this.angle = 0;

    this.critical = false;
    this.stunned = false;
    this.terror = false;

    this.nonPathable = false;
    this.hasCounter = false;

    this.countdownTime = 0;
    this.counter = 0;
    this.shadow = false;
    this.path = false;

    this.renderingData = {
      scale: -1,
      angle: 0,
    };

    this.loadDirty();
  }

  /**
   * Checks to see if the x,y coordinate is adjacent to the
   * entity's current position
   *
   * @param {Number} x coordinate
   * @param {Number} y coordinate
   * @param {Boolean} ignoreDiagonals if true, will ignore diagonal
   * directions, defaults to false (optional)
   * @return {Boolean}
   */
  isPositionAdjacent(x, y, ignoreDiagonals = false) {
    // north west - diagonal
    if (!ignoreDiagonals && x - 1 === this.gridX && y + 1 === this.gridY) {
      return true;
    }

    // north
    if (x === this.gridX && y + 1 === this.gridY) {
      return true;
    }

    // north east - diagonal
    if (!ignoreDiagonals && x + 1 === this.gridX && y + 1 === this.gridY) {
      return true;
    }

    // west
    if (x - 1 === this.gridX && y === this.gridY) {
      return true;
    }

    // east
    if (x + 1 === this.gridX && y === this.gridY) {
      return true;
    }

    // south west - diagonal
    if (!ignoreDiagonals && x - 1 === this.gridX && y - 1 === this.gridY) {
      return true;
    }

    // south
    if (x === this.gridX && y - 1 === this.gridY) {
      return true;
    }

    // south west - diagonal
    if (!ignoreDiagonals && x - 1 === this.gridX && y - 1 === this.gridY) {
      return true;
    }

    return false;
  }

  /**
   * This is important for when the client is
   * on a mobile screen. So the sprite has to be
   * handled differently.
   */
  loadDirty() {
    this.dirty = true;

    if (this.dirtyCallback) {
      this.dirtyCallback();
    }
  }

  /**
   * Tell this to fade in given the duration
   * @param {Number} time the amount of time to fade in
   */
  fadeIn(time) {
    this.fading = true;
    this.fadingTime = time;
  }

  /**
   * Tell this entity to start blinking
   * @param  {Number} speed the interval time between blinks
   */
  blink(speed) {
    this.blinking = setInterval(() => {
      this.toggleVisibility();
    }, speed);
  }

  /**
   * Tell the entity to stop blinking and force it to be visible
   */
  stopBlinking() {
    if (this.blinking) {
      clearInterval(this.blinking);
    }

    this.setVisible(true);
  }

  /**
   * Set the entity's name
   * @param {String} name the name of this entity
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Set the sprite for this entity
   * @param {Sprite} sprite the sprite for this entity
   */
  setSprite(sprite) {
    if (!sprite || (this.sprite && this.sprite.name === sprite.name)) {
      return;
    }

    if (!sprite.loaded) {
      sprite.load();
    }

    sprite.name = sprite.id; // eslint-disable-line

    this.sprite = sprite;

    this.normalSprite = this.sprite;
    this.hurtSprite = sprite.getHurtSprite();
    this.animations = sprite.createAnimations();
    this.spriteLoaded = true;

    if (this.readyCallback) {
      this.readyCallback();
    }
  }

  /**
   * Set the x,y position for the entity
   * @param {Number} x the x position on the screen
   * @param {[type]} y the y position on the screen
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set the x,y position of the entity on the tile grid
   * @param {Number} x the gridX
   * @param {Number} y the gridY
   */
  setGridPosition(x, y) {
    this.gridX = x;
    this.gridY = y;

    this.setPosition(x * 16, y * 16);
  }

  /**
   * Set the animation on this entity
   * @param {String} name       the name of the animation
   * @param {Number} speed      the animation speed
   * @param {Number} count      how many times to play the animation
   * @param {Number} onEndCount callback to trigger when the animation
   * ends after count number of times
   */
  setAnimation(name, speed, count, onEndCount) {
    if (
      !this.spriteLoaded
      || (this.currentAnimation && this.currentAnimation.name === name)
    ) {
      return;
    }

    const anim = this.getAnimationByName(name);

    if (!anim) {
      return;
    }

    this.currentAnimation = anim;

    if (name.substr(0, 3) === 'atk') {
      this.currentAnimation.reset();
    }

    this.currentAnimation.setSpeed(speed);

    this.currentAnimation.setCount(
      count || 0,
      onEndCount
      || (() => {
        this.idle();
      }),
    );
  }

  /**
   * Set the count for the count down time
   * @param {Number} count sets the counter
   */
  setCountdown(count) {
    this.counter = count;
    this.countdownTime = new Date().getTime();
    this.hasCounter = true;
  }

  /**
   * Returns the instance of the weapon this entity has
   * @return {Item|Projectile} a weapon or projectile
   */
  hasWeapon() {
    return this.weapon;
  }

  /**
   * Get the distance from this entity to another entity
   * @param  {Entity} entity the entity you want to get the distance to
   * @return {Number} the furtherst x or y distance from the given entity
   */
  getDistance(entity) {
    const x = Math.abs(this.gridX - entity.gridX);
    const y = Math.abs(this.gridY - entity.gridY);
    return x > y ? x : y;
  }

  /**
   * Get the distance from this entity to the given x,y coordinates
   * @param  {Number} toX the x coordinate
   * @param  {Number} toY the y coordinate
   * @return {Number} the further x or y distance to this coordinate
   */
  getCoordDistance(toX, toY) {
    const x = Math.abs(this.gridX - toX);
    const y = Math.abs(this.gridY - toY);

    return x > y ? x : y;
  }

  /**
   * Figure out if this entity is within the attack radius of the given entity
   * @param  {Entity} entity Player|Mob|Character|NPC
   * @return {Boolean} returns true if they are within the entity's attack radius,
   * if the entity has no attack radius default to 2 grid cells
   */
  inAttackRadius(entity) {
    const attackRadius = entity.attackRadius || 2;
    return (
      entity
      && this.getDistance(entity) < attackRadius
      && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)
    );
  }

  /**
   * Figure out if this entity is within the extended attack radius of the given entity
   * @param  {Entity} entity Player|Mob|Character|NPC
   * @return {Boolean} returns true if they are within the entity's attack radius,
   * if the entity has no attack radius default to 3 grid cells
   */
  inExtraAttackRadius(entity) {
    const attackRadius = (entity.attackRadius + 1) || 3;
    return (
      entity
      && this.getDistance(entity) < attackRadius
      && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)
    );
  }

  /**
   * Look for an animtions list for this specific animation given it's name
   * @param  {String} name the name of the animation
   * @return {Animation|null} returns the animation object or null if not found
   */
  getAnimationByName(name) {
    if (name in this.animations) {
      return this.animations[name];
    }

    return null;
  }

  /**
   * Returns the name of the sprite
   * @return {String} the name of the sprite
   */
  getSprite() {
    return this.sprite.name;
  }

  /**
   * Set the visibility on this entity
   * @param {Boolean} visible true|false
   */
  setVisible(visible) {
    this.visible = visible;
  }

  /**
   * Toggle the current visibility of this entity
   */
  toggleVisibility() {
    this.setVisible(!this.visible);
  }

  /**
   * Check whether or not this entity is visible
   * @return {Boolean} returns true if visibile
   */
  isVisible() {
    return this.visible;
  }

  /**
   * Check whether or not this entity has a shadow
   * @return {Object} returns the entity's shadow
   */
  hasShadow() {
    return this.shadow;
  }

  /**
   * Check if this entity currently has a path
   * @return {Object} returns the entity's path
   */
  hasPath() {
    return this.path;
  }

  /**
   * When this entity's sprite is loaded trigger this callback
   * @param  {Function} callback the function to call when the sprite is loaded
   */
  onReady(callback) {
    this.readyCallback = callback;
  }

  /**
   * When this entity's is dirty (mobile) use this callback
   * @param {Function} callback the function to call when the sprite isDirty
   */
  onDirty(callback) {
    this.dirtyCallback = callback;
  }
}
