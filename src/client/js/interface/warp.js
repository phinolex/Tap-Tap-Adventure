/* global _, Modules */

define(["jquery"], function($) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;

      this.mapFrame = $("#mapFrame");
      this.warp = $("#hud-world");
      this.close = $("#closeMapFrame");

      this.warpCount = 0;

      this.load();
    },

    load() {
      var self = this,
        scale = this.getScale();

      this.warp.click(function() {
        this.toggle();
      });

      this.close.click(function() {
        this.hide();
      });

      for (var i = 1; i < 7; i++) {
        var warp = this.mapFrame.find("#warp" + i);

        if (warp)
          warp.click(function(event) {
            this.hide();

            this.game.socket.send(Packets.Warp, [
              event.currentTarget.id.substring(4)
            ]);
          });
      }
    },

    toggle() {
      var self = this;

      /**
       * Just so it fades out nicely.
       */

      if (this.isVisible()) this.hide();
      else this.display();
    },

    getScale() {
      return this.game.getScaleFactor();
    },

    isVisible() {
      return this.mapFrame.css("display") === "block";
    },

    display() {
      this.mapFrame.fadeIn("slow");
    },

    hide() {
      this.mapFrame.fadeOut("fast");
    }
  });
});
