/* global module, log */

var cls = require("./lib/class"),
    Player = require("./player"),
    mysql = require("mysql"),
    Messages = require("../message"),
    bcrypt = require("bcrypt"),
    inventory = require("../inventory"),
    Utils = require('../utils');
    
    
  module.exports = Mysql = cls.Class.extend({
        init: function() {
            var self = this;

            self.mysqlConnection = mysql.createConnection ({
                host: "127.0.0.1",
                user: "root",
                password: "Demise255",
                database: "tta_main",
            });

            self.mysqlConnection.connect(function(err) {
                if (err) {
                    log.info("An error has occured whilst establishing connection to the MYSQL Server.");
                    log.info("Details: " + err);
                    return;
                }

                log.info("Successfully connected to the MySQL server.");
            });

            self.playerDatabase = "players";
            self.miscellaneousDatabase = "info";
        },
        
        loadPlayer: function(player) {
            var self = this;

            self.mysqlConnection.query('select * from ' + self.playerDatabase + ' where user=' + player.name, function(err, results) {
                if (err) {
                    log.info("An error has occured whilst loading player: " + player.name + " error: " + err);
                    return;
                }
                var playerData = results;

                var armour = results[0].value,
                    weapon = results[1].value;

                /**
                 * db_player.armor,
                 db_player.weapon,
                 db_player.exp,
                 db_player.bannedTime,
                 db_player.banUseTime,
                 db_player.x,
                 db_player.y,
                 db_player.chatBanEndTime,
                 db_player.rank,
                 db_player.armorEnchantedPoint,
                 db_player.armorSkillKind,
                 db_player.armorSkillLevel,
                 db_player.weaponEnchantedPoint,
                 db_player.weaponSkillKind,
                 db_player.weaponSkillLevel,
                 db_player.pendant,
                 db_player.pendantEnchantedPoint,
                 db_player.pendantSkillKind,
                 db_player.pendantSkillLevel,
                 db_player.ring,
                 db_player.ringEnchantedPoint,
                 db_player.ringSkillKind,
                 db_player.ringSkillLevel,
                 db_player.boots,
                 db_player.bootsEnchantedPoint,
                 db_player.bootsSkillKind,
                 db_player.bootsSkillLevel,
                 db_player.membership,
                 db_player.membershipTime,
                 db_player.kind,
                 db_player.rights,
                 db_player.pClass);
                 */
            });
        },

        createPlayer: function(player) {
            var self = this;
            var currentTime = new Date().getTime(); //Registration Time

            self.mysqlConnection.query('select * from ' + self.playerDatabase + ' where user=' + player.name, function(err, results) {
                if (err) {
                    log.info("Player doesn't exist, continuing the creation process.");
                    self.mysqlConnection.query('select * from ' + self.miscellaneousDatabase + ' where connection=' + player.connection, function(err, results) {
                        if (err)
                            log.info("No background info on connection.");
                        else {
                            log.info(results); //Finish up IP Ban
                        }

                    });


                    var username = player.name,
                        password = player.pw,
                        email = player.email,
                        armour = null,
                        weapon = null,
                        exp = 0,
                        ban = null,
                        mute = null,
                        x = player.x,
                        y = player.y,
                        rank = 0,
                        armourEnchantedPoints = 0,
                        armourSkillKind = 0,
                        armourSkillLevel = 0,
                        weaponEnchantedPoints = 0,
                        weaponSkillKind = 0,
                        weaponSkillLevel = 0,
                        pendant = null,
                        pendantEnchantedPoints = 0,
                        pendantSkillKind = 0,
                        pendantSkillLevel = 0,
                        ring = null,
                        ringEnchantedPoints = 0,
                        ringSkillKind = 0,
                        ringSkillLevel = 0,
                        boots = null,
                        bootsEnchantedPoints = 0,
                        bootsSkillKind = 0,
                        bootsSkillLevel = 0,
                        membership = 0,
                        membershipTime = null,
                        kind = 0,
                        rights = 0,
                        pClass = player.pClass;

                    self.mysqlConnection.query('insert into ' + self.playerDatabase + ' (username, password, email, armour, weapon, pClass) values('
                        + '"' + username + '",'
                        + '"' + password + '",'
                        + '"' + email + '",'
                        + '"' + armour + '",'
                        + '"' + weapon + '",'
                        + '"' + exp + '",'
                        + '"' + ban + '",'
                        + '"' + mute + '",'
                        + '"' + x + '",'
                        + '"' + y + '",'
                        + '"' + rank + '",'
                        + '"' + armourEnchantedPoints + '",'
                        + '"' + armourSkillKind + '",'
                        + '"' + armourSkillLevel + '",'
                        + '"' + weaponEnchantedPoints + '",'
                        + '"' + weaponSkillKind + '",'
                        + '"' + weaponSkillLevel + '",'
                        + '"' + pendant + '",'
                        + '"' + pendantEnchantedPoints + '",'
                        + '"' + pendantSkillKind + '",'
                        + '"' + pendantSkillLevel + '",'
                        + '"' + ring + '",'
                        + '"' + ringEnchantedPoints + '",'
                        + '"' + ringSkillKind + '",'
                        + '"' + ringSkillLevel + '",'
                        + '"' + boots + '",'
                        + '"' + bootsEnchantedPoints + '",'
                        + '"' + bootsSkillKind + '",'
                        + '"' + bootsSkillLevel + '",'
                        + '"' + membership + '",'
                        + '"' + membershipTime + '",'
                        + '"' + kind + '",'
                        + '"' + rights + '",'
                        + '"' + pClass + '");'
                    );

                    player.sendWelcome(armour, weapon, 0,
                        null, null, player.x, player.y, null, 0,
                        0, 0, 0,
                        0, 0, 0,
                        null, 0, 0, 0,
                        null, 0, 0, 0,
                        null, 0, 0, 0,
                        0, null, 1, 0, pClass);


        } else {
                    player.connection.sendUTF8('userexists');
                    player.connection.close('Username is in use: ' + player.name);
                }
            });
        },
        
        getPlayerPurchase: function(player) {
            
        }
      
  });
