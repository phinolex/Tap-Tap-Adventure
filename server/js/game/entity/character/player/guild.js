var cls = require('../../../../lib/class'),
    fs = require('fs'),
    Guilds = require('../../../../../data/guilds.json');

module.exports = Guild = cls.Class.extend({

    init: function(name, leader) {
        var self = this;

        self.name = name;
        self.leader = leader;

        self.members = [];

        self.connected = false;
    },

    create: function() {

    },

    add: function(player) {
        var self = this;

        self.members.push(player);

        self.save();
    },

    save: function() {
        var self = this;

        log.info(Guilds[self.leader.username]);


    }


});