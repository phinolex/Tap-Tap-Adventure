var cls = require("./lib/class");

/* global Lobby, World, databaseHandler */

module.exports = Lobby = World.extend({
    init: function(playerId, player, lobbyId, isLoggingIn, playersOnline) {
        var self = this;
        self.playerId = playerId;
        self.lobbyId = lobbyId;
        self.isLoggingIn = isLoggingIn;
        self.playersOnline = playersOnline;
        self.hasLoggedIn = false;
        self.lobbyPlayers = {};
        self.loadInfo(player);
    },

    loadInfo: function(player) {
        if (this.server) {
            this.sendPlayerToLobby(player);
            
            this.playerName = player.name;
            
            if (player && player.id && !this.hasLoggedIn) {
                this.hasLoggedIn = true;
                databaseHandler.loadPlayer(player);
                
            }
        }  
    },
    
    updatePlayerCount: function() {
        var playersUpdate = this.server.getPlayerCount();
        this.playersOnline = playersUpdate;
    },
    sendPlayerToLobby: function(player) {
        this.lobbyPlayers.push(player);
        this.loadPlayerHighscores();
        this.loadWorldCount();
    },
    
    getPlayerByNameInLobby: function(name) {
        for(var id in this.lobbyPlayers) {
            if(this.lobbyPlayers[id].name === name){
                return this.lobbyPlayers[id];
            }
        }
        return null;
    },
    getPlayerCountInLobby: function() {
        var count = 0
            for (var pl in this.lobbyPlayers) {
                if (this.lobbyPlayers.hasOwnProperty(pl)) {
                    count++;
                }
            }
        
        
        return count;
    },
    addPlayerFriends: function(player) {
        
    },
    
    loadPlayerFriendList: function(player) {
        
    
    },
    
    loadPlayerIgnores: function() {
        
          
    },
    
    loadPlayerHighscores: function() {
        databaseHandler.loadHighscores();
    },
    
    loadLobbyCount: function() {
        var lobbyCount = this.getPlayerCountInLobby();
        return lobbyCount;
    },
    
    loadWorldCount: function() {
        if (this.playersOnline != 0) {
            setInterval(function() {
                this.updatePlayerCount();
            }, 1500);
        }
    }
    
    
});