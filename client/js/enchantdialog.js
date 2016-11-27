define(['dialog', 'tabbook', 'tabpage', 'item'], function(Dialog, TabBook, TabPage, Item) {
    function fixed(value, length) {
        var buffer = '00000000' + value;
        return buffer.substring(buffer.length - length);
    }

    function getGame(object) {
        return object ? (object.game ? object.game : getGame(object.parent)) : null;
    }

    var Inventory = Class.extend({
        init: function(parent, index) {
            this.parent = parent;
            this.index = index;
            this.itemKind = null;
            this.itemName = null;
            this.itemCount = 0;
            this.enchantLevel = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            var name = '#enchantDialogInventory' + fixed(this.index, 2);
            this.background = $(name + 'Background');
            this.body = $(name + 'Body');
            this.number = $(name + 'Number');

            this.rescale();
            var self = this;

            this.body.click(function(event) {
                self.parent.select(self);
            });
        },

        rescale: function() {
            this.scale = this.parent.parent.scale;
            if (this.scale == 1)
            {
                this.background.css({
                    'position': 'absolute',
                    'left': '' + (15 + Math.floor(this.index % 6) * 17) + 'px',
                    'top': '' + (22 + Math.floor(this.index / 6) * 23) + 'px',
                    'width': '16px',
                    'height': '15px',
                    'background-image': 'url("img/1/storedialogsheet.png")',
                    'background-position': '-300px -172px'
                });
                this.body.css({
                    'position': 'absolute',
                    'width': '16px',
                    'height': '15px',
                    'bottom': '1px'
                });
                this.number.css({
                    'margin-top': '15px',
                    'color': '#fff',
                    'text-size': '6px',
                    'text-align': 'center'
                });
            }
            else if (this.scale == 2)
            {
                this.background.css({
                    'position': 'absolute',
                    'left': '' + (30 + Math.floor(this.index % 6) * 33) + 'px',
                    'top': '' + (44 + Math.floor(this.index / 6) * 45) + 'px',
                    'width': '32px',
                    'height': '30px',
                    'background-image': 'url("img/2/storedialogsheet.png")',
                    'background-position': '-600px -344px'
                });
                this.body.css({
                    'position': 'absolute',
                    'width': '32px',
                    'height': '30px',
                    'bottom': '2px'
                });
                this.number.css({
                    'margin-top': '30px',
                    'color': '#fff',
                    'text-size': '9px',
                    'text-align': 'center'
                });
            }
            else if (this.scale == 3)
            {
                this.background.css({
                    'position': 'absolute',
                    'left': '' + (45 + Math.floor(this.index % 6) * 50) + 'px',
                    'top': '' + (66 + Math.floor(this.index / 6) * 68) + 'px',
                    'width': '48px',
                    'height': '45px',
                    'background-image': 'url("img/3/storedialogsheet.png")',
                    'background-position': '-900px -516px'
                });
                this.body.css({
                    'position': 'absolute',
                    'width': '48px',
                    'height': '45px',
                    'bottom': '3px'
                });
                this.number.css({
                    'margin-top': '45px',
                    'color': '#fff',
                    'text-size': '12px',
                    'text-align': 'center'
                });
            }
            if (this.itemKind)
                this.restore();

        },

        getIndex: function() {
            return this.index;
        },
        getItemKind: function() {
            return this.itemKind;
        },
        setItemKind: function(value) {
            this.itemKind = value;
            this.itemName = ItemTypes.getKindAsString(value);
        },
        getItemName: function() {
            return this.itemName;
        },
        getComment: function() {
            if (ItemTypes.isGold(this.itemKind))
                return '';
            var game = getGame(this);
            var enchantPrice = ItemTypes.getEnchantPrice(this.itemName, this.enchantLevel);
            return Item.getInfoMsgEx(this.itemKind, this.enchantLevel, this.skillKind, this.skillLevel) +
                '\r\nEnchant Price: ' + enchantPrice + ' Gold';
        },

        assign: function(itemKind, itemCount, skillKind, skillLevel) {
            this.setItemKind(itemKind);
            this.enchantLevel = itemCount;
            this.skillKind = skillKind;
            this.skillLevel = skillLevel;
            this.itemName = ItemTypes.getKindAsString(itemKind);
            this.itemCount = itemCount;
            this.restore();
        },
        clear: function() {
            this.setItemKind(null);
            this.itemCount = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            this.release();
        },
        release: function() {
            this.body.css('background-image', '');
            this.body.attr('title', '');
            this.number.html("");
        },
        restore: function() {
            this.scale = this.parent.parent.scale;
            this.body.css('background-image', this.itemName ? 'url("img/'+this.scale+'/item-' + this.itemName + '.png")' : '');
            this.body.attr('title', this.getComment());
            if (this.itemCount > 1) {
                if (ItemTypes.isObject(this.itemKind))
                    this.number.html(this.itemCount);
                else
                    this.number.html("+"+this.itemCount);
            } else {
                this.number.html("");
            }

        }
    });

    var InventoryFrame = Class.extend({
        init: function(parent) {
            var self = this;

            this.parent = parent;
            this.inventories = [];

            for(var index = 0; index < 18; index++)
                this.inventories.push(new Inventory(this, index));

            this.basket = $('#enchantDialogBasket');
            this.enchantButton = $('#enchantDialogEnchantButton');
            this.enchantButton.html("Enchant");

            this.goldBackground = $('#enchantDialogGoldBackground');
            this.goldIcon = $('#enchantDialogGoldBody');
            this.goldNumber = $('#enchantDialogGoldNumber');

            this.selectedInventory = null;

            this.basket.click(function(event) {
                log.info("Hi");

            });

            this.enchantButton.click(function(event) {
                if(self.selectedInventory) {
                    var game = getGame(self);
                    if(game && game.ready) {
                        var enchantPrice = ItemTypes.getEnchantPrice(self.selectedInventory.itemName, self.selectedInventory.enchantLevel),
                            enchantString = "The cost is: " + enchantPrice + " to upgrade to: " + (self.selectedInventory.enchantLevel + 1) + " enchantment.";
                        //var enchantString = 'Cost ' + enchantPrice + ' to upgrade to +' + (self.selectedInventory.enchantLevel+1);
                        self.parent.confirm(enchantString, function(result) {
                            if(result) {
                                game.client.sendStoreEnchant(self.selectedInventory.getIndex() + 6);
                                self.release();
                            }
                        });
                    }
                }
            });

        },

        rescale: function(scale) {
            if (scale == 1)
            {
                this.basket.css({
                    'position': 'absolute',
                    'left': '44px',
                    'top': '125px',
                    'width': '16px',
                    'height': '15px',
                    'background-position': '0px -2px'
                });
                this.enchantButton.css({
                    'position': 'absolute',
                    'left': '65px',
                    'top': '125px',
                    'width': '30px',
                    'height': '19px',
                    'margin-left': '4px',
                    'margin-top': '5px',
                    'color': '#fff',
                    'font-size': '6px',
                });
                this.goldBackground.css({
                    'position': 'absolute',
                    'left': '15px',
                    'top': '125px',
                    'width': '16px',
                    'height': '15px',
                    'background-image': 'url("img/1/storedialogsheet.png")',
                    'background-position': '-300px -172px'
                });
                this.goldIcon.css({
                    'position': 'absolute',
                    'width': '16px',
                    'height': '15px',
                    'background-image': 'url("img/1/item-gold.png")'
                });
                this.goldNumber.css({
                    'position': 'absolute',
                    'margin-top': '15px',
                    'color': '#000',
                    'text-align': 'center'
                });
            }
            else if (scale == 2)
            {
                this.basket.css({
                    'position': 'absolute',
                    'left': '88px',
                    'top': '250px',
                    'width': '32px',
                    'height': '30px',
                    'background-position': '0px -5px'
                });
                this.enchantButton.css({
                    'position': 'absolute',
                    'left': '130px',
                    'top': '246px',
                    'width': '60px',
                    'height': '38px',
                    'margin-left': '8px',
                    'margin-top': '10px',
                    'color': '#fff',
                    'font-size': '12px',
                });
                this.goldBackground.css({
                    'position': 'absolute',
                    'left': '30px',
                    'top': '246px',
                    'width': '32px',
                    'height': '30px',
                    'background-image': 'url("img/2/storedialogsheet.png")',
                    'background-position': '-600px -344px'
                });
                this.goldIcon.css({
                    'position': 'absolute',
                    'width': '32px',
                    'height': '30px',
                    'background-image': 'url("img/2/item-gold.png")'
                });
                this.goldNumber.css({
                    'position': 'absolute',
                    'margin-top': '30px',
                    'color': '#000',
                    'text-align': 'center'
                });

            }
            else if (scale == 3)
            {
                this.basket.css({
                    'position': 'absolute',
                    'left': '132px',
                    'top': '375px',
                    'width': '48px',
                    'height': '45px',
                    'background-position': '0px -5px'
                });
                this.enchantButton.css({
                    'position': 'absolute',
                    'left': '195px',
                    'top': '369px',
                    'width': '90px',
                    'height': '57px',
                    'margin-left': '12px',
                    'margin-top': '15px',
                    'color': '#fff',
                    'font-size': '18px',
                });
                this.goldBackground.css({
                    'position': 'absolute',
                    'left': '45px',
                    'top': '375px',
                    'width': '48px',
                    'height': '45px',
                    'background-image': 'url("img/3/storedialogsheet.png")',
                    'background-position': '-900px -516px'
                });
                this.goldIcon.css({
                    'position': 'absolute',
                    'width': '48px',
                    'height': '45px',
                    'background-position': '0px 0px',
                    'background-image': 'url("img/3/item-gold.png")'
                });
                this.goldNumber.css({
                    'position': 'absolute',
                    'margin-top': '45px',
                    'color': '#000',
                    'text-align': 'center'
                });
            }

            for(var index = 0; index < 18; index++) {
                this.inventories[index].rescale();
            }
        },

        getInventory: function(index) {
            return this.inventories[index];
        },

        open: function() {
            this.release();

            for(var index = 0; index < this.inventories.length; index++) {
                this.inventories[index].release();
            }

            this.goldNumber.html('0');
            var game = getGame(this);
            if(game && game.ready) {
                for(var inventoryNumber = 6; inventoryNumber < game.inventoryHandler.maxInventoryNumber; inventoryNumber++) {
                    var item = game.inventoryHandler.inventories[inventoryNumber];
                    if(item && item.kind) {
                        if(ItemTypes.isWeapon(item.kind) || ItemTypes.isArcherWeapon(item.kind)) {
                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, item.skillKind, item.skillLevel);
                        } else if (ItemTypes.isArmor(item.kind) || ItemTypes.isArcherArmor(item.kind)) {
                            this.inventories[inventoryNumber-6].assign(item.kind, item.count, 0, 0);
                        } else if (ItemTypes.isGold(item.kind)) {
                            this.goldNumber.html(item.count);

                        }
                    }
                }
            }
        },
        select: function(inventory) {
            var self = this;

            if(this.selectedInventory) {
                this.inventories[this.selectedInventory.getIndex()].restore();
            }
            this.selectedInventory = inventory;
            inventory.release();

            this.basket.css('background-image', inventory.getItemName() ? 'url("img/'+this.parent.scale+'/item-' + inventory.getItemName() + '.png")' : '');
            this.basket.attr('title', inventory.getComment());
            this.enchantButton.css('cursor', 'pointer');

            var enchantPrice = ItemTypes.getEnchantPrice(self.selectedInventory.itemName, self.selectedInventory.enchantLevel);
            self.goldNumber.html('' + enchantPrice);
        },
        release: function() {
            if(this.selectedInventory) {
                this.inventories[this.selectedInventory.getIndex()].restore();
                this.selectedInventory = null;

                this.basket.css('background-image', '');
                this.basket.attr('title', '');
                this.enchantButton.css('cursor', 'default');
            }
        }
    });



    var EnchantDialog = Dialog.extend({
        init: function(game) {
            this._super(game, '#enchantDialog');
            this.setScale();

            this.inventoryFrame = new InventoryFrame(this);

            this.closeButton = $('#enchantDialogCloseButton');
            this.modal = $('#enchantDialogModal');
            this.modalNotify = $('#enchantDialogModalNotify');
            this.modalNotifyMessage = $('#enchantDialogModalNotifyMessage');
            this.modalNotifyButton1 = $('#enchantDialogModalNotifyButton1');
            this.modalConfirm = $('#enchantDialogModalConfirm');
            this.modalConfirmMessage = $('#enchantDialogModalConfirmMessage');
            this.modalConfirmButton1 = $('#enchantDialogModalConfirmButton1');
            this.modalConfirmButton2 = $('#enchantDialogModalConfirmButton2');
            this.confirmCallback = null;
            this.scale=0;


            var self = this;

            this.closeButton.click(function(event) {
                self.hide();
            });
            this.modalNotifyButton1.click(function(event) {
                self.modal.css('display', 'none');
                self.modalNotify.css('display', 'none');
            });
            this.modalConfirmButton1.click(function(event) {
                self.modal.css('display', 'none');
                self.modalConfirm.css('display', 'none');

                if(self.confirmCallback) {
                    self.confirmCallback(true);
                }
            });
            this.modalConfirmButton2.click(function(event) {
                self.modal.css('display', 'none');
                self.modalConfirm.css('display', 'none');

                if(self.confirmCallback) {
                    self.confirmCallback(false);
                }
            });
        },
        setScale: function() {
            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    this.scale = 1;
                } else {
                    this.scale = this.game.renderer.getScaleFactor();
                }
            } else {
                this.scale = 2;
            }

        },
        rescale: function() {
            this.setScale();
            if (this.scale == 1) {
                this.closeButton.css({
                    'position': 'absolute',
                    'left': '120px',
                    'top': '15px',
                    'width': '16px',
                    'height': '16px',
                    'background-image': 'url("img/1/storedialogsheet.png")',
                    'background-position': '-32px -165px',
                    'cursor': 'pointer'
                });

            } else if (this.scale == 2) {
                this.closeButton.css({
                    'position': 'absolute',
                    'left': '240px',
                    'top': '31px',
                    'width': '32px',
                    'height': '32px',
                    'background-image': 'url("img/2/storedialogsheet.png")',
                    'background-position': '-64px -330px',
                    'cursor': 'pointer'
                });

            } else if (this.scale == 3) {
                this.closeButton.css({
                    'position': 'absolute',
                    'left': '360px',
                    'top': '52px',
                    'width': '48px',
                    'height': '48px',
                    'background-image': 'url("img/3/storedialogsheet.png")',
                    'background-position': '-97px -496px',
                    'cursor': 'pointer'
                });
            }
            this.inventoryFrame.rescale(this.scale);
        },

        show: function() {
            this.rescale();
            this.inventoryFrame.open();

            this._super();
        },

        notify: function(message) {
            this.modalNotifyMessage.text(message);
            this.modalNotify.css('display', 'block');
            this.modal.css('display', 'block');
        },
        confirm: function(message, callback) {
            this.confirmCallback = callback;

            this.modalConfirmMessage.text(message);
            this.modalConfirm.css('display', 'block');
            this.modal.css('display', 'block');
        }
    });

    return EnchantDialog;
});

