import $ from 'jquery';
import _ from 'underscore';
import Sprite from '../entity/sprite';
import Animation from '../entity/animation';
import log from '../lib/log';

/**
 * Class responsible for loading all the necessary sprites from the JSON.
 * @class
 */
export default class Sprites {
  constructor(renderer) {
    log.debug('Sprites - constructor()', renderer);

    this.renderer = renderer;
    this.sprites = {};
    this.sparksAnimation = null;

    $.getJSON('assets/data/sprites.json', (json) => {
      this.load(json);
    });

    this.loadAnimations();
  }

  load(spriteData) {
    log.debug('Sprites - load()', spriteData);

    _.each(spriteData, (sprite) => {
      this.sprites[sprite.id] = new Sprite(
        sprite,
        this.renderer.drawingScale,
      );
    });

    if (this.loadedSpritesCallback) {
      log.debug('Sprites - load() - Finished loading sprite data...');
      this.loadedSpritesCallback();
    }
  }

  loadAnimations() {
    log.debug('Sprites - loadAnimations()');
    this.sparksAnimation = new Animation('idle_down', 6, 0, 16, 16);
    this.sparksAnimation.setSpeed(120);
  }

  updateSprites() {
    log.debug('Sprites - updateSprites()', this.renderer.getDrawingScale());

    _.each(this.sprites, (sprite) => {
      sprite.update(this.renderer.getDrawingScale());
    });
  }

  onLoadedSprites(callback) {
    log.debug('Sprites - onLoadedSprites()', callback);
    this.loadedSpritesCallback = callback;
  }
}
