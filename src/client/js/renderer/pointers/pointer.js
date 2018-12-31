define(function() {
  return Class.extend({
    init(id, element, type) {
      var self = this;

      self.id = id;
      self.element = element;
      self.type = type;

      self.blinkInterval = null;
      self.visible = true;

      self.x = -1;
      self.y = -1;

      self.load();
    },

    load() {
      var self = this;

      self.blinkInterval = setInterval(function() {
        if (self.visible) self.hide();
        else self.show();

        self.visible = !self.visible;
      }, 600);
    },

    destroy() {
      var self = this;

      clearInterval(self.blinkInterval);
      self.element.remove();
    },

    setPosition(x, y) {
      var self = this;

      self.x = x;
      self.y = y;
    },

    show() {
      this.element.css("display", "block");
    },

    hide() {
      this.element.css("display", "none");
    }
  });
});
