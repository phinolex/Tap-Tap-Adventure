/* global log */
var cls = require("../lib/class"),
  mysql = require("mysql"),
  Creator = require("./creator"),
  _ = require("underscore"),
  Loader = require("./loader"),
  Config = require("../../config.json");

module.exports = MySQL = cls.Class.extend({
  constructor(host, port, user, pass, database) {
    

    /**
     * Main file for MySQL, it splits into Creator and Loader.
     * Responsible for creating and loading data, respectively.
     */
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = pass;
    this.database = database;

    this.loader = null;

    this.connect(
      true,
      false
    );

    this.loadCreator();
    this.loadCallbacks();
  },

  connect(usingDB, forceCallbacks) {
    

    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }

    this.connection = mysql.createConnection({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: usingDB ? this.database : null
    });

    if (forceCallbacks) this.loadCallbacks();
  },

  loadCallbacks() {
    

    this.connection.connect(function(err) {
      if (err) {
        log.info("[MySQL] No database found...");
        this.connect(
          false,
          false
        );
        this.loadDatabases();
        return;
      }

      this.creator.createTables();
      log.info("Successfully established connection to the MySQL database!");
      this.loader = new Loader(self);
    });

    this.connection.on("error", function(error) {
      log.error("MySQL database disconnected.");

      this.connect(
        true,
        true
      );
    });

    this.onSelected(function() {
      this.creator.createTables();
    });
  },

  loadCreator() {
    

    if (this.creator) return;

    this.creator = new Creator(self);
  },

  login(player, guest) {
    var self = this,
      found;

    log.info("Initiating login for: " + player.username);

    this.connection.query(
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
          this.register(player);
        } else if (!found) {
          log.info("Mysql.login(player) failed for " + player.username);
          player.invalidLogin();
        }
      }
    );
  },

  register(player) {
    

    this.connection.query(
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
          player.load(this.creator.getPlayerData(player));

          this.creator.save(player);

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
      this.connection.query(
        "DELETE FROM `" + table + "` WHERE `" + table + "`.`" + "username`=?",
        [player.username],
        function(error) {
          if (error) log.error("Error while deleting user: " + player.username);
        }
      );
    });
  },

  loadDatabases() {
    

    log.info("[MySQL] Creating database....");

    this.connection.query(
      "CREATE DATABASE IF NOT EXISTS " + Config.mysqlDatabase,
      function(error, results, fields) {
        if (error) throw error;

        log.info("[MySQL] Successfully created database.");

        this.connection.query("USE " + Config.mysqlDatabase, function(
          error,
          results,
          fields
        ) {
          if (this.selectDatabase_callback) this.selectDatabase_callback();
        });
      }
    );
  },

  queryData(type, database, data) {
    

    this.connection.query(type + " " + database + " SET ?", data, function(
      error
    ) {
      if (error) throw error;

      log.info("Successfully updated " + database);
    });
  },

  alter(database, column, type) {
    

    this.connection.query(
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
