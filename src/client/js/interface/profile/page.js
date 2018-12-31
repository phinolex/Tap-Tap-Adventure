/* global log */

define(["jquery"], function($) {
  return Class.extend({
    init(element) {
      var self = this;

      self.body = $(element);

      self.loaded = false;
    },

    show() {
      this.body.fadeIn("slow");
    },

    hide() {
      this.body.fadeOut("slow");
    },

    isVisible() {
      return this.body.css("display") === "block";
    },

    load() {
      log.info("Uninitialized.");
    },

    resize() {
      log.info("Uninitialized.");
    },

    update() {
      log.info("Uninitialized.");
    },

    getImageFormat(scale, name) {
      if (!name || name === "null") return "";

      return 'url("img/' + scale + "/item-" + name + '.png")';
    }
  });
});
