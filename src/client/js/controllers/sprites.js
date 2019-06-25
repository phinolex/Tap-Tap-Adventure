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
    this.renderer = renderer;
    this.sprites = {};
    this.sparksAnimation = null;

    $.getJSON('assets/data/sprites.json', (json) => {
      this.load(json);
    });

    this.loadAnimations();
  }

  load(spriteData) {
    _.each(spriteData, (sprite) => {
      this.sprites[sprite.id] = new Sprite(
        sprite,
        this.renderer.drawingScale,
      );
    });

    log.info('Finished loading sprite data...');

    if (this.loadedSpritesCallback) {
      this.loadedSpritesCallback();
    }
  }

  loadAnimations() {
    this.sparksAnimation = new Animation('idle_down', 6, 0, 16, 16);
    this.sparksAnimation.setSpeed(120);
  }

  updateSprites() {
    _.each(this.sprites, (sprite) => {
      sprite.update(this.renderer.getDrawingScale());
    });

    log.info(`Updated sprites to: ${this.renderer.getDrawingScale()}`);
  }

  onLoadedSprites(callback) {
    this.loadedSpritesCallback = callback;
  }
}
