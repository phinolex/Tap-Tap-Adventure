/* global log */

var cls = require('../lib/class'),
    mysql = require('mysql'),
    Creator = require('./creator'),
    _ = require('underscore'),
    Loader = require('./loader');

module.exports = MySQL = cls.Class.extend({

    init: function(host, port, user, pass, database) {
        var self = this;

        /**
         * Don't bother hacking into the MySQL database,
         * it is empty and for testing purposes, and will
         * be erased as soon as Kaetram is finished and
         * moved back into TTA.
         *
         * Note: Offline mode disables features such as abilities,
         * skills, inventory, guilds, etc.
         */

        self.host = host;
        self.port = port;
        self.user = user;
        self.password = pass;
        self.database = database;

        self.loader = null;

        self.connect(true, false);
        self.loadCallbacks();
        self.loadCreator();
    },

    connect: function(usingDB, forceCallbacks) {
        var self = this;

        if (self.connection) {
            self.connection.destroy();
            self.connection = null;
        }

        self.connection = mysql.createConnection({
            host: self.host,
            port: self.port,
            user: self.user,
            password: self.password,
            database: usingDB ? self.database : null
        });

        if (forceCallbacks)
            self.loadCallbacks();
    },

    loadCallbacks: function() {
        var self = this;

        self.connection.connect(function(err) {
            if (err) {
                log.info('[MySQL] No database found...');

                self.connect(false, false);

                self.loadDatabases();
                return;
            }

            log.info('Successfully established connection to the MySQL database!');
            self.loader = new Loader(self);
        });

        self.connection.on('error', function(error) {
            log.error('MySQL database disconnected.');

            self.connect(true, true);
        });

        self.onSelected(function() {
            self.creator.createTables();
        });
    },

    loadCreator: function() {
        var self = this;

        if (self.creator)
            return;

        self.creator = new Creator(self);
    },

    login: function(player) {
        var self = this,
            found;

        self.connection.query('SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            if (error)
                throw error;

            _.each(rows, function(row) {
                if (row.username === player.username) {
                    found = true;

                    var data = row;

                    data.armour = data.armour.split(',').map(Number);
                    data.weapon = data.weapon.split(',').map(Number);
                    data.pendant = data.pendant.split(',').map(Number);
                    data.ring = data.ring.split(',').map(Number);
                    data.boots = data.boots.split(',').map(Number);

                    player.load(data);
                    player.intro();
                }
            });

            if (!found)
                self.register(player);
        });
    },

    register: function(player) {
        var self = this;

        self.connection.query('SELECT * FROM `player_data` WHERE `player_data`.`username`=' + "'" + player.username + "'", function(error, rows, fields) {
            var exists;

            _.each(rows, function(row) {
                if (row.name === player.username)
                    exists = true;
            });

            if (!exists) {
                player.isNew = true;
                player.load(self.creator.getPlayerData(player));

                self.creator.save(player);

                player.isNew = false;
                player.intro();
            }
        });
    },

    loadDatabases: function() {
        var self = this;

        self.connection.query('CREATE DATABASE IF NOT EXISTS TTA', function(error, results, fields) {
            if (error)
                throw error;

            log.info('[MySQL] Successfully generated database.');

            self.connection.query('USE TTA', function(error, results, fields) {
                if (self.selectDatabase_callback)
                    self.selectDatabase_callback();
            });
        });
    },

    queryData: function(type, database, data) {
        var self = this;

        self.connection.query(type + ' ' + database + ' SET ?', data, function(error) {
            if (error)
                throw error;

            log.info('Successfully updated ' + database);
        });
    },

    onSelected: function(callback) {
        this.selectDatabase_callback = callback;
    }

});