define(['jquery', '../../utils/timer'], function($, Timer) {

    var Bubble = Class.extend({
        init: function(id, element, time) {
            var self = this;

            self.id = id;
            self.element = element;
            self.timer = new Timer(5000, time);
        },

        isOver: function(time) {
            return this.timer.isOver(time);
        },

        destroy: function() {
            $(this.element).remove();
        },

        reset: function(time) {
            this.timer.lastTime = time;
        }
    });

    return Bubble;
});