
define(function() {

    var InfoManager = Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;
            self.infos = {};
            self.destroyQueue = [];
        },

        addDamageInfo: function(value, x, y, type, duration) {
            var self = this,
                time = self.game.currentTime,
                id = time + '' + Math.abs(value) + '' + x + '' + y,
                info = new HoveringInfo(id, value, x, y, duration ? duration : 1000, type);

            info.onDestroy(function(id) {
                self.destroyQueue.push(id);
            });

            self.infos[id] = info;
        },

        forEachInfo: function(callback) {
            var self = this;

            _.each(self.infos, function(info, id) {
                callback(info);
            });
        },

        update: function(time) {
            var self = this;

            self.forEachInfo(function(info) {
                info.update(time);
            });

            _.each(self.destroyQueue, function(id) {
                delete self.infos[id];
            });

            self.destroyQueue = [];
        }

    });

    var damageInfoColors = {
        'received': {
            fill: 'rgb(255, 50, 50)',
            stroke: 'rgb(255, 180, 180)'
        },

        'inflicted': {
            fill: 'white',
            stroke: '#373737'
        },

        'healed': {
            fill: 'rgb(80, 255, 80)',
            stroke: 'rgb(50, 120, 50)'
        },

        'health': {
            fill: 'white',
            stroke: '#373737'
        },

        'exp': {
            fill: 'rgb(80, 80, 255)',
            stroke: 'rgb(50, 50, 255)'
        },

        'poison': {
            fill: 'rgb(66, 183, 77)',
            stroke: 'rgb(50, 120 , 50)'
        }
    };

    var HoveringInfo = Class.extend({
        DURATION: 1000,

        init: function(id, value, x, y, duration, type) {
            var self = this;

            self.id = id;
            self.value = value;
            self.x = x;
            self.y = y;
            self.duration = duration;
            self.type = type;

            self.opacity = 1.0;
            self.lastTime = 0;
            self.speed = 100;

            self.fillColor = damageInfoColors[type].fill;
            self.strokeColor = damageInfoColors[type].stroke;
        },

        isTimeToAnimate: function(time) {
            return (time - this.lastTime) > this.speed;
        },

        update: function(time) {
            var self = this;

            if (self.isTimeToAnimate(time)) {
                self.lastTime = time;
                self.tick();
            }
        },

        tick: function() {
            var self = this;

            if (self.type !== 'health')
                this.y -= 1;

            self.opacity -= 70 / self.duration;

            if (self.opacity < 0)
                self.destroy();
        },

        destroy: function() {
            if (this.destroy_callback)
                this.destroy_callback(this.id);
        },

        onDestroy: function(callback) {
            this.destroy_callback = callback;
        }
    });

    return InfoManager;
});
