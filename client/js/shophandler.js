define(['jquery'], function(){
    var ShopHandler = Class.extend({
        init: function(game){
            var self = this;

            this.game = game;
            this.maxInventoryNumber = 2;
            this.shown = false;
            this.sellInventoryNumber = null;
            this.buySlotFirstNumber = 0;
            this.buySlotId = [];
            this.buySlotItem = [];
            this.buySlotBurgerCount = [];
            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    this.scale = 1;
                } else {
                    this.scale = this.game.renderer.getScaleFactor();
                }
            } else {
                this.scale = 2;
            }

            $('#sellClose').click(function(){
                self.hide();
            });
            $('#buyClose').click(function(){
                self.hide();
            });
            $('#sellButton').click(function(){
                var count = parseInt($('#sellCount').val());
                if(count > 0 && self.sellInventoryNumber !== null){
                    $('#sellItem').css('background-image', "url('../client/img/" + this.scale + "/inventory.png')");
                    self.game.client.sendSell(self.sellInventoryNumber, count);
                    self.sellInventoryNumber = null;
                }
            });
            $('#buyPrevButton').click(function(){
                self.buySlotFirstNumber -= 5;
                if(self.buySlotFirstNumber < 0){
                    self.buySlotFirstNumber = 0;
                }
                self.game.client.sendShop("get", self.buySlotFirstNumber);
            });

            $('#buyNextButton').click(function(){
                self.buySlotFirstNumber += 5;
                self.game.client.sendShop("get", self.buySlotFirstNumber);
            });
            var i=0;
            for(i=0; i<5; i++){
                $('#buyButton'+i).click(function(){
                    var number = parseInt(this.id.slice(-1));
                    if(number >=0 && number < 5){
                        self.game.client.sendBuy(self.buySlotId[number], self.buySlotItem[number], self.buySlotBurgerCount[number]);
                    }
                });
            }
        },
        initSellInventory: function(){
            this.sellInventoryNumber = null;
            $('#sellItem').css('background-image', "url('../client/img/" + this.scale + "/inventory.png')");
        },
        hide: function(){
            $('#shopSell').css('display', 'none');
            $('#shopBuy').css('display', 'none');
            this.shown = false;
        },
        show: function(){
            this.buySlotFirstNumber = 0;
            this.game.client.sendShop("get", 0);
        },
        setMaxInventoryNumber: function(maxInventoryNumber){
            var i = 0;
            var self = this;
            this.maxInventoryNumber = maxInventoryNumber;

            for(i=0; i<5; i++){
                $('#sellInventorybackground' + i).css('display', 'none');
            }
            for(i=0; i<maxInventoryNumber && i<5; i++){
                $('#sellInventorybackground' + i).css('display', 'block');
                $('#sellInventory' + i).click(function(){
                    self.sellInventoryNumber = parseInt(this.id.slice(-1));
                    var itemKind = self.game.inventoryHandler.inventory[self.sellInventoryNumber];
                    if(Types.isArmor(itemKind)){
                        $('#sellItem').css('background-image', "url('../client/img/" + this.scale + "/item-" + Types.getKindAsString(itemKind) + ".png')");
                    } else{
                        self.sellInventoryNumber = null;
                    }
                });
            }
        },
        handleShop: function(message){
            var self = this;
            var i=0;
            this.slotFirstNumber = parseInt(message.shift());
            for(i=0; i<5; i++){
                $('#buySlot'+i).css('display', 'none');
                this.buySlotId[i] = null;
                this.buySlotItem[i] = null;
                this.buySlotBurgerCount[i] = null;
            }
            for(i=0; i<message.length; i += 3){
                var slotNumber = i/3;
                this.buySlotId[slotNumber] = message[i];
                this.buySlotItem[slotNumber] = parseInt(message[i+1]);
                this.buySlotBurgerCount[slotNumber] = parseInt(message[i+2]);
                $('#buyItem'+slotNumber).css('background-image', "url('../client/img/" + this.scale + "/item-" + Types.getKindAsString(this.buySlotItem[slotNumber]) + ".png')");
                $('#buyItem'+slotNumber).attr('title', Types.getName(this.buySlotItem[slotNumber], this.game.language) + ": Armor +" + (Types.getArmorRank(this.buySlotItem[slotNumber]) + 1));
                $('#buyCount'+slotNumber).html("x" + this.buySlotBurgerCount[slotNumber]);
                $('#buySlot'+slotNumber).css('display', 'block');
            }

            $('#shopSell').css('display', 'block');
            $('#shopBuy').css('display', 'block');
            this.shown = true;

            for(i=0; i<this.game.player.maxInventoryNumber; i++){
                if(this.game.inventoryHandler.inventory){
                    $('#sellInventory'+i).css('background-image', "url('../client/img/" + this.scale + "/item-" + Types.getKindAsString(this.game.inventoryHandler.inventory[i]) + ".png')");
                }
            }
        },
    });

    return ShopHandler;
});
