/* global log */
var cls = require("../lib/class"),
  mysql = require("mysql"),
  Creator = require("./creator"),
  _ = require("underscore"),
  Loader = require("./loader"),
  Config = require("../../config.json");

module.exports = MySQL = cls.Class.extend({
  init(host, port, user, pass, database) {
    var self = this;

    /**
     * Main file for MySQL, it splits into Creator and Loader.
     * Responsible for creating and loading data, respectively.
     */
    self.host = host;
    self.port = port;
    self.user = user;
    self.password = pass;
    self.database = database;

    self.loader = null;

    self.connect(
      true,
      false
    );

    self.loadCreator();
    self.loadCallbacks();
  },

  connect(usingDB, forceCallbacks) {
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

    if (forceCallbacks) self.loadCallbacks();
  },

  loadCallbacks() {
    var self = this;

    self.connection.connect(function(err) {
      if (err) {
        log.info("[MySQL] No database found...");
        self.connect(
          false,
          false
        );
        self.loadDatabases();
        return;
      }

      self.creator.createTables();
      log.info("Successfully established connection to the MySQL database!");
      self.loader = new Loader(self);
    });

    self.connection.on("error", function(error) {
      log.error("MySQL database disconnected.");

      self.connect(
        true,
        true
      );
    });

    self.onSelected(function() {
      self.creator.createTables();
    });
  },

  loadCreator() {
    var self = this;

    if (self.creator) return;

    self.creator = new Creator(self);
  },

  login(player, guest) {
    var self = this,
      found;

    log.info("Initiating login for: " + player.username);

    self.connection.query(
      "SELECT * FROM `player_data`, `player_equipment` WHERE `player_data`.`username`= ? AND `player_data`.`password`= ?",
      [player.username, player.password],
      function(error, rows, fields) {
        if (error) {
          log.error(error);
          throw error;
        }

        _.each(rows, function(row) {
          if (row.username === player.username) {
            found = true;

            var data = row;

            data.armour = data.armour.split(",").map(Number);
            data.weapon = data.weapon.split(",").map(Number);
            data.pendant = data.pendant.split(",").map(Number);
            data.ring = data.ring.split(",").map(Number);
            data.boots = data.boots.split(",").map(Number);

            player.load(data);
            player.intro();
          }
        });

        if (player.isGuest) {
          // register the guest account
          self.register(player);
        } else if (!found) {
          log.info("Mysql.login(player) failed for " + player.username);
          player.invalidLogin();
        }
      }
    );
  },

  register(player) {
    var self = this;

    self.connection.query(
      "SELECT * FROM `player_data` WHERE `player_data`.`username`= ?",
      [player.username],
      function(error, rows, fields) {
        var exists;

        if (error) {
          log.error(error);
          throw error;
        }

        _.each(rows, function(row) {
          if (row.name === player.username) exists = true;
        });

        if (!exists) {
          log.info("No player data found for: " + player.username);

          player.isNew = true;
          player.load(self.creator.getPlayerData(player));

          self.creator.save(player);

          player.isNew = false;
          player.intro();
        } else {
          log.info("MySQL.register(player) Error: Username already exists.");
          player.notify("This username is already taken!");
        }
      }
    );
  },

  delete(player) {
    var self = this,
      tables = [
        "player_data",
        "player_equipment",
        "player_inventory",
        "player_abilities",
        "player_bank",
        "player_quests",
        "player_achievements"
      ];

    _.each(tables, function(table) {
      self.connection.query(
        "DELETE FROM `" + table + "` WHERE `" + table + "`.`" + "username`=?",
        [player.username],
        function(error) {
          if (error) log.error("Error while deleting user: " + player.username);
        }
      );
    });
  },

  loadDatabases() {
    var self = this;

    log.info("[MySQL] Creating database....");

    self.connection.query(
      "CREATE DATABASE IF NOT EXISTS " + Config.mysqlDatabase,
      function(error, results, fields) {
        if (error) throw error;

        log.info("[MySQL] Successfully created database.");

        self.connection.query("USE " + Config.mysqlDatabase, function(
          error,
          results,
          fields
        ) {
          if (self.selectDatabase_callback) self.selectDatabase_callback();
        });
      }
    );
  },

  queryData(type, database, data) {
    var self = this;

    self.connection.query(type + " " + database + " SET ?", data, function(
      error
    ) {
      if (error) throw error;

      log.info("Successfully updated " + database);
    });
  },

  alter(database, column, type) {
    var self = this;

    self.connection.query(
      "ALTER TABLE " + database + " ADD " + column + " " + type,
      function(error, results, fields) {
        if (error) {
          log.error("Malformation in the database type and/or type.");
          return;
        }

        log.info("Database " + database + " has been successfully altered.");
      }
    );
  },

  onSelected(callback) {
    this.selectDatabase_callback = callback;
  }
});
