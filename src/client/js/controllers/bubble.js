/* global _ */

define(["jquery", "../renderer/bubbles/blob"], function($, Blob) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;
      this.bubbles = {};

      this.container = $("#bubbles");
    },

    create(id, message, time, duration) {
      var self = this;

      if (this.bubbles[id]) {
        this.bubbles[id].reset(time);
        $("#" + id + " p").html(message);
      } else {
        var element = $(
          "<div id='" +
            id +
            "' class='bubble'><p>" +
            message +
            "</p><div class='bubbleTip'></div></div>"
        );

        $(element).appendTo(this.container);

        this.bubbles[id] = new Blob(id, time, element, duration);

        return this.bubbles[id];
      }
    },

    setTo(entity) {
      var self = this;

      var bubble = this.get(entity.id);

      if (!bubble || !entity) return;

      var scale = this.game.renderer.getDrawingScale(),
        tileSize = 16 * scale,
        x = (entity.x - this.game.getCamera().x) * scale,
        width = parseInt(bubble.element.css("width")) + 24,
        offset = width / 2 - tileSize / 2,
        offsetY = 10,
        y;

      y = (entity.y - this.game.getCamera().y) * scale - tileSize * 2 - offsetY;

      bubble.element.css(
        "left",
        x - offset + (2 + this.game.renderer.scale) + "px"
      );
      bubble.element.css("top", y + "px");
    },

    update(time) {
      var self = this;

      _.each(this.bubbles, function(bubble) {
        var entity = this.game.entities.get(bubble.id);

        if (entity) this.setTo(entity);

        if (bubble.isOver(time)) {
          bubble.destroy();
          delete this.bubbles[bubble.id];
        }
      });
    },

    get(id) {
      var self = this;

      if (id in this.bubbles) return this.bubbles[id];

      return null;
    },

    clean() {
      var self = this;

      _.each(this.bubbles, function(bubble) {
        bubble.destroy();
      });

      this.bubbles = {};
    },

    destroy(id) {
      var self = this,
        bubble = this.get(id);

      if (!bubble) return;

      bubble.destroy();
      delete this.bubbles[id];
    }
  });
});
