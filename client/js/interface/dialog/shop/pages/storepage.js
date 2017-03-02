/**
 * Created by flavius on 2017-02-27.
 */
define(['../../../../tabpage', '../storerack'], function(TabPage, StoreRack) {

    var StorePage = TabPage.extend({
        init: function(id, itemType, items, game) {
            var self = this;
            
            self._super(id + 'Page', id + 'Button');
            self.itemType = itemType;
            self.racks = [];
            self.items = items;
            self.game = game;
            self.scale = self.game.getScaleFactor();
            self.index = 1;

            
            for (var i = 0; i < 6; i++)
                self.racks.push(new StoreRack(self, id + i, i, self.game));
        },

        load: function() {
            var self = this;

            for (var i = 0; i < 6; i++)
                self.racks[i].load();
        },

        reload: function() {
            var self = this,
                min = Math.min((self.index + 1) * 6, self.items.length);

            for (var i = self.index * 6; i < min; i++) {
                var rack = self.racks[i - (self.index * 6)];

                rack.setItem(self.items[i]);
                rack.setVisible(true);
            }

            for (var i2 = self.items.length; i2 < (self.index + 1) * 6; i2++)
                self.racks[i2 - (self.index * 6)].setVisible(false);
            
        },

        open: function() {
            this.setIndex(0);
        },

        getPageCount: function() {
            return Math.ceil(this.items.length / 6);
        },

        getIndex: function() {
            return this.index;
        },

        setIndex: function(index) {
            var self = this;

            self.index = index;
            self.reload();
        }
    });

    return StorePage

});