define(['../../tabbook', './pages/armorpage', './pages/potionpage', './pages/weaponpage', '../pagenavigator'], function(TabBook, ArmorPage, PotionPage, WeaponPage, PageNavigator) {

    var StoreFrame = TabBook.extend({

        init: function(shopDialog) {
            var self = this;

            self._super('#storeDialogStore');

            self.shopDialog = shopDialog;
            self.scale = self.shopDialog.scale;
            self.game = self.shopDialog.game;
            self.frameType = 'storeDialog';

            self.loadPages();
            self.loadNavigator();
        },

        load: function() {
            var self = this;

            self.potionPage.load();
            self.armorPage.load();
            self.weaponPage.load();
            self.pageNavigator.loadStore();
        },

        loadPages: function() {
            var self = this;

            self.potionPage = new PotionPage(self.game);
            self.armorPage = new ArmorPage(self.game);
            self.weaponPage = new WeaponPage(self.game);

            self.add(self.potionPage);
            self.add(self.armorPage);
            self.add(self.weaponPage);
        },

        loadNavigator: function() {
            var self = this;

            self.pageNavigator = new PageNavigator(self.game, self.frameType);

            self.pageNavigator.onChange(function(sender) {
                var pageActive = self.getActivePage();

                if (pageActive && self.shopDialog.visible)
                    pageActive.setIndex(sender.getIndex() - 1);
            });
        },

        setIndex: function(index) {
            var self = this;

            if (!self.shopDialog.visible)
                return;

            self._super(index);

            var pageActive = self.getActivePage();

            if (pageActive) {
                if (pageActive.getPageCount() > 0) {
                    self.pageNavigator.setCount(pageActive.getPageCount());
                    self.pageNavigator.setIndex(pageActive.getIndex() + 1);
                    self.pageNavigator.setVisible(true);
                } else
                    self.pageNavigator.setVisible(false);
            }
        },

        open: function() {
            var self = this;

            for (var i = 0; i < self.pages.length; i++)
                self.pages[i].open();

            self.setIndex(0);
        }
    });

    return StoreFrame;
});