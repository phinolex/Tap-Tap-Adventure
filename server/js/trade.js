var cls = require("./lib/class"),
    Types = require("../../shared/js/gametypes"),
    RequestHandler = require("./requesthandler"),
    Messages = require("./message");

/* global Trade, log */

module.exports = Trade = cls.Class.extend({
    init: function(player, otherPlayer) {
        this.player = player;
        this.otherPlayer = otherPlayer;
        this.requestAssistant = new RequestHandler(player, otherPlayer);
        this.items = {};
        this.currentState = null;
    },
    
    
    sendRequest: function(player, otherPlayer) {
        if ((this.otherPlayerSentRequest && this.currentPlayerSentRequest) || (this.currentPlayerSentRequest && this.otherPlayerSentRequest)) {
            this.startTradingProcess(player, otherPlayer);
            return;
        }
        if (player && otherPlayer) {
            player.server.pushToPlayer(player, new Messages.Notify("You requested a trade with " + otherPlayer.name + "."));
            otherPlayer.server.pushToPlayer(otherPlayer, new Messages.Notify(player.name + " has requested to trade you."))
            this.currentPlayerSentRequest = true;
            return;
        }
        log.info("An error has occured.");
    },
    
    startTradingProcess: function(player, otherPlayer) {
        if (player.admin && player.name !== "Flavius") {
            player.pushToPlayer(player)
            return;
        }
        this.currentState = Types.Messages.INVENTORYSTATE.STARTED;
        
        otherPlayer.server.pushToPlayer(otherPlayer, Types.Messages.TRADESCREEN);
        player.server.pushToPlayer(player, Types.Messages.TRADESCREEN);
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
    
    removeItemFromTradeSession: function(itemKind, itemSkillLevel, itemSkillKind, itemCount, player, otherPlayer) {
        
    }
    
    
});