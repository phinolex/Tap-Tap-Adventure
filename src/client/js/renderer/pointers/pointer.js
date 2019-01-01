define(function() {
  return Class.extend({
    init(id, element, type) {
      var self = this;

      this.id = id;
      this.element = element;
      this.type = type;

      this.blinkInterval = null;
      this.visible = true;

      this.x = -1;
      this.y = -1;

      this.load();
    },

    load() {
      var self = this;

      this.blinkInterval = setInterval(function() {
        if (this.visible) this.hide();
        else this.show();

        this.visible = !this.visible;
      }, 600);
    },

    destroy() {
      var self = this;

      clearInterval(this.blinkInterval);
      this.element.remove();
    },

    setPosition(x, y) {
      var self = this;

      this.x = x;
      this.y = y;
    },

    show() {
      this.element.css("display", "block");
    },

    hide() {
      this.element.css("display", "none");
    }
  });
});
