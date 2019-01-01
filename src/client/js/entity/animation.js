define(function() {
  return Class.extend({
    /**
     * Ripped from BrowserQuest's client
     */

    init(name, length, row, width, height) {
      var self = this;

      this.name = name;
      this.length = length;
      this.row = row;
      this.width = width;
      this.height = height;

      this.reset();
    },

    tick() {
      var self = this,
        i = this.currentFrame.index;

      i = i < this.length - 1 ? i + 1 : 0;

      if (this.count > 0 && i === 0) {
        this.count -= 1;

        if (this.count === 0) {
          this.currentFrame.index = 0;
          this.endCountCallback();
          return;
        }
      }

      this.currentFrame.x = this.width * i;
      this.currentFrame.y = this.height * this.row;

      this.currentFrame.index = i;
    },

    update(time) {
      var self = this;

      if (this.lastTime === 0 && this.name.substr(0, 3) === "atk")
        this.lastTime = time;

      if (this.readyToAnimate(time)) {
        this.lastTime = time;
        this.tick();

        return true;
      } else return false;
    },

    setCount(count, onEndCount) {
      var self = this;

      this.count = count;
      this.endCountCallback = onEndCount;
    },

    setSpeed(speed) {
      this.speed = speed;
    },

    setRow(row) {
      this.row = row;
    },

    readyToAnimate(time) {
      return time - this.lastTime > this.speed;
    },

    reset() {
      var self = this;

      this.lastTime = 0;
      this.currentFrame = {
        index: 0,
        x: 0,
        y: this.row * this.height
      };
    }
  });
});
