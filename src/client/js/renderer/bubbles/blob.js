define(["../../utils/timer"], function(Timer) {
  return Class.extend({
    init(id, time, element, duration) {
      var self = this;

      this.id = id;
      this.time = time;
      this.element = element;
      this.duration = duration || 5000;

      this.timer = new Timer(this.time, this.duration);
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
