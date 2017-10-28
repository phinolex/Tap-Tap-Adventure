define(['jquery'], function($) {

    return Class.extend({

        init: function(game) {
            var self = this;

            self.game = game;

            self.mapFrame = $('#mapFrame');
            self.warp = $('#warpButton');
            self.close = $('#closeMapFrame');

            self.load();
        },

        load: function() {
            var self = this;

            self.warp.click(function() {
                self.toggle();
            });

            self.close.click(function() {
                self.hide();
            });

        },

        toggle: function() {
            var self = this;

            /**
             * Just so it fades out nicely.
             */

            if (self.isVisible())
                self.hide();
            else
                self.display();
        },

        isVisible: function() {
            return this.mapFrame.css('display') === 'block';
        },

        display: function() {
            this.mapFrame.fadeIn('slow');
        },

        hide: function() {
            this.mapFrame.fadeOut('fast');
        }

    });

});