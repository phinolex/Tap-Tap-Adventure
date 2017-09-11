define(function() {

    return Class.extend({

        init: function(id, index, length, speed) {
            var self = this;

            self.initialId = id;

            self.id = id;
            self.index = index;
            self.length = length;
            self.speed = speed;

            self.lastTime = 0;

            self.loaded = false;
        },

        setPosition: function(position) {
            this.x = position.x;
            this.y = position.y;
        },

        tick: function() {
            this.id = ((this.id - this.initialId) < this.length - 1) ? this.id + 1 : this.initialId;
        },

        animate: function(time) {
            var self = this;

            if ((time - self.lastTime) > self.speed) {
                self.tick();
                self.lastTime = time;
                return true;
            } else
                return false;
        },

        getPosition: function() {
            var self = this;

            if (self.x && self.y)
                return [self.x, self.y];

            return [-1, -1];
        }

    });

});