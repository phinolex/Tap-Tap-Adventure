define(['jquery', './bubble'], function($, Bubble) {
    
    var BubbleManager = Class.extend({
        init: function(game, container) {
            var self = this;

            self.game = game;
            self.container = container;
            self.bubbles = {};
        },

        getBubbleById: function(id) {
            var self = this;

            if (id in self.bubbles)
                return self.bubbles[id];

            return null;
        },

        create: function(id, message, time) {
            var self = this;

            if (self.bubbles[id]) {
                self.bubbles[id].reset(time);
                $('#' + id + ' p').html(message);
            } else {
                var element = $("<div id=\""+id+"\" class=\"bubble\"><p>"+message+"</p><div class=\"thingy\"></div></div>");

                $(element).appendTo(self.container);

                self.bubbles[id] = new Bubble(id, element, time);
            }
        },

        update: function(time) {
            var self = this;

            _.each(self.bubbles, function(bubble) {
                var entity = self.game.getEntityById(bubble.id);

                if (entity)
                    self.assignBubbleTo(entity);

                if (bubble.isOver(time)) {
                    bubble.destroy();
                    delete self.bubbles[bubble.id];
                }
            });
        },

        assignBubbleTo: function(entity) {
            var self = this;

            try {
                var bubble = self.getBubbleById(entity.id);

                if(bubble) {
                    var s = self.game.renderer.scale,
                        t = 16 * s, // tile size
                        x = ((entity.x - self.game.camera.x) * s),
                        w = parseInt(bubble.element.css('width')) + 24,
                        offset = (w / 2) - (t / 2),
                        offsetY = 10,
                        y;

                    y = ((entity.y - self.game.camera.y) * s) - (t * 2) - offsetY;

                    bubble.element.css('left', x - offset + 'px');
                    bubble.element.css('top', y + 'px');
                }

            } catch (e) {
                log.info('Could not assign bubble: ' + e);
            }
        },

        clean: function() {
            var self = this;

            _.each(self.bubbles, function(bubble) {
                bubble.destroy();
            });

            self.bubbles = {};
        },

        destroyBubble: function(id) {
            var self = this,
                bubble = self.getBubbleById(id);

            if (bubble) {
                bubble.destroy();
                delete self.bubbles[id];
            }
        }
    });

    return BubbleManager;
});