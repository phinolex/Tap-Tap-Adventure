var cls = require('./../../../lib/class'),
    MobData = require('./../../../utils/data/mobdata.js'),
    Messages = require('./../../../network/packets/message.js');

module.exports = Party = Class.extend({
    init: function(server, host, firstPlayer) {
        var self = this;

        self.server = server;
        self.players = [host, firstPlayer];
        self.assignParty();

        self.leader = host;

        self.updateMembers();
    },

    assignParty: function() {
        var self = this;

        for (var p in self.players) {
            var player = self.players[p];

            if (player.party)
                player.party.removePlayer(player);

            player.party = self;
        }
    },

    addPlayer: function(player) {
        var self = this;

        if (player) {
            self.players.push(player);
            if (player.party)
                player.party.removePlayer(player);

            player.party = self;
        }

        self.updateMembers();
    },

    removePlayer: function(player) {
        var self = this,
            wasLeader = false;

        if (player) {
            for (var i = 0; i < self.players; i++) {
                if (player === self.players[i]) {
                    if (player == self.leader)
                        wasLeader = true;

                    self.players[i].send([Types.Messages.PARTY]);
                    self.players[i].party = null;
                    self.players.splice(i, 1);
                    self.updateMembers();
                    break;
                }
            }

            if (wasLeader)
                self.leader = self.players[0];
        }
    },

    updateMembers: function() {
        var self = this,
            messageArray = [Types.Messages.PARTY];

        if (self.players > 1) {
            for (var player in self.players)
                messageArray.push(self.players[player].name);
        }
        
        self.pushToMembers(new Messages.Party(messageArray));
    },

    pushToMembers: function(message) {
        var self = this;

        /**
         * This will be used in the future to send messages
         * to the party itself, something you want only
         * the members in the party to receive.
         */

        for (var player in self.players)
            self.server.pushToPlayer(self.players[player], message);
    },

    getTotalLevel: function() {
        var self = this
            total = 0;

        for (var player in self.players)
            total += self.players[player].level;

        return total;
    },

    incExp: function(mob) {
        var self = this,
            total = self.getTotalLevel(),
            mobExp = MobData[mob.kidn].xp * ((10 + self.players.length) / 10);

        for (var p in self.players) {
            var player = self.players[p];

            var exp = Math.ceil(exp * (player.level + 1) / totalLevel);

            player.incExp(exp);

            self.server.pushToPlayer(player, new Messages.Kill(mob, player.level, exp));
        }
    },

    getHighestLevel: function() {
        var self = this,
            highestLevel = 0;

        for (var p in self.players) {
            var player = self.players[p];

            if (highestLevel < player.level)
                highestLevel = player.level;
        }

        return highestLevel;
    },

    getLowestLevel: function() {
        var self = this,
            lowestLevel = 999;

        for (var p in self.players) {
            var player = self.players[p];

            if (lowestLevel > player.level)
                lowestLevel = player.level;
        }
    }
});