var cls = require("./lib/class"),
    Types = require("../../shared/js/gametypes");

/* global Trade */

module.exports = Trade = cls.Class.extend({
    init: function(player, otherPlayer, itemKind, itemSkillKind, itemSkillLevel, itemCount, newPlayer) {
        this.player = player;
        this.otherPlayer = otherPlayer;
        this.itemKind = itemKind;
        this.itemSkillKind = itemSkillKind;
        this.itemSkillLevel = itemSkillLevel;
        this.itemCount = itemCount;
        this.newPlayer = newPlayer;

    },
    
    startTradingProcess: function() {
        if (this.newPlayer) {
            this.player.send([Types.Messages.NOTIFY, "You can only trade after 24 hours"]);
            return;
        }
        
        
        
    }
    
});