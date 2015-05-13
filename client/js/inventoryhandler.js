/* global Types, Class */

define(['jquery', 'button2', 'item'], function($, Button2, Item) {
    var InventoryHandler = Class.extend({
        init: function(game) {
            this.game = game;

            this.maxInventoryNumber = 5;
            this.inventory = [];
            this.inventoryCount = [];
            this.inventories = [];
            this.moreInventoryButton = new Button2('#moreinventorybutton', {background: {left: 591, top: 556, width: 34}, kinds: [0, 2], visible: false});

            this.healingCoolTimeCallback = null;

            var i=0;
            var self = this;
            for(i=0; i<30; i++) {
                $('#inventory' + i).click(function(event) {
                    if(self.game.ready){
                        var inventoryNumber = parseInt(this.id.slice(9));
                        if(self.game.inventoryHandler.inventory[inventoryNumber]) {

                            self.game.menu.clickInventory(inventoryNumber);
                        }
                    }
                });
            }
            this.moreInventoryButton.onClick(function(sender, event) {
                if(self.game && self.game.ready) {
                    if(sender.downed) {
                        sender.up();
                        self.hideAllInventory();
                    } else {
                        sender.down();
                        self.showAllInventory();
                    }
                }
            });
        },
        initInventory: function(maxInventoryNumber, inventory, inventoryNumber, inventorySkillKind, inventorySkillLevel) {
            var i=0;
            this.setMaxInventoryNumber(maxInventoryNumber);
            for(i=0; i<this.maxInventoryNumber; i++){

                this.setInventory(inventory[i], i, inventoryNumber[i], inventorySkillKind[i], inventorySkillLevel[i]);
            }
        },
        setInventory: function(itemKind, inventoryNumber, number, itemSkillKind, itemSkillLevel) {
            this.inventory[inventoryNumber] = itemKind;
            
            if(number){
                  this.inventoryCount[inventoryNumber] = number;
            } else{
                  this.inventoryCount[inventoryNumber] = 0;
            }
            if(itemKind){
                  if(inventoryNumber >= 0 && inventoryNumber < 6) {

                      $('#inventorybackground' + inventoryNumber).attr('class', 'empty');
                  }
                  var scale = this.game.renderer.scale;
                  
                  $('#inventory' + inventoryNumber).css('background-image', "url('img/" + scale + "/item-" + Types.getKindAsString(itemKind) + ".png')");
                  $('#inventory' + inventoryNumber).attr('title', Item.getInfoMsgEx(itemKind, number, itemSkillKind, itemSkillLevel));
                  $('#sellInventory' + inventoryNumber).css('background-image', "url('img/" + scale + "/item-" + Types.getKindAsString(itemKind) + ".png')");
                  $('#inventorynumber' + inventoryNumber).html('' + this.inventoryCount[inventoryNumber]);
            } 

            this.inventories[inventoryNumber] = {}; 
            this.inventories[inventoryNumber].kind = itemKind;
            this.inventories[inventoryNumber].count = number ? number : 0;
            this.inventories[inventoryNumber].skillKind = itemSkillKind ? itemSkillKind : 0;
            this.inventories[inventoryNumber].skillLevel = itemSkillLevel ? itemSkillLevel : 0;

        },

        setMaxInventoryNumber: function(maxInventoryNumber){
            var i = 0;
            this.maxInventoryNumber = maxInventoryNumber;
            for(i=0; i<30; i++){
                $('#inventorybackground' + i).css('display', 'none');
                $('#inventorynumber' + i).css('display', 'none');
            }
            for(i=0; i<maxInventoryNumber; i++){
                $('#inventorybackground' + i).css('display', 'block');
                $('#inventorynumber' + i).css('display', 'block');
            }
            if(maxInventoryNumber > 6){
                this.moreInventoryButton.show();
            }
        },
        
        makeEmptyInventory: function(inventoryNumber){
            if(inventoryNumber < this.maxInventoryNumber){
                this.inventory[inventoryNumber] = null;
                if(inventoryNumber >= 0 && inventoryNumber < 6) {
                    $('#inventorybackground' + inventoryNumber).attr('class', '');
                }
                $('#inventory' + inventoryNumber).css('background-image', 'none');
                $('#inventory' + inventoryNumber).attr('title', '');
                $('#inventorynumber' + inventoryNumber).html('');
                $('#sellInventory' + inventoryNumber).css('background-image', 'none');

                this.inventories[inventoryNumber] = null;
                if(this.game.storeDialog.visible) {
                    this.game.storeDialog.inventoryFrame.inventories[inventoryNumber].clear();
                }
            }
        },
        decInventory: function(inventoryNumber){
            var self = this;

            if(this.healingCoolTimeCallback === null){
                this.healingCoolTimeCallback = setTimeout(function(){

                    self.healingCoolTimeCallback = null;
                }, 1000);
                this.inventoryCount[inventoryNumber] -= 1;
                if(this.inventoryCount[inventoryNumber] <= 0){
                    this.inventory[inventoryNumber] = null;
                }
                this.inventories[inventoryNumber].count -= 1;
                if(this.inventories[inventoryNumber].count <= 0) {
                    this.inventories[inventoryNumber] = null;
                }
                return true;
            }
            return false;
        },

        showAllInventory: function(){
            $('#allinventorywindow').css('display', 'block');
        },
        hideAllInventory: function(){
            $('#allinventorywindow').css('display', 'none');
        }
    });
    
    return InventoryHandler;
});
