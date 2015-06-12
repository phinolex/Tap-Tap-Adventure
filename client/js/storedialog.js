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
            var name = '#storeDialogInventory' + fixed(index, 2);

            this.parent = parent;
            this.index = index;
            this.itemKind = null;
            this.itemName = null;
            this.itemCount = 0;
            this.skillKind = 0;
            this.skillLevel = 0;
            this.background = $(name + 'Background');
            this.body = $(name + 'Body');

            this.background.css({
                'position': 'absolute',
                'left': '' + (30 + Math.floor(index % 6) * 33) + 'px',
                'top': '' + (44 + Math.floor(index / 6) * 31) + 'px',
                'width': '32px',
                'height': '30px',
                'background-image': 'url("img/2/storedialogsheet.png")',
                'background-position': '-600px -344px'
            });
            this.body.css({
                'position': 'absolute',
                'left': '0px',
                'top': '0px',
                'width': '32px',
                'height': '30px',
                'background-position': '0px -5px'
            });

            var self = this;

            this.body.click(function(event) {
                if(self.itemName && (Types.Store.getSellPrice(self.itemName) > 0)) {
                    self.parent.select(self);
                }
            });
        },

        getIndex: function() {
            return this.index;
        },
        getItemKind: function() {
            return this.itemKind;
        },
        setItemKind: function(value) {
            this.itemKind = value;
            this.itemName = Types.getKindAsString(value);
        },
        getItemName: function() {
            return this.itemName;
        },
        getComment: function() {
            var game = getGame(this);
            var sellPrice = Types.Store.getSellPrice(this.itemName);
            return Item.getInfoMsgEx(this.itemKind, this.itemCount, this.skillKind, this.skillLevel, game.language) +
                (sellPrice > 0 ? '\r\n가격: 버거 ' + sellPrice + '개' : '\r\n팔 수 없는 장비입니다.')
        },

        assign: function(itemKind, itemCount, skillKind, skillLevel) {
            this.setItemKind(itemKind);
            this.itemCount = itemCount;
            this.skillKind = skillKind;
            this.skillLevel = skillLevel;
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
        },
        restore: function() {
            this.body.css('background-image', this.itemName ? 'url("img/2/item-' + this.itemName + '.png")' : '');
            this.body.attr('title', this.getComment());
        }
    });

    var InventoryFrame = Class.extend({
        init: function(parent) {
            this.parent = parent;
            this.inventories = [];

            for(var index = 0; index < 30; index++) {
                this.inventories.push(new Inventory(this, index));
            }

            this.basket = $('#storeDialogBasket');
            this.sellButton = $('#storeDialogSellButton');

            this.selectedInventory = null;

            this.basket.css({
                'position': 'absolute',
                'left': '88px',
                'top': '250px',
                'width': '32px',
                'height': '30px',
                'background-position': '0px -5px'
            });
            this.sellButton.css({
                'position': 'absolute',
                'left': '130px',
                'top': '246px',
                'width': '60px',
                'height': '38px'
            });

            var self = this;

            this.sellButton.click(function(event) {
                if(self.selectedInventory) {
                    var game = getGame(self);
                    if(game && game.ready) {
                        self.parent.confirm('정말로 파시겠습니까?', function(result) {
                            if(result) {
                                game.client.sendStoreSell(self.selectedInventory.getIndex());
                                self.release();
                            }
                        });
                    }
                }
            });
        },

        getInventory: function(index) {
            return this.inventories[index];
        },

        open: function(datas) {
            this.release();

            for(var index = 0; index < this.inventories.length; index++) {
                this.inventories[index].release();
            }
            if(datas instanceof Array) {
                for(var index = 0; index < datas.length; ) {
                    var inventoryNumber = parseInt(datas[index]),
                        itemKind = parseInt(datas[index + 1]);

                    if(Types.isWeapon(itemKind) || Types.isArcherWeapon(itemKind) || Types.isPendant(itemKind) || Types.isRing(itemKind)) {
                        this.inventories[inventoryNumber].assign(itemKind, parseInt(datas[index + 2]), parseInt(datas[index + 3]), parseInt(datas[index + 4]));

                        index += 5;
                    } else {
                        this.inventories[inventoryNumber].assign(itemKind, 0, 0, 0);

                        index += 2;
                    }
                }
            } else {
                var game = getGame(this);
                if(game && game.ready) {
                    for(var inventoryNumber = 0; inventoryNumber < game.inventoryHandler.maxInventoryNumber; inventoryNumber++) {
                        var item = game.inventoryHandler.inventories[inventoryNumber];
                        if(item && item.kind) {
                            if(Types.isWeapon(item.kind) || Types.isArcherWeapon(item.kind) || Types.isPendant(item.kind) || Types.isRing(item.kind)) {
                                this.inventories[inventoryNumber].assign(item.kind, item.count, item.skillKind, item.skillLevel);
                            } else {
                                this.inventories[inventoryNumber].assign(item.kind, item.count, 0, 0);
                            }
                        }
                    }
                }
            }
        },
        select: function(inventory) {
            if(this.selectedInventory) {
                this.inventories[this.selectedInventory.getIndex()].restore();
            }
            this.selectedInventory = inventory;
            inventory.release();

            this.basket.css('background-image', inventory.getItemName() ? 'url("img/2/item-' + inventory.getItemName() + '.png")' : '');
            this.basket.attr('title', inventory.getComment());
            this.sellButton.css('cursor', 'pointer');
        },
        release: function() {
            if(this.selectedInventory) {
                this.inventories[this.selectedInventory.getIndex()].restore();
                this.selectedInventory = null;

                this.basket.css('background-image', '');
                this.basket.attr('title', '');
                this.sellButton.css('cursor', 'default');
            }
        }
    });

    var StoreRack = Class.extend({
        init: function(parent, id, index) {
            this.parent = parent;
            this.id = id;
            this.index = index;
            this.body = $(id);
            this.basketBackground = $(id + 'BasketBackground');
            this.basket = $(id + 'Basket');
            this.extra = $(id + 'Extra');
            this.price = $(id + 'Price');
            this.count = $(id + 'Count');
            this.buyButton = $(id + 'BuyButton');
            this.item = null;

            this.body.css({
                'position': 'absolute',
                'left': '0px',
                'top': '' + (index * 40) + 'px',
                'width': '268px',
                'height': '38px',
                'border-radius': '3px',
                'background-color': 'rgba(150, 150, 150, 0.35)',
                'display': 'none'
            });
            this.basketBackground.css({
                'position': 'absolute',
                'left': '8px',
                'top': '4px',
                'width': '32px',
                'height': '30px',
                'background-image': 'url("img/2/storedialogsheet.png")',
                'background-position': '-600px -344px'
            });
            this.basket.css({
                'position': 'absolute',
                'left': '0px',
                'top': '4px',
                'width': '32px',
                'height': '30px',
                'background-position': '0px -5px'
            });
            this.extra.css({
                'position': 'absolute',
                'left': '42px',
                'top': '8px',
                'width': '30px',
                'height': '22px',
                'line-height': '22px',
                'color': 'white',
            });
            this.price.css({
                'position': 'absolute',
                'left': '92px',
                'top': '8px',
                'width': '50px',
                'height': '22px',
                'line-height': '22px',
                'color': 'white',
                'text-align': 'right'
            });
            this.count.css({
                'position': 'absolute',
                'left': '144px',
                'top': '7px',
                'width': '50px',
                'height': '18px',
                'text-align': 'right'
            });
            this.buyButton.css({
                'position': 'absolute',
                'left': '206px',
                'top': '8px',
                'width': '54px',
                'height': '22px',
                'background-image': 'url("img/2/storedialogsheet.png")',
                'background-position': '-632px -344px',
                'line-height': '22px',
                'color': 'white',
                'text-align': 'center',
                'cursor': 'pointer'
            });
            this.buyButton.text('사기');

            var self = this;

            this.buyButton.click(function(event) {
                var game = getGame(self);
                if(game && game.ready) {
                    game.client.sendStoreBuy(self.parent.itemType, self.item.kind, parseInt(self.count.val()));
                }
            });
        },

        getVisible: function() {
            return this.body.css('display') === 'block';
        },
        setVisible: function(value) {
            this.body.css('display', value ? 'block' : 'none');
        },

        assign: function(item) {
            var game = getGame(this);
            this.item = item;

            this.basket.css('background-image', 'url("img/2/item-' + item.name + '.png")')
            this.basket.attr('title', Item.getInfoMsgEx(item.kind, 0, 0, 0, game.language));
            this.extra.text(item.buyCount > 0 ? 'x' + item.buyCount : '');
            this.price.text(item.buyPrice + ' x');
            this.count.val('1');
            this.count.attr('disabled', !item.buyMultiple);
        }
    });

    var StorePage = TabPage.extend({
        init: function(id, itemType, items, ranks) {
            this._super(id + 'Page', id + 'Button');

            this.itemType = itemType;
            this.racks = [];
            this.items = [];

            for(var index = 0; index < 6; index++) {
                this.racks.push(new StoreRack(this, id + index, index));
            }

            for(var itemName in items) {
                if(Types.Store.isBuy(itemName)) {
                    var item = {
                        name: itemName,
                        kind: Types.getKindFromString(itemName),
                        buyCount: Types.Store.getBuyCount(itemName),
                        buyPrice: Types.Store.getBuyPrice(itemName),
                        buyMultiple: Types.Store.isBuyMultiple(itemName)
                    };
                    this.items.push(item);
                }
            }
            if(ranks) {
                for(var index = 0; index < this.items.length; index++) {
                    var item = this.items[index];
                    item.rank = ranks.indexOf(item.kind);
                }

                this.items.sort(function(a, b) {
                    return a.rank - b.rank;
                });
            }
        },

        getPageCount: function() {
            return Math.ceil(this.items.length / 6);
        },
        getPageIndex: function() {
            return this.pageIndex;
        },
        setPageIndex: function(value) {
            this.pageIndex = value;
            this.reload();
        },

        open: function() {
            this.setPageIndex(0);
        },
        reload: function() {
            for(var index = this.pageIndex * 6; index < Math.min((this.pageIndex + 1) * 6, this.items.length); index++) {
                var rack = this.racks[index - (this.pageIndex * 6)];

                rack.assign(this.items[index]);
                rack.setVisible(true);
            }
            for(var index = this.items.length; index < (this.pageIndex + 1) * 6; index++) {
                var rack = this.racks[index - (this.pageIndex * 6)];

                rack.setVisible(false);
            }
        }
    });

    var StorePotionPage = StorePage.extend({
        init: function() {
            this._super('#storeDialogStorePotion', Types.Store.ItemTypes.POTION, Types.Store.Potions, null);
        }
    });

    var StoreArmorPage = StorePage.extend({
        init: function() {
            this._super('#storeDialogStoreArmor', Types.Store.ItemTypes.ARMOR, Types.Store.Armors, Types.rankedArmors);
        }
    });

    var StoreWeaponPage = StorePage.extend({
        init: function() {
            this._super('#storeDialogStoreWeapon', Types.Store.ItemTypes.WEAPON, Types.Store.Weapons, Types.rankedWeapons);
        }
    });

    var PageNavigator = Class.extend({
        init: function() {
            this.body = $('#storeDialogPageNavigator');
            this.movePreviousButton = $('#storeDialogPageNavigatorMovePreviousButton');
            this.numbers = [];
            for(var index = 0; index < 5; index++) {
                this.numbers.push($('#storeDialogPageNavigatorNumber' + index));
            }
            this.moveNextButton = $('#storeDialogPageNavigatorMoveNextButton');

            this.changeHandler = null;

            this.body.css({
                'position': 'absolute',
                'left': '103px',
                'top': '350px',
                'width': '138px',
                'height': '20px'
            });
            this.movePreviousButton.css({
                'position': 'absolute',
                'left': '0px',
                'top': '1px',
                'width': '16px',
                'height': '18px',
            });
            for(var index = 0; index < this.numbers.length; index++) {
                this.numbers[index].css({
                    'position': 'absolute',
                    'left': '' + (24 + (index * 18)) + 'px',
                    'top': '0px',
                    'width': '18px',
                    'height': '20px'
                });
            }
            this.numbers[2].attr('class', 'storeDialogPageNavigatorNumberS');
            this.moveNextButton.css({
                'position': 'absolute',
                'left': '122px',
                'top': '1px',
                'width': '16px',
                'height': '18px'
            });

            var self = this;

            this.movePreviousButton.click(function(event) {
                if(self.index > 1) {
                    self.setIndex(self.index - 1);
                }
            });
            this.moveNextButton.click(function(event) {
                if(self.index < self.count) {
                    self.setIndex(self.index + 1);
                }
            });
        },

        getCount: function() {
            return this.count;
        },
        setCount: function(value) {
            this.count = value;

            for(var index = 0; index < 2; index++) {
                this.numbers[4 - index].attr('class', 'storeDialogPageNavigatorNumber' + (value % 10));
                value = Math.floor(value / 10);
            }
        },
        getIndex: function() {
            return this.index;
        },
        setIndex: function(value) {
            this.index = value;

            for(var index = 0; index < 2; index++) {
                this.numbers[1 - index].attr('class', 'storeDialogPageNavigatorNumber' + (value % 10));
                value = Math.floor(value / 10);
            }

            this.movePreviousButton.attr('class', this.index > 1 ? 'enabled' : '');
            this.moveNextButton.attr('class', this.index < this.count ? 'enabled' : '');

            if(this.changeHandler) {
                this.changeHandler(this);
            }
        },
        getVisible: function() {
            return this.body.css('display') === 'block';
        },
        setVisible: function(value) {
            this.body.css('display', value ? 'block' : 'none');
        },

        onChange: function(handler) {
            this.changeHandler = handler;
        }
    });

    var StoreFrame = TabBook.extend({
        init: function(parent) {
            this._super('#storeDialogStore');

            this.parent = parent;

            this.add(new StorePotionPage());
            this.add(new StoreArmorPage());
            this.add(new StoreWeaponPage());

            this.pageNavigator = new PageNavigator();

            var self = this;

            this.pageNavigator.onChange(function(sender) {
                var activePage = self.getActivePage();
                if(activePage) {
                    activePage.setPageIndex(sender.getIndex() - 1);
                }
            });
        },

        setPageIndex: function(value) {
            this._super(value);

            var activePage = this.getActivePage();
            if(activePage) {
                if(activePage.getPageCount() > 0) {
                    this.pageNavigator.setCount(activePage.getPageCount());
                    this.pageNavigator.setIndex(activePage.getPageIndex() + 1);
                    this.pageNavigator.setVisible(true);
                } else {
                    this.pageNavigator.setVisible(false);
                }
            }
        },

        open: function() {
            for(var index = 0; index < this.pages.length; index++) {
                this.pages[index].open();
            }
            this.setPageIndex(0);
        }
    });

    var StoreDialog = Dialog.extend({
        init: function(game) {
            this._super(game, '#storeDialog');

            this.closeButton = $('#storeDialogCloseButton');
            this.inventoryFrame = new InventoryFrame(this);
            this.storeFrame = new StoreFrame(this);
            this.modal = $('#storeDialogModal');
            this.modalNotify = $('#storeDialogModalNotify');
            this.modalNotifyMessage = $('#storeDialogModalNotifyMessage');
            this.modalNotifyButton1 = $('#storeDialogModalNotifyButton1');
            this.modalConfirm = $('#storeDialogModalConfirm');
            this.modalConfirmMessage = $('#storeDialogModalConfirmMessage');
            this.modalConfirmButton1 = $('#storeDialogModalConfirmButton1');
            this.modalConfirmButton2 = $('#storeDialogModalConfirmButton2');
            this.confirmCallback = null;

            this.closeButton.css({
                'position': 'absolute',
                'left': '581px',
                'top': '31px',
                'width': '32px',
                'height': '32px',
                'background-image': 'url("img/2/storedialogsheet.png")',
                'background-position': '-64px -330px',
                'cursor': 'pointer'
            });

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

        show: function(datas) {
            this.inventoryFrame.open(datas);
            this.storeFrame.open();

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

    return StoreDialog;
});
