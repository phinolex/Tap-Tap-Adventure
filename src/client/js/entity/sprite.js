/* global log, _ */

define(["./animation"], function(Animation) {
  return Class.extend({
    init(sprite, scale) {
      var self = this;

      this.sprite = sprite;
      this.scale = scale;

      this.id = sprite.id;

      this.loaded = false;

      this.offsetX = 0;
      this.offsetY = 0;
      this.offsetAngle = 0;

      this.whiteSprite = {
        loaded: false
      };

      this.loadSprite();
    },

    load() {
      var self = this;

      this.image = new Image();
      this.image.crossOrigin = "Anonymous";
      this.image.src = this.filepath;

      this.image.onload = function() {
        this.loaded = true;

        if (this.onLoadCallback) this.onLoadCallback();
      };
    },

    loadSprite() {
      var self = this,
        sprite = this.sprite;

      this.filepath = "img/" + this.scale + "/" + this.id + ".png";
      this.animationData = sprite.animations;

      this.width = sprite.width;
      this.height = sprite.height;

      this.offsetX = sprite.offsetX !== undefined ? sprite.offsetX : -16;
      this.offsetY = sprite.offsetY !== undefined ? sprite.offsetY : -16;
      this.offfsetAngle =
        sprite.offsetAngle !== undefined ? sprite.offsetAngle : 0;
    },

    update(newScale) {
      var self = this;

      this.scale = newScale;

      this.loadSprite();
      this.load();
    },

    createAnimations() {
      var self = this,
        animations = {};

      for (var name in this.animationData) {
        if (this.animationData.hasOwnProperty(name)) {
          var a = this.animationData[name];

          animations[name] = new Animation(
            name,
            a.length,
            a.row,
            this.width,
            this.height
          );
        }
      }

      return animations;
    },

    /**
     * This is when an entity gets hit, they turn red then white.
     */

    createHurtSprite() {
      var self = this;

      if (!this.loaded) this.load();

      if (this.whiteSprite.loaded) return;

      var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        spriteData,
        data;

      canvas.width = this.image.width;
      canvas.height = this.image.height;

      context.drawImage(this.image, 0, 0, this.image.width, this.image.height);

      try {
        spriteData = context.getImageData(
          0,
          0,
          this.image.width,
          this.image.height
        );
        data = spriteData.data;

        for (var i = 0; i < data.length; i += 4) {
          data[i] = 255;
          data[i + 1] = data[i + 2] = 75;
        }

        spriteData.data = data;

        context.putImageData(spriteData, 0, 0);

        this.whiteSprite = {
          image: canvas,
          loaded: true,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          width: this.width,
          height: this.height
        };
      } catch (e) {}
    },

    getHurtSprite() {
      var self = this;

      try {
        if (!this.loaded) this.load();

        this.createHurtSprite();

        return this.whiteSprite;
      } catch (e) {}
    },

    onLoad(callback) {
      this.onLoadCallback = callback;
    }
  });
});
