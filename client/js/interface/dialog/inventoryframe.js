/**
 * Created by flavius on 2017-02-25.
 */
define(['jquery', './frameitem'], function($, FrameItem) {

    /**
     * This is a rather rough sketch of OOP programming to support
     * multiple instances of the same class, though it will have to
     * be improved upon in the future for even more versatility.
     *
     * For now, it should suffice. Instances such as (isStoreDialog and isEnchantDialog)
     * should simply be handled from the parent class, depicting what the button does
     * and how it behaves.
     */

    var InventoryFrame = Class.extend({
        init: function(dialog) {
            var self = this;

            self.items = [];
            self.dialog = dialog;
            self.dialogType = self.dialog.getDialogType();
            self.selectedItem = null;
            self.game = self.dialog.game;

            if (!self.isBankDialog()) {
                self.basket = $('#' + self.dialogType + 'Basket');
                self.button = $('#' + self.getButtonType());
            }

            var dialogType = self.isBankDialog() ? self.dialogType + 'Inventory' : self.dialogType;

            self.goldBackground = $('#' + dialogType + 'GoldBackground');
            self.goldIcon = $('#' + dialogType + 'GoldBody');
            self.goldNumber = $('#' + dialogType + 'GoldNumber');

            self.updateScale();
            self.loadCSSData();

            for (var i = 0; i < self.getItemsCount(); i++)
                self.items.push(new FrameItem(self, i, self.dialogType + 'Inventory'));
        },

        loadCSSData: function() {
            var self = this;

            if (!self.isBankDialog()) {
                self.button.html(self.isStoreDialog() ? 'Sell' : 'Enchant');

                self.basket.click(function(event) {
                    self.remove();
                    self.open();
                    self.goldNumber.html('')
                });
            }

            switch (self.dialogType) {

                case 'storeDialog':

                    self.button.click(function(event) {
                        if (self.selectedItem) {
                            self.game.client.sendStoreSell(self.selectedItem.kind);
                            setTimeout(function() {
                                self.remove();
                            }, 100);
                        }
                    });

                    break;

                case 'enchantDialog':

                    self.button.click(function(event) {
                        if (self.selectedItem) {
                            var enchantPrice = ItemTypes.getEnchantPrice(self.selectedItem.getName(), self.selectedItem.enchantLevel),
                                enchantString = "The cost is: " + enchantPrice + " to upgrade to: " + (self.selectedItem.enchantLevel + 1) + " enchantment.";

                            self.dialog.confirm(enchantString, function(accepted) {
                                if (accepted) {
                                    self.game.client.sendStoreEnchant(self.selectedItem.kind);

                                    setTimeout(function() {
                                        self.remove();
                                        self.goldNumber.html('')
                                    }, 100);
                                }
                            });
                        }
                    });

                    break;
            }
        },

        load: function() {
            var self = this;

            if (!self.isBankDialog()) {
                self.basket.css({
                    'position': 'absolute',
                    'left': (44 * self.scale) + 'px',
                    'top': (125 * self.scale) + 'px',
                    'width': (16 * self.scale) + 'px',
                    'height': (15 * self.scale) + 'px',
                    'background-position': '0px '+ (-2 * self.scale)+ 'px'
                });

                self.button.css({
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
            }

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

            for (var i = 0; i < self.getItemsCount(); i++)
                self.items[i].load();
        },

        open: function() {
            var self = this;

            if (self.isStoreDialog())
                self.button.html('Sell');

            self.remove();

            for (var i = 0; i < self.items.length; i++)
                self.items[i].remove();

            self.goldNumber.html('');
            self.inventoryHandler = self.game.inventoryHandler;

            var frameIndex = 0;

            for (var inventoryId = 0; inventoryId < self.inventoryHandler.maxInventoryNumber; inventoryId++) {
                /**
                 * Get the item at the respective index and handle it from thereon.
                 */

                var item = self.inventoryHandler.inventories[inventoryId];

                if (item && item.kind) {

                    if (self.isEnchantDialog() && (ItemTypes.isObject(item.kind)))
                        continue;

                    self.items[frameIndex].setData(item.kind, item.count, item.skillKind, item.skillLevel);
                    if (ItemTypes.isGold(item.kind))
                        self.goldNumber.html(item.count);

                    frameIndex++;
                }
            }
        },

        select: function(item) {
            var self = this;

            if (self.isBankDialog()) {
                if (self.game.bankHandler.isBankFull())
                    return;

                self.game.client.sendBankStore(item.kind);
                item.remove();

            } else {
                if (self.selectedItem)
                    self.items[self.selectedItem.getIndex()].revert();

                self.selectedItem = item;
                item.remove();

                self.setBasket(item.getName() ? 'url("img/' + self.scale + '/item-' + item.getName() + '.png")' : '');
                self.setBasketAttribute('title', item.getDetails());
                self.button.css('cursor', 'pointer');

                self.setCost('');

                if (!ItemTypes.isConsumableItem(self.selectedItem.kind) && !ItemTypes.isGold(self.selectedItem.kind)) {
                    if (self.isEnchantDialog())
                        self.setCost(ItemTypes.getEnchantPrice(self.selectedItem.getName(), self.selectedItem.getEnchantLevel()));
                    else
                        self.setCost(ItemTypes.getSellPrice(self.selectedItem.getName()))
                }
            }
        },

        remove: function() {
            var self = this;

            if (self.selectedItem) {
                self.items[self.selectedItem.getIndex()].revert();

                self.setBasket('');
                self.setBasketAttribute('');
                self.button.css('cursor', 'default');

                self.selectedItem = null;
            }
        },

        setBasket: function(string) {
            this.basket.css('background-image', string);
        },

        setBasketAttribute: function(string) {
            this.basket.attr('title', string);
        },

        setCost: function(price) {
            this.goldNumber.html(price);
        },

        updateScale: function() {
            this.scale = this.game.getScaleFactor();
        },

        getItemsCount: function() {

            return this.isStoreDialog() ? 24 : 18;
        },

        getButtonType: function() {
            return this.isEnchantDialog() ? 'enchantDialogEnchantButton' : (this.isStoreDialog() ? 'storeDialogSellButton' : 'null');
        },

        isStoreDialog: function() {
            return this.dialogType == 'storeDialog';
        },

        isEnchantDialog: function() {
            return this.dialogType == 'enchantDialog';
        },

        isBankDialog: function() {
            return this.dialogType == 'bankDialog' || this.dialogType == 'bankDialogInventory' || this.dialogType == 'bankDialogBank';
        }
        
    });
    
    return InventoryFrame;
});