/* global log, _ */

define(["../entity/sprite", "../entity/animation"], function(
  Sprite,
  Animation
) {
  /**
   * Class responsible for loading all the necessary sprites from the JSON.
   */

  return Class.extend({
    init(renderer) {
      var self = this;

      this.renderer = renderer;

      this.sprites = {};

      this.sparksAnimation = null;

      $.getJSON("data/sprites.json", function(json) {
        this.load(json);
      });

      this.loadAnimations();
    },

    load(spriteData) {
      var self = this;

      _.each(spriteData, function(sprite) {
        this.sprites[sprite.id] = new Sprite(
          sprite,
          this.renderer.drawingScale
        );
      });

      log.info("Finished loading sprite data...");

      if (this.loadedSpritesCallback) this.loadedSpritesCallback();
    },

    loadAnimations() {
      var self = this;

      this.sparksAnimation = new Animation("idle_down", 6, 0, 16, 16);
      this.sparksAnimation.setSpeed(120);
    },

    updateSprites() {
      var self = this;

      _.each(this.sprites, function(sprite) {
        sprite.update(this.renderer.getDrawingScale());
      });

      log.info("Updated sprites to: " + this.renderer.getDrawingScale());
    },

    onLoadedSprites(callback) {
      this.loadedSpritesCallback = callback;
    }
  });
});
