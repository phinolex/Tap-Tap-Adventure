/**
 * Created by flavius on 2017-02-24.
 */
define(['../../../dialog', './frame'], function(Dialog, Frame) {
    var CharacterDialog = Dialog.extend({
        init: function(game) {
            var self = this;

            self._super(game, '#characterDialog');
            self.game = game;
            self.frame = new Frame(self);
        },

        show: function(data) {
            var self = this;

            self.frame.open(data);

            if (self.button)
                self.button.down();

            self._super();
        },

        hide: function() {
            var self = this;

            self._super();

            if (self.button)
                self.button.up();
        }
    });

    return CharacterDialog;
});