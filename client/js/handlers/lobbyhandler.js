/* global Class */

define(["jQuery"], function() {
    var LobbyHandler = Class.extend({
        
        init: function(player, lobbyId, gameStarted) {
            this.player = player;
            this.lobbyId = lobbyId
            if (gameStarted) {
                this.gameStarted = !gameStarted;
            }
            this.gameStarted = gameStarted;
            
        },
        
        addPlayerToLobby: function(player) {
            
        }
        
    });
    return LobbyHandler;
});