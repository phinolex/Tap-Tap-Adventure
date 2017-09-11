/* global log */

var cls = require('../lib/class');

module.exports = Loader = cls.Class.extend({

    init: function(mysql) {
        var self = this;

        self.mysql = mysql;
    },

    getInventory: function(player, callback) {
        var self = this;

        self.mysql.connection.query('SELECT * FROM `player_inventory` WHERE `player_inventory`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var info = rows.shift();

            if (info.username !== player.username)
                log.info('Mismatch whilst retrieving inventory data for: ' + player.username);

            callback(info.ids.split(' '), info.counts.split(' '), info.abilities.split(' '), info.abilityLevels.split(' '));

        });
    },

    getBank: function(player, callback) {
        var self = this;

        self.mysql.connection.query('SELECT * FROM `player_bank` WHERE `player_bank`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var info = rows.shift();

            if (info.username !== player.username)
                log.info('Mismatch whilst retrieving bank data for: ' + player.username);

            callback(info.ids.split(' '), info.counts.split(' '), info.abilities.split(' '), info.abilityLevels.split(' '));
        });
    },

    getQuests: function(player, callback) {
        var self = this;

        self.mysql.connection.query('SELECT * FROM `player_quests` WHERE `player_quests`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var info = rows.shift();

            if (info.username !== player.username)
                log.info('Mismatch whilst retrieving quest data for: ' + player.username);

            callback(info.ids.split(' '), info.stages.split(' '));
        });
    },

    getAchievements: function(player, callback) {
        var self = this;

        self.mysql.connection.query('SELECT * FROM `player_achievements` WHERE `player_achievements`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var info = rows.shift();

            if (info.username !== player.username)
                log.info('Mismatch whilst retreiving achievement data for: ' + player.username);

            callback(info.ids.split(' '), info.progress.split(' '));
        });
    }

});