/**
 * Created by flavius on 2017-03-02.
 */
define(['jquery'], function($) {
    var ClassPopupMenu = Class.extend({
        init: function(game) {
            var self = this;

            self.game = game;
            self.switcher = $('#classSwitcher')
            self.switchButton = $('#classSwitcherButton');
            self.dropdown = $('#selectClassSwitch');

            self.switchButton.click(function(event) {
                self.game.player.skillHandler.hideShortcuts();
                self.game.characterDialog.frame.pages[1].clear();
                self.game.client.sendClassSwitch(self.dropdown.val());
                self.close();
                self.show = false;
            });
        },

        open: function() {
            this.switcher.css('display', 'block');
        },

        close: function() {
            this.switcher.css('display', 'none');
        }
    });

    return ClassPopupMenu;
});