/**
 * Created by flavius on 2017-02-24.
 */
define(['../../tabbook', '../pagenavigator', './pages/statepage', './pages/skillpage'], function(TabBook, PageNavigator, StatePage, SkillPage) {

    var Frame = TabBook.extend({
        init: function(characterDialog) {
            var self = this;

            self._super('#characterDialogFrame');
            
            self.characterDialog = characterDialog;
            self.game = self.characterDialog.game;

            self.loadPages();
            self.loadNavigator();
        },

        loadPages: function() {
            var self = this;

            /**
             * Instantiate the pages we want.
             */

            self.add(new StatePage(self));
            self.add(new SkillPage(self));
        },

        loadNavigator: function() {
            var self = this;

            /**
             * This navigator handles the transition
             * between pages and their states.
             */

            self.pageNavigator = new PageNavigator(self.game, 'characterDialogFrame');
            self.pageNavigator.setCount(self.getPageCount());

            self.pageNavigator.onChange(function(sender) {
                self.setIndex(sender.getIndex() - 1);
            });
        },

        open: function() {
            var self = this;

            self.pages[0].load();
            self.pages[1].load();

            self.pageNavigator.setIndex(1);
        },

        getScale: function() {
            var self = this,
                scale;

            if (self.game.renderer) {
                scale = self.game.renderer.getScaleFactor();

                if (self.game.renderer.mobile)
                    scale = 1;

                return scale;
            }

            return -1;
        }
    });

    return Frame;
});