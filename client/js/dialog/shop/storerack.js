/**
 * Created by flavius on 2017-02-27.
 */
define(['../../item'], function(Item) {

    var StoreRack = Class.extend({

        init: function(storePage, id, index, game) {
            var self = this;

            self.storePage = storePage;
            self.id = id;
            self.index = index;
            self.game = game;
            self.scale = self.game.getScaleFactor();

            self.body = $(self.id);
            self.background = $(id + 'BasketBackground');
            self.basket = $(id + 'Basket');
            self.extra = $(id + 'Extra');
            self.price = $(id + 'Price');
            self.buy = $(id + 'BuyButton');
            self.item = null;

            self.loadCSSData();
            self.load();

        },

        loadCSSData: function() {
            var self = this;

            self.buy.text('Buy');

            self.buy.click(function(event) {
                self.game.client.sendStoreBuy(self.storePage.itemType, self.item.kind, 1);
            });
        },

        load: function() {
            var self = this;

            self.body.css({
                'position': 'absolute',
                'left': '0px',
                'top': '' + (self.index * (20 * self.scale)) + 'px',
                'width': '' + (134 * self.scale) + 'px',
                'height': '' + (19 * self.scale) + 'px',
                'border-radius': '' + self.scale + 'px',
                'background-color': 'rgba(150, 150, 150, 0.35)',
                'display': 'none'
            });

            self.background.css({
                'position': 'absolute',
                'left': '' + (4 * self.scale) + 'px',
                'top': '' + (2 * self.scale) + 'px',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (15 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (300 * self.scale) + 'px -' + (172 * self.scale) + 'px'
            });

            self.basket.css({
                'position': 'absolute',
                'width': '' + (16 * self.scale) + 'px',
                'height': '' + (15 * self.scale) + 'px'
            });

            self.extra.css({
                'position': 'absolute',
                'left': '' + (22 * self.scale) + 'px',
                'top': '' + (2 * self.scale) + 'px',
                'width': '' + (50 * self.scale) + 'px',
                'height': '' + (11 * self.scale) + 'px',
                'color': 'white',
                'font-size': '' + (6 * self.scale) + 'px'
            });

            self.price.css({
                'position': 'absolute',
                'left': '' + (70 * self.scale) + 'px',
                'top': '' + (4 * self.scale) + 'px',
                'width': '' + (25 * self.scale) + 'px',
                'height': '' + (11 * self.scale) + 'px',
                'line-height': '' + (11 * self.scale) + 'px',
                'color': 'white',
                'text-align': 'right'
            });

            self.buy.css({
                'position': 'absolute',
                'left': '' + (103 * self.scale) + 'px',
                'top': '' + (4 * self.scale) + 'px',
                'width': '' + (27 * self.scale) + 'px',
                'height': '' + (11 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (316 * self.scale) + 'px -' + (172 * self.scale) + 'px',
                'line-height': '' + (11 * self.scale) + 'px',
                'color': 'white',
                'text-align': 'center',
                'cursor': 'pointer'
            });

            if (self.item)
                self.setItem(self.item);
        },

        setItem: function(item) {
            var self = this;

            self.item = item;

            self.basket.css('background-image', 'url("img/' + self.scale + '/item-' + item.name + '.png")');

            var itemDescription = Item.getInfoMsgEx(item.kind, 0, 0, 0);

            self.basket.attr('title', itemDescription);
            self.extra.text((item.buyCount > 0 ? 'x' + item.buyCount : '') + ' ' + itemDescription);
            self.price.text(item.buyPrice + 'g');
        },

        isVisible: function() {
            return this.body.css('display') === 'block';
        },

        setVisible: function(visible) {
            var self = this;

            self.body.css('display', visible ? 'block' : 'none');
            self.buy.text('Buy');
        }
    });

    return StoreRack;
});