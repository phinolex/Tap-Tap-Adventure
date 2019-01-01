define(["../character"], function(Character) {
  return Character.extend({
    init(id, kind) {
      var self = this;

      this._super(id, kind);

      this.index = 0;

      this.type = "npc";
    },

    talk(messages) {
      var self = this,
        count = messages.length,
        message;

      if (this.index > count) this.index = 0;

      if (this.index < count) message = messages[this.index];

      this.index++;

      return message;
    },

    idle() {
      this._super();
    },

    setSprite(sprite) {
      this._super(sprite);
    },

    setName(name) {
      this._super(name);
    },

    setGridPosition(x, y) {
      this._super(x, y);
    }
  });
});
