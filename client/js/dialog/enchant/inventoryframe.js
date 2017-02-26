/**
 * Created by flavius on 2017-02-25.
 */
define(['jquery', './frameitem'], function($, FrameItem) {
    
    var InventoryFrame = Class.extend({
        init: function(enchantDialog) {
            var self = this;
            
            self.enchantDialog = enchantDialog;
            self.selectedItem = null;
            self.items = [];
            
            self.basket = $('#enchantDialogBasket');
            self.enchantButton = $('#enchantDialogEnchantButton');
            
            self.goldBackground = $('#enchantDialogGoldBackground');
            self.goldIcon = $('#enchantDialogGoldBody');
            self.goldNumber = $('#enchantDialogGoldNumber');

            self.game = self.enchantDialog.game;

            self.updateScale();
            self.loadCSSData();

            for (var i = 0; i < 18; i++)
                self.items.push(new FrameItem(self, i));
        },
        
        loadCSSData: function() {
            var self = this;
            
            self.enchantButton.html('Enchant');

            self.enchantButton.click(function(event) {
                if (self.selectedItem) {
                    var enchantPrice = ItemTypes.getEnchantPrice(self.selectedItem.itemName, self.selectedItem.enchantLevel),
                        enchantString = "The cost is: " + enchantPrice + " to upgrade to: " + (self.selectedItem.enchantLevel + 1) + " enchantment.";

                    self.enchantDialog.confirm(enchantString, function(accepted) {
                        if (accepted) {
                            self.game.client.sendStoreEnchant(self.selectedItem.getIndex() + 6);
                            self.remove();
                        }
                    });
                }
            });

            self.basket.click(function(event) {
                self.remove();
                self.load();
                self.goldNumber.html('')
            });
        },

        load: function() {
            var self = this;

            self.basket.css({
                'position': 'absolute',
                'left': (44 * self.scale) + 'px',
                'top': (125 * self.scale) + 'px',
                'width': (16 * self.scale) + 'px',
                'height': (15 * self.scale) + 'px',
                'background-position': '0px '+ (-2 * self.scale)+ 'px'
            });

            self.enchantButton.css({
                'position': 'absolute',
                'left': (65 * self.scale) + 'px',
                'top': (125 * self.scale) + 'px',
                'width': (30 * self.scale) + 'px',
                'height': (19 * self.scale) + 'px',
                'margin-left': (4 * self.scale) + 'px',
                'margin-top': (5 * self.scale) + 'px',
                'color': '#fff',
                'font-size': (6 * self.scale) + 'px'
            });

            self.goldBackground.css({
                'position': 'absolute',
                'left': (15 * self.scale) + 'px',
                'top': (125 * self.scale) + 'px',
                'width': (16 * self.scale) + 'px',
                'height': (15 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/storedialogsheet.png")',
                'background-position': '-' + (300 * self.scale) + 'px -' + (172 * self.scale) + 'px'
            });

            self.goldIcon.css({
                'position': 'absolute',
                'width': (16 * self.scale) + 'px',
                'height': (15 * self.scale) + 'px',
                'background-image': 'url("img/' + self.scale + '/item-gold.png")'
            });

            self.goldNumber.css({
                'position': 'absolute',
                'margin-top': (15 * self.scale) + 'px',
                'color': '#000',
                'text-align': 'center'
            });

            for (var i = 0; i < 18; i++)
                self.items[i].load();

        },

        open: function() {
            var self = this;

            self.remove();

            for (var i = 0; i < self.items.length; i++)
                self.items[i].remove();

            self.goldNumber.html('');
            self.inventoryHandler = self.game.inventoryHandler;

            for (var inventoryNumber = 0; inventoryNumber < self.inventoryHandler.maxInventoryNumber - 6; inventoryNumber++) {
                var item = self.inventoryHandler.inventories[inventoryNumber + 6];

                if (item && item.kind) {
                    if (ItemTypes.isWeapon(item.kind) || Item.isArcherWeapon(item.kind))
                        self.items[inventoryNumber].setData(item.kind, item.count, item.skillKind, item.skillLevel);
                    else if (ItemTypes.isArmor(item.kind) || ItemTypes.isArcherArmor(item.kind))
                        self.items[inventoryNumber].setData(item.kind, item.count, item.skillKind, item.skillLevel);
                    else if (ItemTypes.isGold(item.kind))
                        self.goldNumber.html(item.count);
                }
            }
        },
        
        select: function(item) {
            var self = this;

            if (self.selectedItem)
                self.items[self.selectedItem.getIndex()].revert();

            self.selectedItem = item;
            item.remove();

            self.setBasket(item.getName() ? 'url("img/' + self.scale + '/item-' + item.getName() + '.png")' : '');
            self.setBasketAttribute('title', item.getDetails());
            self.enchantButton.css('cursor', 'pointer');

            self.goldNumber.html(ItemTypes.getEnchantPrice(self.selectedItem.getName(), self.selectedItem.getEnchantLevel()));
        },

        remove: function() {
            var self = this;

            if (self.selectedItem) {
                self.items[self.selectedItem.getIndex()].revert();

                self.setBasket('');
                self.setBasketAttribute('');
                self.enchantButton.css('cursor', 'default');

                self.selectedItem = null;
            }
        },

        setBasket: function(string) {
            this.basket.css('background-image', string);
        },

        setBasketAttribute: function(string) {
            this.basket.attr('title', string);
        },

        updateScale: function() {
            this.scale = this.game.getScaleFactor();
        }
        
    });
    
    return InventoryFrame;
});