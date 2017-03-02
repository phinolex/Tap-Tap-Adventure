/**
 * Created by flavius on 2017-02-25.
 */
define(['../../../../tabpage'], function(TabPage) {

    var SettingsPage = TabPage.extend({
        init: function(frame) {
            var self = this;

            self._super('#characterDialogFrameSettingsPage');

            self.frame = frame;
            self.game = self.frame.game;

            /**
             * What settings we need for the game...
             */

            self.centeredMode = true;
            self.musicVolume = 100;
            self.sfxVolume = 100;
            self.showPlayerNames = true;
            self.showPlayerLevels = false;
            self.disableAnimatedTiles = false;

        },

        load: function() {
            var self = this,
                storage = self.getStorage();

        },

        saveSettings: function() {
            var self = this,
                storage = self.getStorage();


        },

        getStorage: function() {
            return this.game.app.storage;
        }
    });

    return SettingsPage;
});