define(["../../utils/timer"], function(Timer) {
  return Class.extend({
    init(id, time, element, duration) {
      var self = this;

      self.id = id;
      self.time = time;
      self.element = element;
      self.duration = duration || 5000;

      self.timer = new Timer(self.time, self.duration);
    },

    setClickable() {
      this.element.css("pointer-events", "auto");
    },

    isOver(time) {
      return this.timer.isOver(time);
    },

    reset(time) {
      this.timer.time = time;
    },

    destroy() {
      $(this.element).remove();
    }
  });
});
