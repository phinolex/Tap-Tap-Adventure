/**
 * Created by flavius on 2017-01-07.
 */
var Minigame = require('./minigame')

/**
 * We will have to draw an interface with all the players,
 * and it has to be scrollable. After we redo the CSS with less.
 */

module.exports = KingOfTheHill = Minigame.extend({
    init: function(world, id, name) {
        var self = this;

        self._super(id, name);
        self.winnerIndex = null;
        self.scoreThreshold = 0;
        self.started = false;
        self.world = world;
        self.players = [];
        self.scores = [];
        self.timer = 100;
        self.name = name;

        self.start();

        self.onFinishedCountdown(function() {
            log.info("Countdown finished");

            if (!self.started) {
                self.initializeScoreBoard();


            } else
                self.distributeRewards(self.getWinnerIndex());
        });
    },

    start: function() {
        var self = this;

        self.processInterval = setInterval(function() {
            if (self.players.length > 1) {
                if (self.timer <= 0)
                    if (self.finished_callback)
                        self.finished_callback();


                for (var index in self.players) {
                    var player = self.world.getEntityById(self.players[index]);
                    
                    if (player.kothLobby || player.kothGame) {

                        /**
                         * Just continue with the update here..
                         */

                    }
                }

                self.timer--;
            }
        }, 1000);
    },

    stop: function() {
        clearInterval(this.processInterval);
    },

    addPlayer: function(player) {
        var self = this;

        self.players.push(player.id);
    },

    initializeScoreBoard: function() {
        var self = this;

        for (var i in self.players)
            self.scores.push(0);

    },

    getPlayerScore: function(player) {
        var self = this,
            index = self.getPlayerIndex(player);

        return index != -1 ? self.players[index] : -1;
    },

    getPlayerIndex: function(player) {
        var self = this;

        for (var i in self.players) {
            if (self.players[i] == player.id)
                return i;
        }

        return -1;
    },

    getWinnerIndex: function() {
        var self = this,
            highest = 0;

        for (var index in self.scores) {
            if (self.scores[index] > highest)
                highest = self.scores[index];
        }

        return self.scores.indexOf(highest);
    },

    distributeRewards: function(winnerIndex) {
        var self = this;

        //We give the highest reward to the winner.

        for (var index in self.players) {
            var player = self.players[index];

            if (index == winnerIndex) {

            } else {

            }
        }
    },

    finishGame: function() {
        var self = this;

        self.scores = [];
        self.initializeScoreBoard();
    },

    removePlayer: function(player) {
        var self = this,
            index = self.players.indexOf(player.id);

        if (index > -1) {
            self.players.splice(index, 1);
            self.scores.splice(index, 1);
        }
    },

    sendNotification: function(player, message) {
        var self = this;


    },

    onFinishedCountdown: function(callback) {
        this.finished_callback = callback;
    }
});