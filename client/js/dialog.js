define(function() {
    var Dialog = Class.extend({
        init: function(game, id) {
            var self = this;

            self.game = game;
            self.body = $(id);
            self.visible = false;
        },

        show: function() {
            var self = this;

            if (self.showHandler)
                self.showHandler(self);
            
            self.visible = true;
            self.body.css('display', 'block');
        },

        hide: function() {
            var self = this;

            self.visible = false;

            self.body.css('display', 'none');

            if (self.hideHandler)
                self.hideHandler(self);
        },

        onShow: function(handler) {
            this.showHandler = handler;
        },

        onHide: function(handler) {
            this.hideHandler = handler;
        }
    });

    return Dialog;
});