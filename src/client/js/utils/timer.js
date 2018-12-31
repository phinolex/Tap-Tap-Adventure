define(function() {
  return Class.extend({
    init(start, duration) {
      var self = this;

      self.time = start;
      self.duration = duration;
    },

    isOver(time) {
      var self = this,
        over = false;

      if (time - self.time > self.duration) {
        over = true;
        self.time = time;
      }

      return over;
    }
  });
});
