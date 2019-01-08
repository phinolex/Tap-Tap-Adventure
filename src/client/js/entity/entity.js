import EntityHandler from './entityhandler';

/**
 * Initialize a new entity
 * @class
 */
export default class Entity {
  /**
   * Initialize a new entity
   * @class
   * @param {Number} id
   * @param {String} kind
   */
  constructor(id, kind) {
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
   * @param {Number} x
   * @param {Number} y
   * @param {Boolean} ignoreDiagonals if true, will ignore diagonal directions (optional)
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

    if (this.dirtyCallback) this.dirtyCallback();
  }

  fadeIn(time) {
    this.fading = true;
    this.fadingTime = time;
  }

  blink(speed) {
    this.blinking = setInterval(() => {
      this.toggleVisibility();
    }, speed);
  }

  stopBlinking() {
    if (this.blinking) clearInterval(this.blinking);

    this.setVisible(true);
  }

  setName(name) {
    this.name = name;
  }

  setSprite(sprite) {
    if (!sprite || (this.sprite && this.sprite.name === sprite.name)) return;

    if (!sprite.loaded) sprite.load();

    sprite.name = sprite.id; // eslint-disable-line

    this.sprite = sprite;

    this.normalSprite = this.sprite;
    this.hurtSprite = sprite.getHurtSprite();
    this.animations = sprite.createAnimations();
    this.spriteLoaded = true;

    if (this.readyCallback) this.readyCallback();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setGridPosition(x, y) {
    this.gridX = x;
    this.gridY = y;

    this.setPosition(x * 16, y * 16);
  }

  setAnimation(name, speed, count, onEndCount) {
    if (
      !this.spriteLoaded
      || (this.currentAnimation && this.currentAnimation.name === name)
    ) return;

    const anim = this.getAnimationByName(name);

    if (!anim) return;

    this.currentAnimation = anim;

    if (name.substr(0, 3) === 'atk') this.currentAnimation.reset();

    this.currentAnimation.setSpeed(speed);

    this.currentAnimation.setCount(
      count || 0,
      onEndCount
      || (() => {
        this.idle();
      }),
    );
  }

  setCountdown(count) {
    this.counter = count;

    this.countdownTime = new Date().getTime();

    this.hasCounter = true;
  }

  setVisible(visible) {
    this.visible = visible;
  }

  hasWeapon() {
    return this.weapon;
  }

  getDistance(entity) {
    const x = Math.abs(this.gridX - entity.gridX);


    const y = Math.abs(this.gridY - entity.gridY);

    return x > y ? x : y;
  }

  getCoordDistance(toX, toY) {
    const x = Math.abs(this.gridX - toX);


    const y = Math.abs(this.gridY - toY);

    return x > y ? x : y;
  }

  inAttackRadius(entity) {
    return (
      entity
      && this.getDistance(entity) < 2
      && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)
    );
  }

  inExtraAttackRadius(entity) {
    return (
      entity
      && this.getDistance(entity) < 3
      && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)
    );
  }

  getAnimationByName(name) {
    if (name in this.animations) return this.animations[name];

    return null;
  }

  getSprite() {
    return this.sprite.name;
  }

  toggleVisibility() {
    this.setVisible(!this.visible);
  }

  isVisible() {
    return this.visible;
  }

  hasShadow() {
    return this.shadow;
  }

  hasPath() {
    return this.path;
  }

  onReady(callback) {
    this.readyCallback = callback;
  }

  onDirty(callback) {
    this.dirtyCallback = callback;
  }
}
