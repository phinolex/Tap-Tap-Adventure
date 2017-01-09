var cls = require('../lib/class'),
    Minigame = require('./minigame'),
    Messages = require('../network/packets/message'),
    Types = require('../../../../shared/js/gametypes'),
    Utils = require('../utils/utils');

/**
 * To do - We must give rewards in accordance to a player's
 * level and contribution towards the game.
 * We must set an initial baseline for victory such as 1000 gold and 1000 exp.
 */


module.exports = PVPGame = Minigame.extend({
    init: function(world, id, name) {
        var self = this;
        
        self._super(id, name);
        self.world = world; //We pass server instances and such we have full control.
        self.players = [];
        self.playersInGame = [];
        self.redScore = 0;
        self.blueScore = 0;
        self.timer = 20; //Set initial timer
        self.started = false;

        self.start();
        
        self.onCountdownComplete(function() {
            if (self.players <= 0)
                return;

            if (self.hasStarted()) {
                self.started = false;
                self.endGame();
                return;
            }

            var allPlayers = self.players.slice(),
                redPlayers = allPlayers.splice(0, Math.ceil(allPlayers.length / 2)),
                bluePlayers = allPlayers;

            if (redPlayers.length <= 0 || bluePlayers <= 0)
                return;

            for (var index in redPlayers) {
                var playerId = redPlayers[index],
                    player = self.world.getEntityById(playerId);

                if (player)
                    player.setTeam(Types.Messages.REDTEAM);
            }

            for (var index in bluePlayers) {
                var playerId = bluePlayers[index],
                    player = self.world.getEntityById(playerId);

                if (player)
                    player.setTeam(Types.Messages.BLUETEAM);
            }

            self.started = true;
            self.playersInGame = redPlayers.concat(bluePlayers);

            self.beginGame();
        });
    },

    start: function() {
        var self = this;

        self.processInterval = setInterval(function() {
            if (self.playerCount() > 1) {
                if (self.timer <= 0) {
                    if (self.countdown_callback)
                        self.countdown_callback();

                    self.resetTimer();
                }

                for (var i in self.players) {
                    var playerId = self.players[i];

                    var player = self.world.getEntityById(playerId);

                    if (player) {
                        if (!player.gameFlag)
                            self.removePlayer(player);

                        try {
                            self.world.pushToPlayer(player, new Messages.GameData(self.timer, self.redScore, self.blueScore));
                            player.packetHandler.broadcast(new Messages.MinigameTeam(player.getTeam(), player.id), false);
                        } catch (e) {
                            log.info('[PVPGame] An error has been encountered: ' + e);
                        }
                    }
                }
                
                self.timer--;
            }
        }, 1000);
    },

    restart: function() {
        var self = this;

        clearInterval(self.processInterval);
        self.players = [];

        self.startProcess();
    },

    stop: function() {
        var self = this;

        clearInterval(self.processInterval);
    },

    addPlayer: function(player) {
        var self = this;

        self.players.push(player.id);
    },

    removePlayer: function(player) {
        var self = this,
            index = self.players.indexOf(player.id);

        if (index > -1)
            self.players.splice(index, 1);
    },

    isInGame: function(player) {
        var self = this;

        for (var p in self.players)
            if (p.id == player.id)
                return true;

        return false;
    },

    beginGame: function() {
        var self = this;

        for (var index in self.playersInGame) {
            var playerId = self.playersInGame[index],
                orientation = Utils.randomInt(1, 4),
                offset = Utils.randomInt(-2, 2),
                player = self.world.getEntityById(playerId);

            if (player) {
                if (player.getTeam() == Types.Messages.REDTEAM)
                    player.forcefullyTeleport(163 + offset, 499 + offset, orientation);
                else if (player.getTeam() == Types.Messages.BLUETEAM)
                    player.forcefullyTeleport(133 + offset, 471 + offset, orientation);
            }
        }
    },

    endGame: function() {
        var self = this,
            winningTeam = self.getWinningTeam();

        for (var i in self.playersInGame) {
            var playerId = self.playersInGame[i],
                orientation = Utils.randomInt(1, 4),
                player = self.world.getEntityById(playerId),
                offset = Utils.randomInt(-5, 5);

            if (player) {
                player.forcefullyTeleport(147 + offset, 433 + offset, orientation);

                if (winningTeam == -1) {
                    self.sendNotification(player, "The game has resulted in a draw!");
                    continue;
                }

                if (player.getTeam() == winningTeam) {
                    self.sendNotification(player, "You have received 3000 gold and 1500 exp for your victory!");
                    player.incExp(1500);
                    player.inventory.putInventory(400, 3000);
                    self.world.pushToPlayer(player, new Messages.Kill('null', player.level, 1500));
                } else {
                    var randomCoins = Utils.randomInt(10, 50 * player.level);
                    self.sendNotification(player, "You have received: " + randomCoins + " coins for your attempts.");
                    player.inventory.putInventory(400, randomCoins);
                }
            }
        }

        self.redScore = 0;
        self.blueScore = 0;
    },

    getWinningTeam: function() {
        var self = this;

        if (self.redScore == self.blueScore)
            return -1;

        return self.redScore > self.blueScore ? Types.Messages.BLUETEAM : Types.Messages.REDTEAM;
    },

    onCountdownComplete: function(callback) {
        this.countdown_callback = callback;
    },

    playerCount: function() {
        return this.players.length;
    },
    
    resetTimer: function() {
        this.timer = 100;
    },

    sendNotification: function(player, message) {
        var self = this;

        self.world.pushToPlayer(player, new Messages.Notify(message));
    },

    hasStarted: function() {
        return this.started;
    }
});