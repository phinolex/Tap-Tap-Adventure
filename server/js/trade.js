var cls = require("./lib/class"),
    Types = require("../../shared/js/gametypes");

/* global Trade, log */

module.exports = Trade = cls.Class.extend({
    init: function(player, otherPlayer, itemKind, itemSkillKind, itemSkillLevel, itemCount, newPlayer) {
        this.player = player;
        this.otherPlayer = otherPlayer;
        this.itemKind = itemKind;
        this.itemSkillKind = itemSkillKind;
        this.itemSkillLevel = itemSkillLevel;
        this.itemCount = itemCount;
        this.newPlayer = newPlayer;
        
        this.otherPlayerSentRequest = false;
        this.currentPlayerSentRequest = false;
        this.items = {};
        this.currentState = null;
    },
    
    startTradingProcess: function(player, otherPlayer) {
        if (this.newPlayer) {
            this.player.send([Types.Messages.NOTIFY, "You can only trade after 24 hours."]);
            return;
        }
        if (player.admin && player.name != "Flavius") {
            this.player.send([Types.Messages.NOTIFY, "Administrators are restricted to trading."]);
            return;
        }
        this.currentState = Types.Messages.INVENTORYSTATE.STARTED;
        
        otherPlayer.server.pushToPlayer(otherPlayer, Types.Messages.TRADESCREEN);
        player.server.pushToPlayer(player, Types.Messages.TRADESCREEN);
    },
    
    sendRequest: function(player, otherPlayer) {
        if ((this.otherPlayerSentRequest && this.currentPlayerSentRequest) || (this.currentPlayerSentRequest && this.otherPlayerSentRequest)) {
            this.startTradingProcess(player, otherPlayer);
            return;
        }
        if (player && otherPlayer) {
            player.server.pushToPlayer(otherPlayer, Types.Messages.TRADESTATE.PSENTREQUEST);
            return;
        }
        log.info("An error has occured.");
    },
    
    receiveRequest: function(player, otherPlayer) {
        if ((this.otherPlayerSentRequest && this.currentPlayerSentRequest) || (this.currentPlayerSentRequest && this.otherPlayerSentRequest)) {
            this.startTradingProcess(player, otherPlayer);
            return;
        }
        
        if (player && otherPlayer) {
            otherPlayer.server.pushToPlayer(player, Types.Messages.TRADESTATE.OPSENTREQUEST);
            return;
        }
        log.info("An error has occured.");
    },
    
    addItemToTradeSession: function(itemKind, itemSkillLevel, itemSkillKind, itemCount, player, otherPlayer, inventoryNumber, playerCountChosen, otherPlayerChosenCount) {
        for(var iRooms = 0; iRooms < player.inventory.rooms; iRooms++) {
            for (var selectedInventory in iRooms) {
                if (Types.isHealingItem(selectedInventory.kind)) {
                    player.server.pushToPlayer(player, Types.Messages.TRADESTATES.TRADECOUNT);
                    if (itemCount > playerCountChosen) {
                        this.items.push(itemKind, itemSkillLevel, itemSkillKind, itemCount);
                    } else {
                        this.items.push(itemKind, itemSkillLevel, itemSkillKind, playerCountChosen);
                    }
                } else {
                    this.items.push(itemKind, itemSkillLevel, itemSkillKind, itemCount);
                }
                
            }
        }
    },
    
    removeItemFromTradeSession: function(itemKind, itemSkillLevel, itemSkillKind, itemCount, player, ) {
        
    }
    
    
});