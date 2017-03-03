/* global Types, Class, ItemTypes */

define(['jquery', '../entity/item/item'], function($, Item) {
    var InventoryHandler = Class.extend({
        init: function(game) {
            var self = this;

            self.game = game;

            self.maxInventoryNumber = 24;
            self.inventory = [];
            self.inventoryCount = [];
            self.inventories = [];
            self.inventoryDisplay = [];
            self.scale = self.getScale();
            self.healingCooldown = null;
            self.showEntireInventory = false;

            self.initClickEvents();
        },

        initClickEvents: function() {
            var self = this;


            // Set all the events here
            for (var i = 0; i < 30; i++) {
                var inventoryIndex = $('#inventory' + i);

                /**
                 * Handling when a player clicks on an
                 * inventory button through events.
                 */

                inventoryIndex.click(function(event) {
                    if (self.game.ready) {
                        var inventoryNumber = parseInt(this.id.slice(9)), //Has to be declared in each callback.
                            kind = self.getInventory(inventoryNumber);

                        if (kind)
                            self.game.menu.clickInventory(inventoryNumber);
                    }
                });

                inventoryIndex.dblclick(function(event) {
                    if (self.game.ready) {
                        var inventoryNumber = parseInt(this.id.slice(9)),
                            inventory = self.getInventory(inventoryNumber);


                        if (inventory) {

                            if (ItemTypes.isConsumableItem(inventory))
                                self.game.eat(inventoryNumber);
                            else
                                self.game.equip(inventoryNumber);
                        }
                    }
                });

                /**
                 * Drag and drop method here, only active on
                 * desktop client. Has to be worked on for mobiles.
                 */

                if (self.isDesktop()) {
                    inventoryIndex.attr('draggable', true);
                    inventoryIndex.draggable = true;

                    inventoryIndex.bind('dragstart', function (event) {
                        var inventoryNumber = parseInt(this.id.splice(9));

                        event.originalEvent.dataTransfer.setData('invNumber', inventoryNumber);

                        DragDataInv = {};
                        DragDataInv.invNumber = inventoryNumber;
                    });

                    inventoryIndex.bind('touchstart', function(event) {
                        var inventoryNumber = parseInt(this.id.slice(9));

                        DragDataInv = {};
                        DragDataInv.invNumber = inventoryNumber;
                    });

                    inventoryIndex.bind('touchend', function(event) {
                        var touch = event.originalEvent.changedTouches[0],
                            element = document.elementFromPoint(touch.clientX, touch.clientY);

                        if (element.id == 'toptextcanvas' && DragDataInv && DragDataInv.invNumber >= 0) {
                            self.game.dropItem(DragData.invNumber);
                            DragData.invNumber = null;
                        }
                    });
                }
            }
        },

        initInventory: function(maxInventoryNumber, inventory, inventoryNumber, inventorySkillKind, inventorySkillLevel) {
            var self = this;

            self.setMaxInventoryNumber(maxInventoryNumber);
            self.inventoryDisplay = [];

            for (var i = 0; i < self.maxInventoryNumber; i++) {
                var invObject = {
                    inv: inventory[i],
                    num: inventoryNumber[i],
                    skillKind: inventorySkillKind[i],
                    skillLevel: inventorySkillLevel[i]
                };

                self.inventoryDisplay.push(invObject);
            }

            self.inventoryDisplayShow();
        },

        //Put functions on the outside for better control
        getInventory: function(inventoryNumber) {
              return this.inventory[inventoryNumber];
        },

        inventoryDisplayShow: function() {
            var self = this;

            for (var i = 0; i < self.maxInventoryNumber; i++) {
                var inv = self.inventoryDisplay[i];

                self.setInventory(inv.inv, i, inv.num, inv.skillKind, inv.skillLevel);
            }
        },

        setInventory: function(itemKind, inventoryNumber, number, itemSkillKind, itemSkillLevel) {
            var self = this,
                spriteName,
                inventory  = $('#inventory' + inventoryNumber),
                sellInventory = $('#sellInventory' + inventoryNumber),
                invNumber = $('#inventorynumber' + inventoryNumber);

            self.inventory[inventoryNumber] = itemKind;
            self.inventoryCount[inventoryNumber] = number ? number : 0;

            if (itemKind) {
                if (inventoryNumber >= 0 && inventoryNumber < 6)
                    $('#inventorybackground' + inventoryNumber).attr('class', 'empty');

                spriteName = (ItemTypes.KindData[itemKind].spriteName !== '') ? ItemTypes.KindData[itemKind].spriteName : ItemTypes.getKindAsString(itemKind);

                inventory.css('background-image', "url('img/" + self.scale + "/item-" + spriteName + ".png')");
                inventory.attr('title', Item.getInfoMsgEx(itemKind, number, itemSkillKind, itemSkillLevel));
                sellInventory.css('background-image', "url('img/" + self.scale + "/item-" + spriteName + ".png'");

                if (number > 1)
                    invNumber.html(((ItemTypes.isObject(itemKind) || ItemTypes.isCraft(itemKind)) ? '' : '+') + '' + self.inventoryCount[inventoryNumber]);
                else if (number == 1)
                    invNumber.html('');
            }

            self.inventories[inventoryNumber] = {};
            self.inventories[inventoryNumber].kind = itemKind ? itemKind : 0;
            self.inventories[inventoryNumber].count = number ? number : 0;
            self.inventories[inventoryNumber].skillKind = itemSkillKind ? itemSkillKind : 0;
            self.inventories[inventoryNumber].skillLevel = itemSkillLevel ? itemSkillLevel : 0;

        },

        setMaxInventoryNumber: function(maxInventoryNumber) {
            var self = this;

            self.maxInventoryNumber = maxInventoryNumber;

            for (var i = 0; i < 24; i++) {
                $('#inventorybackground' + i).css('display', 'block');
                $('#inventorynumber' + i).css('display', 'block');
            }
        },

        makeEmptyInventory: function(inventoryNumber) {
            var self = this;

            if (inventoryNumber < self.maxInventoryNumber) {
                self.inventory[inventoryNumber] = null;

                if (inventoryNumber >= 0 && inventoryNumber < 24)
                    $('#inventorybackground' + inventoryNumber).attr('class', '');

                var inventory = $('#inventory' + inventoryNumber);

                inventory.css('background-image', 'none');
                inventory.attr('title', '');

                $('#inventorynumber' + inventoryNumber).html('');
                $('#sellInventory' + inventoryNumber).css('background-image', 'none');

                self.inventories[inventoryNumber] = null;
                //self.game.shopDialog.inventoryFrame.inventories[inventoryNumber].clear();
            }
        },

        decInventory: function(inventoryNumber) {
            var self = this;

            if (self.healingCooldown == null) {
                var cooltime = $('#inventory' + inventoryNumber + 'Cooltime'),
                    time = 4;

                cooltime.css('display', 'block');
                cooltime.html(time);

                self.healingCooldown = setInterval(function() {
                    if (time <= 0) {
                        cooltime.css('display', 'none');
                        clearInterval(self.healingCooldown);
                        self.healingCooldown = null;
                    } else
                        cooltime.html(time - 1);
                }, 1000);

                self.inventoryCount[inventoryNumber] -= 1;

                if (self.inventoryCount[inventoryNumber] <= 0)
                    self.inventory[inventoryNumber] = null;

                self.inventories[inventoryNumber] -= 1;

                if (self.inventories[inventoryNumber] <= 0)
                    self.inventories[inventoryNumber] = null;

                return true;
            }

            return false;
        },

        toggleAllInventory: function() {
            var self = this,
                inventoryWindow = $('#allinventorywindow');

            self.showEntireInventory = !self.showEntireInventory;

            inventoryWindow.css('display', self.showEntireInventory ? 'block' : 'none');
        },

        getItemSlotByKind: function(kind) {
            var self = this;

            for (var i = 0; i < self.maxInventoryNumber; i++) {
                if (self.inventories[i] && kind == self.inventories[i].kind)
                    return i;
            }
        },

        getScale: function() {
            var self = this,
                scale;

            scale = self.game.renderer.getScaleFactor();

            if (self.game.renderer.mobile)
                scale = 1;

            return scale;
        },

        isInventoryEquipmentFull: function() {
            var self = this;

            for (var i = 6; i < self.maxInventoryNumber; ++i) {
                if (self.inventories[i] == null || self.inventories[i].kind == 0)
                    return false;
            }

            return true;
        },

        isDesktop: function() {
            var self = this,
                isMobile = self.game.renderer.mobile,
                isTablet = self.game.renderer.tablet;

            return !isMobile && !isTablet;
        }
    });

    return InventoryHandler;
});
