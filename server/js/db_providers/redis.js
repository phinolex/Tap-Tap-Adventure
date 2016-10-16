/* global Types, log, client */

var Utils = require('../utils');

var cls = require("../lib/class"),
    Player = require('../player'),
    Messages = require("../message"),
    redis = require("redis"),
    bcrypt = require("bcrypt"),
    ItemTypes = require("../../../shared/js/itemtypes"),
    Achievements = require('../achievements'),
    inventory = require("../inventory");

module.exports = DatabaseHandler = cls.Class.extend({
    init: function(config){
        client = redis.createClient(config.redis_port, config.redis_host, {socket_nodelay: true});
        client.auth("ki24SimpleYetMisleading009109256256");
    },

    updatePassword: function (player) {
        var userKey = "u:" + player.name;
        client.smembers("usr", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === player.name){
                    client.multi()
                        .hget(userKey, "pw") // 0

                        .exec(function(err, replies){
                            // Check Password
                            log.info("name: " + player.name+", oldpassword: " + player.pw + ", dbpassword" + replies[0]);
                            bcrypt.compare(player.pw, replies[0], function(err, res) {
                                if(!res) {
                                    player.connection.sendUTF8("invalidlogin");
                                    player.connection.close("Wrong Password: " + player.name);
                                } else {
                                    client.hset(userKey, "pw", player.newpw);
                                    log.info("passwordChanged:" + player.newpw);
                                    player.connection.sendUTF8("passwordChanged");
                                }
                            });
                        });
                }
            }
        });
    },

    loadPlayer: function(player) {
        var self = this;
        var userKey = "u:" + player.name;
        var curTime = new Date().getTime();
        client.smembers("usr", function(err, replies) {
            for(var index = 0; index < replies.length; index++) {
                if(replies[index].toString() === player.name){
                    client.multi()
                        .hget(userKey, "pw") // 0
                        .hget(userKey, "armor") // 1
                        .hget(userKey, "weapon") // 2
                        .hget(userKey, "exp") // 3
                        .hget("b:" + player.connection._connection.remoteAddress, "time") // 4
                        .hget("b:" + player.connection._connection.remoteAddress, "banUseTime") // 5
                        .hget("b:" + player.connection._connection.remoteAddress, "loginTime") // 6
                        .hget(userKey, "x") // 7
                        .hget(userKey, "y") // 8
                        .hget("cb:" + player.connection._connection.remoteAddress, "etime") // 9
                        .hget("b:" + player.connection._connection.remoteAddress, "rtime") //10
                        .zrevrank("ranking", player.name) // 11
                        .hget(userKey, "armorEnchantedPoint")        // 12
                        .hget(userKey, "armorkillKind")              // 13
                        .hget(userKey, "armorSkillLevel")            // 14
                        .hget(userKey, "weaponEnchantedPoint")       // 15
                        .hget(userKey, "weaponSkillKind")            // 16
                        .hget(userKey, "weaponSkillLevel")           // 17
                        .hget(userKey, "pendant")                    // 18
                        .hget(userKey, "pendantEnchantedPoint")      // 19
                        .hget(userKey, "pendantSkillKind")           // 20
                        .hget(userKey, "pendantSkillLevel")          // 21
                        .hget(userKey, "ring")                       // 22
                        .hget(userKey, "ringEnchantedPoint")         // 23
                        .hget(userKey, "ringSkillKind")              // 24
                        .hget(userKey, "ringSkillLevel")             // 25
                        .hget(userKey, "boots")                      // 26
                        .hget(userKey, "bootsEnchantedPoint")        // 27
                        .hget(userKey, "bootsSkillKind")             // 28
                        .hget(userKey, "bootsSkillLevel")            // 29
                        .hget(userKey, "membership")                 // 30
                        .hget(userKey, "membershipTime")             // 31
                        .hget(userKey, "membershipUseTime")          // 32
                        .hget(userKey, "membershipLoginTime")        // 33
                        .hget(userKey, "membershipRemainingTime")    // 34
                        .hget(userKey, "kind")                       // 35
                        .hget(userKey, "rights")                     // 36
                        .hget(userKey, "class")			     // 37
                        .hget(userKey, "poisoned")
                        .hget(userKey, "hitpoints")
                        .hget(userKey, "mana")


                        //.get(userKey, "userGuild")
                        /*
                         * Add a .hget here to select the guild the player is in, use
                         * the other ones above similarily.
                         * .hget(userKey, "guild")
                         *
                         */

                        .exec(function(err, replies){

                            var db_player = {
                                "pw":replies[0],
                                "armor": replies[1],
                                "weapon": replies[2],
                                "exp": Utils.NaN2Zero(replies[3]),
                                "bannedTime": Utils.NaN2Zero(replies[4]),
                                "banUseTime": Utils.NaN2Zero(replies[5]),
                                "lastLoginTime": Utils.NaN2Zero(replies[6]),
                                "x": Utils.NaN2Zero(replies[7]),
                                "y": Utils.NaN2Zero(replies[8]),
                                "chatBanEndTime": Utils.NaN2Zero(replies[9]),
                                "banTime": replies[10],
                                "rank": isNaN(parseInt(replies[11])) ? 0 : parseInt(replies[11]),
                                "armorEnchantedPoint": Utils.NaN2Zero(replies[12]),
                                "armorSkillKind": Utils.NaN2Zero(replies[13]),
                                "armorSkillLevel": Utils.NaN2Zero(replies[14]),
                                "weaponEnchantedPoint": Utils.NaN2Zero(replies[15]),
                                "weaponSkillKind": Utils.NaN2Zero(replies[16]),
                                "weaponSkillLevel": Utils.NaN2Zero(replies[17]),
                                "pendant": replies[18],
                                "pendantEnchantedPoint": Utils.NaN2Zero(replies[19]),
                                "pendantSkillKind": Utils.NaN2Zero(replies[20]),
                                "pendantSkillLevel": Utils.NaN2Zero(replies[21]),
                                "ring": replies[22],
                                "ringEnchantedPoint": Utils.NaN2Zero(replies[23]),
                                "ringSkillKind": Utils.NaN2Zero(replies[24]),
                                "ringSkillLevel": Utils.NaN2Zero(replies[25]),
                                "boots": replies[26],
                                "bootsEnchantedPoint": Utils.NaN2Zero(replies[27]),
                                "bootsSkillKind": Utils.NaN2Zero(replies[28]),
                                "bootsSkillLevel": Utils.NaN2Zero(replies[29]),
                                "membership": Utils.NaN2Zero(replies[30]),
                                "membershipTime": replies[31],
                                "membershipUseTime": replies[32],
                                "membershipLoginTime": replies[33],
                                "membershipRemainingTime": replies[34],
                                "kind": Utils.NaN2Zero(replies[35]) === 222 ? 222 : 1,
                                "rights": Utils.NaN2Zero(replies[36]),
                                "pClass": Utils.NaN2Zero(replies[37]),
                                "poisoned": replies[38],
                                "hitpoints": Utils.NaN2Zero(replies[39]),
                                "mana": Utils.NaN2Zero(replies[40])
                            };


                            var curTime = new Date();
                            //Check ban here

                            if(db_player.banTime > curTime){

                                player.connection.sendUTF8("ban");

                                player.connection.close("Closing connection to: " + player.name);

                                return;
                            }

                            if (db_player.membershipTime > curTime) {

                                player.membership = true;

                            }


                            var d = new Date();
                            var lastLoginTimeDate = new Date(db_player.lastLoginTime);


                            // Check Ban
                            d.setDate(d.getDate() - d.getDay());
                            d.setHours(0, 0, 0);
                            if(db_player.lastLoginTime < d.getTime()){
                                bannedTime = 0;
                                client.hset("b:" + player.connection._connection.remoteAddress, "time", db_player.bannedTime);
                            }
                            client.hset("b:" + player.connection._connection.remoteAddress, "loginTime", curTime);


                            player.sendWelcome(
                                db_player.armor,
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
                                db_player.pClass,
                                db_player.poisoned,
                                db_player.hitpoints,
                                db_player.mana);
                        });
                    return;
                }
            }
            self.createPlayer(player);
        });
    },

    changePlayerClass: function(player) {
        client.hset("u:" + player.name, "class", player.pClass);
    },

    capitalizeFirstLetter: function(string) {

        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    createPlayer: function(player) {

        var userKey = "u:" + player.name;
        var curTime = new Date().getTime();

        // Check if username is taken
        client.sismember('usr', player.name, function(err, reply) {
            if(reply === 1) {
                player.connection.sendUTF8("userexists");
                player.connection.close("Username not available: " + player.name);
            } else {
                // Add the player
                //this.checkBan(player);
                var startWeapon = "";
                var startArmor = "";

                client.multi()

                    .sadd("usr", player.name)
                    .hset(userKey, "pw", player.pw)
                    .hset(userKey, "email", player.email)
                    .hset(userKey, "armor", startArmor)
                    .hset(userKey, "weapon", startWeapon)
                    .hset(userKey, "exp", 0)
                    .hset("b:" + player.connection._connection.remoteAddress, "loginTime", curTime)
                    .hget("b:" + player.connection._connection.remoteAddress, "rtime") //9
                    .hset(userKey, "class", "")
                    .hset(userKey, "rights", 0)

                    .exec(function(err, replies){
                        var banTime = 0;
                        var curTime = new Date().getTime();

                        if(banTime > curTime){

                            player.connection.sendUTF8("ban");

                            player.connection.close("Closing connection to: " + player.name);

                            return;
                        }

                        
                        player.sendWelcome(
                            startArmor, 
                            startWeapon, 
                            0,
                            null, 
                            null, 
                            player.x, 
                            player.y, 
                            null, 
                            0,
                            0,
                            0, 
                            0,
                            0,
                            0,
                            0,
                            null,
                            0,
                            0,
                            0,
                            null,
                            0, 
                            0, 
                            0,
                            null,
                            0, 
                            0,
                            0,
                            0, 
                            null,
                            1, 
                            0,
                            player.pClass,
                            false,
                            40,
                            10);


                    });
            }
        });
    },




    checkBan: function(player) {
        log.info("Name: " + player.name + "IP: " + player.connection._connection.remoteAddress);

        client.smembers("ipban", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === player.connection._connection.remoteAddress){

                    client.multi()
                        .hget("b:" + player.connection._connection.remoteAddress, "rtime")
                        .hget("b:" + player.connection._connection.remoteAddress, "time")

                        .exec(function(err, replies){
                            var curTime = new Date();
                            var banEndTime = new Date(replies[0]*1);
                            var posX = replies[2];
                            var posY = replies[3];
                            log.info("curTime: " + curTime.toString());
                            log.info("banEndTime: " + banEndTime.toString());

                            log.info("X: " + player.x + " y: " + player.y);
                            if(banEndTime.getTime() > curTime.getTime()){

                                player.connection.sendUTF8("ban");

                                player.connection.close("Closing connection to: " + player.name);
                                return;
                            }
                        });
                    return;
                }
            }
        });
    },

    banPlayer: function(adminPlayer, banPlayer, days){
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name) {

                    var curTime = (new Date()).getTime();
                    client.sadd("ipban", banPlayer.connection._connection.remoteAddress);
                    adminPlayer.server.pushBroadcast(new Messages.Chat(banPlayer, "/1 " + adminPlayer.name + " has banned " + banPlayer.name + " for " + days + "days"));
                    setTimeout( function(){ banPlayer.connection.close("Added IP Banned player: " + banPlayer.name + " " + banPlayer.connection._connection.remoteAddress); }, 500);
                    client.hset("b:" + banPlayer.connection._connection.remoteAddress, "rtime", (curTime+(days*24*60*60*1000)).toString());
                    if (days !== 0) {
                        banPlayer.chatBanEndTime = curTime + (days*24*60*60*1000);
                    } else {
                        adminPlayer.server.pushBroadcast(new Messages.NOTIFY(adminPlayer, "An error has occured whilst processing the command"));
                    }
                    client.hset("cb:" + banPlayer.connection._connection.remoteAddress, "etime", (banPlayer.chatBanEndTime).toString());
                    log.info(adminPlayer.name + "-- BAN ->" + banPlayer.name + " to " + (new Date(curTime+(days*24*60*60*1000)).toString()));
                    return;
                }
            }
        });
    },
    unmute: function(adminPlayer, targetPlayer) {
        client.smembers("adminname" || "moderators", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){
                    var curTime = (new Date()).getTime();
                    adminPlayer.server.pushBroadcast(new Messages.Chat(targetPlayer, "/1 " + adminPlayer.name + " unmuted " + targetPlayer.name + "."));
                    targetPlayer.chatBanEndTime = curTime - 1;
                    client.hset("cb:" + targetPlayer.connection._connection.remoteAddress, "etime", (targetPlayer.chatBanEndTime).toString());
                    log.info(adminPlayer.name + "-- Chatting UNBAN ->" + targetPlayer.name + " to " + (new Date(targetPlayer.chatBanEndTime).toString()));
                    return;
                }
            }
        });
    },
    chatBan: function(adminPlayer, targetPlayer) {
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name) {


                    var curTime = (new Date()).getTime();
                    adminPlayer.server.pushBroadcast(new Messages.Chat(targetPlayer, "/1 " + adminPlayer.name + " muted " + targetPlayer.name + "."));
                    targetPlayer.chatBanEndTime = curTime + (10*60*1000);
                    client.hset("cb:" + targetPlayer.connection._connection.remoteAddress, "etime", (targetPlayer.chatBanEndTime).toString());
                    log.info(adminPlayer.name + "-- Chatting BAN ->" + targetPlayer.name + " to " + (new Date(targetPlayer.chatBanEndTime).toString()));
                    return;
                }
            }
        });
    },
    kickPlayer: function(adminPlayer, targetPlayer) {
        client.smembers("adminname" || "moderators", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){
                    targetPlayer.connection.close("Closed connection to " + targetPlayer.name);
                }
            }
        });
    },
    promotePlayer: function(adminPlayer, targetPlayer, rank) {
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){
                    //Rights 1, and two representing admin and moderators

                    switch (rank) {
                        case 1:
                            client.sadd("moderators", targetPlayer.name);
                            break;
                        case 2:
                            client.sadd("adminname", targetPlayer.name);
                            break;
                    }
                    targetPlayer.connection.close("Admin has promoted player: " + targetPlayer.name);
                }
            }
        });
    },
    demotePlayer: function(adminPlayer, targetPlayer) {
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){

                    client.srem("adminname", targetPlayer.name);
                    client.srem("moderators", targetPlayer.name);
                    targetPlayer.connection.close("Admininstrator has demoted player: " + targetPlayer.name);
                }
            }
        });
    },
    permanentlyMute: function(adminPlayer, targetPlayer) {
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){

                    var curTime = (new Date()).getTime();
                    adminPlayer.server.pushBroadcast(new Messages.Chat(targetPlayer, "/1 " + adminPlayer.name + " has permanently muted " + targetPlayer.name + "."));
                    targetPlayer.chatBanEndTime = curTime + (100*365*24*10*60*1000);
                    client.hset("cb:" + targetPlayer.connection._connection.remoteAddress, "etime", (targetPlayer.chatBanEndTime).toString());
                    log.info(adminPlayer.name + "-- Chatting BAN ->" + targetPlayer.name + " to " + (new Date(targetPlayer.chatBanEndTime).toString()));
                    return;
                }
            }
        });
    },
    newBanPlayer: function(adminPlayer, banPlayer){
        log.debug("1");
        if(adminPlayer.experience > 100000){
            log.debug("2");
            client.hget("b:" + adminPlayer.connection._connection.remoteAddress, "banUseTime", function(err, reply){
                log.debug("3");
                var curTime = new Date();
                log.debug("curTime: " + curTime.getTime());
                log.debug("bannable Time: " + (reply*1) + 1000*60*60*24);
                if(curTime.getTime() > (reply*1) + 1000*60*60*24){
                    log.debug("4");
                    banPlayer.bannedTime++;
                    var banMsg = adminPlayer.name + " has banned " + banPlayer.name + " for " + banPlayer.bannedTime + " days " + (Math.pow(2,(banPlayer.bannedTime))/2) + ".";
                    client.sadd("ipban", banPlayer.connection._connection.remoteAddress);
                    client.hset("b:" + banPlayer.connection._connection.remoteAddress, "rtime", (curTime.getTime()+(Math.pow(2,(banPlayer.bannedTime))*500*60)).toString());
                    client.hset("b:" + banPlayer.connection._connection.remoteAddress, "time", banPlayer.bannedTime.toString());
                    client.hset("b:" + adminPlayer.connection._connection.remoteAddress, "banUseTime", curTime.getTime().toString());
                    setTimeout( function(){ banPlayer.connection.close("Added IP Banned player: " + banPlayer.name + " " + banPlayer.connection._connection.remoteAddress); }, 500);

                    log.info(banMsg);
                }
                return;
            });
        }
    },
    membershipOnPlayer: function(adminPlayer, otherPlayer) {
        client.smembers("adminname", function(err, replies) {
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name) {
                    var curTime = (new Date()).getTime();
                    otherPlayer.membershipTime = curTime + (1000*60*60*24*30);
                    client.hset("membershipTime: " + (otherPlayer.membershipTime).toString());
                    log.info("Membership on: " + otherPlayer.name + " until: " + (new Date(otherPlayer.membershipTime).toString()));
                    return;

                }
            }
        });
    },

    putGoldOfflineUser: function(name, itemNumber, successCallback, failCallback){
        var i=0;
        var multi = client.multi();
        for(i=0; i<18; i++){
            multi.hget("u:" + name, "bank"+i);
        }
        for(i=0; i<18; i++){
            multi.hget("u:" + name, "bank"+i+":number");
        }
        //multi.hget("u:" + name, "maxBankNumber");
        multi.exec(function(err, replies){
            var i=0;
            //var maxBankNumber = parseInt(replies[36]);
            var maxBankNumber = 18;
            for(i=0; i<maxBankNumber; i++){
                if(replies[i] === "gold"){
                    var amount = parseInt(replies[i+18]) + parseInt(itemNumber);
                    client.hset("u:" + name, "bank" + i + ":number", amount);
                    if(successCallback){

                        successCallback();
                    }
                    return;
                }
            }
            for(i=0; i<maxBankNumber; i++) {
                if(replies[i]){
                    continue;
                } else {
                    client.multi()
                        .hset("u:" + name, "bank" + i, "gold")
                        .hset("u:" + name, "bank" + i + ":number", itemNumber)
                        .exec();
                    if(successCallback){

                        successCallback();
                    }
                    return;
                }
            }
            if(failCallback){
                failCallback();
            }
        });
    },

    getBankItems: function(player, callback) {
        var userKey = "u:" + player.name;
        client.hget(userKey, "maxBankNumber", function(err, maxBankNumber){
            maxBankNumber = Utils.NaN2Zero(maxBankNumber) === 0 ? 18 : Utils.NaN2Zero(maxBankNumber);

            var i = 0;
            var multi = client.multi();

            for (i = 0; i < maxBankNumber; i++) {
                multi.hget(userKey, "bank" + i);
                multi.hget(userKey, "bank" + i + ":number");
                multi.hget(userKey, "bank" + i + ":skillKind");
                multi.hget(userKey, "bank" + i + ":skillLevel");
            }
            multi.exec(function(err, data) {
                var i = 0;
                var itemKinds = [];
                var itemNumbers = [];
                var itemSkillKinds = [];
                var itemSkillLevels = [];
                for (i = 0; i < maxBankNumber; i++) {
                    itemKinds.push(Utils.NaN2Zero(ItemTypes.getKindFromString(data.shift())));
                    itemNumbers.push(Utils.NaN2Zero(data.shift()));
                    itemSkillKinds.push(Utils.NaN2Zero(data.shift()));
                    itemSkillLevels.push(Utils.NaN2Zero(data.shift()));
                }
                callback(maxBankNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);

            })
        });

    },

    emptyOutBankItem: function(player, number) {
        log.info("Emptying Player's Item slot: " + number + " of: " + player.name);
        client.hdel("u:" + player.name, "bank" + number);
        client.hdel("u:" + player.name, "bank" + number + ":number");
        client.hdel("u:" + player.name, "bank" + number + ":skillKind");
        client.hdel("u:" + player.name, "bank" + number + ":skillLevel");
        player.send([Types.Messages.BANK, number, null, 0]);
    },

    setBankItem: function (player, bankNumber, item) {
        this.setBank(player, bankNumber, item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);
    },

    setBank: function(player, bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        if (itemKind) {
            client.hset("u:" + player.name, "bank" + bankNumber, ItemTypes.getKindAsString(itemKind));
            client.hset("u:" + player.name, "bank" + bankNumber + ":number", itemNumber);
            client.hset("u:" + player.name, "bank" + bankNumber + ":skillKind", itemSkillKind);
            client.hset("u:" + player.name, "bank" + bankNumber + ":skillLevel", itemSkillLevel);
            player.server.pushToPlayer(player, new Messages.Bank(bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel));
            log.info("Set Bank for: " + player.name);
        } else {
            this.emptyOutBankItem(player, bankNumber);
        }

    },


    getAllInventory: function(player, callback){
        var userKey = "u:" + player.name;
        client.hget(userKey, "maxInventoryNumber", function(err, maxInventoryNumber){
            maxInventoryNumber = 24;

            var i=0;
            var multi = client.multi();
            for(i=0; i<maxInventoryNumber; i++){
                multi.hget(userKey, "inventory"+i);
                multi.hget(userKey, "inventory" + i + ":number");
                multi.hget(userKey, "inventory" + i + ":skillKind");
                multi.hget(userKey, "inventory" + i + ":skillLevel");

            }
            multi.exec(function(err, data){
                var i=0;
                var itemKinds = [];
                var itemNumbers = [];
                var itemSkillKinds = [];
                var itemSkillLevels = [];
                for(i=0; i<maxInventoryNumber; i++){
                    itemKinds.push(ItemTypes.getKindFromString(data.shift()));
                    itemNumbers.push(Utils.NaN2Zero(data.shift()));
                    itemSkillKinds.push(Utils.NaN2Zero(data.shift()));
                    itemSkillLevels.push(Utils.NaN2Zero(data.shift()));
                }
                callback(maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);

            });
        });
    },


    setInventoryItem: function(player, inventoryNumber, item) {
        this.setInventory(player, inventoryNumber, item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);
    },

    setInventory: function(player, inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        /*log.info("SetInventory: " + player.name + ", "
         + ItemTypes.getKindAsString(itemKind) + ", "
         + inventoryNumber + ", "
         + itemNumber + ", "
         + itemSkillKind + ", "
         + itemSkillLevel);*/
        if(itemKind){
            client.hset("u:" + player.name, "inventory" + inventoryNumber, ItemTypes.getKindAsString(itemKind));
            client.hset("u:" + player.name, "inventory" + inventoryNumber + ":number", itemNumber);
            client.hset("u:" + player.name, "inventory" + inventoryNumber + ":skillKind", itemSkillKind);
            client.hset("u:" + player.name, "inventory" + inventoryNumber + ":skillLevel", itemSkillLevel);
            player.server.pushToPlayer(player, new Messages.Inventory(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel));
        } else{
            this.makeEmptyInventory(player, inventoryNumber);
        }

        /*var i=0;
         for(i=0; i < player.maxInventoryNumber; i++){
         log.info("Inventory " + i + ": " + player.inventory.rooms[i].itemKind
         + " " + player.inventory.rooms[i].itemNumber
         + " " + player.inventory.rooms[i].itemSkillKind
         + " " + player.inventory.rooms[i].itemSkillLevel);
         }*/
    },
    makeEmptyInventory: function(player, number){
        log.info("Empty Inventory: " + player.name + " " + number);
        client.hdel("u:" + player.name, "inventory" + number);
        client.hdel("u:" + player.name, "inventory" + number + ":number");
        client.hdel("u:" + player.name, "inventory" + number + ":skillKind");
        client.hdel("u:" + player.name, "inventory" + number + ":skillLevel");
        player.send([Types.Messages.INVENTORY, number, null, 0]);
    },


    banTerm: function(time){
        return Math.pow(2, time) * 500 * 60;
    },
    equipArmor: function(name, armor, enchantedPoint, skillKind, skillLevel){
        log.info("Set Armor: " + name + " " + armor);
        client.hset("u:" + name, "armor", armor);
        client.hset("u:" + name, "armorEnchantedPoint", enchantedPoint);
        client.hset("u:" + name, "armorSkillKind", skillKind);
        client.hset("u:" + name, "armorSkillLevel", skillLevel);
    },
    equipWeapon: function(name, weapon, enchantedPoint, skillKind, skillLevel){
        log.info("Set Weapon: " + name + " " + weapon + " +" + enchantedPoint);
        client.hset("u:" + name, "weapon", weapon);
        client.hset("u:" + name, "weaponEnchantedPoint", enchantedPoint);
        client.hset("u:" + name, "weaponSkillKind", skillKind);
        client.hset("u:" + name, "weaponSkillLevel", skillLevel);
    },
    enchantWeapon: function(name, enchantedPoint){
        log.info("Enchant Weapon: " + name + " " + enchantedPoint);
        client.hset("u:" + name, "weaponEnchantedPoint", enchantedPoint);
    },
    setWeaponSkill: function(name, skillKind, skillLevel){
        log.info("Set Weapon Skill Level: " + name + " " + skillLevel);
        client.hset("u:" + name, "weaponSkillKind", skillKind);
        client.hset("u:" + name, "weaponSkillLevel", skillLevel);
    },

    setExp: function(name, exp){
        //log.info("Set Exp: " + name + " " + exp);
        client.hset("u:" + name, "exp", exp);
    },

    setPointsData: function(name, hitpoints, mana) {
        try {
            client.hset("u:" + name, "hitpoints", hitpoints);
            client.hset("u:" + name, "mana", mana);
        } catch (e) {}
    },

    foundAchievement: function(name, number){
        log.info("Found Achievement: " + name + " " + number);
        client.hset("u:" + name, "achievement" + number + ":found", "true");
    },
    progressAchievement: function(name, number, progress){
        log.info("Progress Achievement: " + name + " " + number + " " + progress);
        client.hset("u:" + name, "achievement" + number + ":progress", progress);
    },

    setQuestState: function(name, questId, state) {
        client.hset("u:" + name, "quest" + questId + ":state", state);
    },

    getQuestState: function(name, questId, callback) {
        var self = this,
            userKey = "u:" + name,
            multi = client.multi(),
            questState;

        multi.hget(userKey, "quest" + questId + ":state");
        multi.exec(function(err, data) {
            questState = data.shift();

            if (isNaN(questState))
                questState = -1;

            callback(questState);
        });
    },

    setUsedPubPts: function(name, usedPubPts){
        log.info("Set Used Pub Points: " + name + " " + usedPubPts);
        client.hset("u:" + name, "usedPubPts", usedPubPts);
    },

    setPoison: function(player, state) {
        var value = 0;
        if (state)
            value = 1;

        client.hset("u:" + player.name, "poisoned", value);
    },

    setPlayerPosition: function(player, x, y) {
        client.hset("u:" + player.name, "x", x);
        client.hset("u:" + player.name, "y", y);
    },

    teleportPlayer: function(adminPlayer, player, x, y) {
        client.smembers("adminname", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === adminPlayer.name){
                    log.info("Setting position: x: " + x + " y: " + y );
                    client.hset("u:" + player.name, "x", x);
                    client.hset("u:" + player.name, "y", y);

                    player.connection.close("Teleported Player.");
                }
            }
        });
    },
    assignPosition: function(player, x, y) {
        client.hset("u:" + player.name, "x", x);
        client.hset("u:" + player.name, "y", y);
    },

    setCheckpoint: function(name, x, y){
        client.hset("u:" + name, "x", x);
        client.hset("u:" + name, "y", y);
    },

    delInventory: function(name, callback){
        client.hdel("u:" + name, "maxInventoryNumber", function(err, reply){
            if(parseInt(reply) === 1){

                callback();
            }
        });
    },

    delSkillSlots: function(player, callback) {
        var userKey = "u:" + player.name,
            multi = client.multi();

        for(var index = 0; index < 5; index++) {
            multi.hdel(userKey, "skillSlot" + index);
        }
        multi.exec(function(err) {
            if(callback) {
                callback();
            }
        });
    },

    loadSkillSlots: function(player, callback) {
        var userKey = "u:" + player.name,
            multi = client.multi();

        for(var index = 0; index < 5; index++) {
            multi.hget(userKey, "skillSlot" + index);
        }
        multi.exec(function(err, replies) {
            if(callback) {
                callback(replies);
            }
        });
    },

    setPlayerRights: function(player, newRank) {
        var self = this,
            userKey = "u:" + player.name,
            multi = client.multi();

        multi.hset(userKey, "rights", newRank);
    },

    getPlayerRights: function(player) {
        var self = this,
            rights,
            userKey = "u:" + player.name,
            multi = client.multi();

        multi.hget(userKey, "rights");
        multi.exec(function(err, data) {
            rights = data.shift();
        });

        if (isNaN(rights))
            rights = 0;

        return rights;
    },

    getSkills: function(player, callback) {
        var maxSkills = 12;

        var userKey = "u:" + player.name;

        var i = 0;
        var multi = client.multi();

        for (i = 0; i < maxSkills; i++) {
            multi.hget(userKey, "skill" + i);
            multi.hget(userKey, "skillLevel" + i);
        }
        multi.exec(function(err, data) {
            var i = 0;
            var skillName = [];
            var skillLevel = [];
            for (i = 0; i < maxSkills; i++) {
                skillName.push(data.shift());
                skillLevel.push(data.shift());
            }

            callback(skillName.length, skillName, skillLevel);

        });
    },
    handleSkills: function(player, index, name, level) {
        client.hset('u:' + player.name, 'skill' + index, name);
        client.hset('u:' + player.name, 'skillLevel' + index, level);
    },

    handleSkillInstall: function(player, index, name, callback) {
        client.hset('u:' + player.name, 'skillSlot' + index, name, function(err, reply) {
            if(callback) {
                callback();
            }
        });
    },
    loadAchievement: function(player, callback){
        var userKey = "u:" + player.name;
        var multi = client.multi();
        var i=0;
        for(i=0; i<Object.keys(Achievements.AchievementData).length; i++){
            multi.hget(userKey, "achievement" + (i) + ":found");
            multi.hget(userKey, "achievement" + (i) + ":progress");
        }
        multi.exec(function(err, replies){
            var i=0;
            var dFound, dProgress, foundTime;

            for(i=0; i< Object.keys(Achievements.AchievementData).length; i++){
                dFound = Utils.trueFalse(replies.shift());
                dProgress = Utils.NaN2Zero(replies.shift());

                player.achievement[i] = {
                    found: dFound,
                    progress: dProgress
                };
            }
            callback();
        });
    },

    handlePet: function(player, index, kind) {
        client.hset('u:' + player.name, 'pet' + index, kind);
    },

    loadPets: function(player, callback) {
        var userKey = "u:" + player.name,
            multi = client.multi();

        for(var index = 0; index < 3; index++) {
            multi.hget(userKey, "pet" + index);
        }
        multi.exec(function(err, replies) {
            if(callback) {
                callback(replies);
            }
        });
    },

    // AUCTION DATABASE CALLS.
    handleSaveAuctionItem: function (player, item, buy, invNumber)
    {
        client.lrange('auctionIndex', 0, -1, function(err, auctionIndex) {
            var auctionCount = 0;
            if (auctionIndex.length > 0)
                auctionCount = auctionIndex.length;

            client.lpush("auctionIndex",auctionCount);
            client.hset('s:auction', 'i' + auctionCount + ".p", player.name);
            client.hset('s:auction', 'i' + auctionCount + ".k", item.itemKind);
            client.hset('s:auction', 'i' + auctionCount + ".c", item.itemNumber);
            client.hset('s:auction', 'i' + auctionCount + ".sk", item.itemSkillKind);
            client.hset('s:auction', 'i' + auctionCount + ".sl", item.itemSkillLevel);
            client.hset('s:auction', 'i' + auctionCount + ".buy", buy, function () {
                player.inventory.makeEmptyInventory(invNumber);
                player.server.pushToPlayer(player, new Messages.Notify("sold"));
            });
        });

    },


    loadAuctionItems: function(player, type) {
        var msg = [Types.Messages.AUCTIONOPEN,type,0];
        var multi = client.multi();

        client.lrange('auctionIndex', 0, -1, function(err, auctionIndex) {
            //log.info(JSON.stringify(auctionIndex));
            if (err || !auctionIndex || auctionIndex.length == 0)
            {
                player.server.pushToPlayer(player, new Messages.AuctionOpen(msg));
                return;
            }

            var i=0;
            for (var index = 0; index < auctionIndex.length; ++index) {
                i = auctionIndex[index];
                //log.info("i="+i);
                multi.hget('s:auction', "i" + i + ".k");
                multi.hget('s:auction', "i" + i + ".p");
                multi.hget('s:auction', "i" + i + ".c");
                multi.hget('s:auction', "i" + i + ".sk");
                multi.hget('s:auction', "i" + i + ".sl");
                multi.hget('s:auction', "i" + i + ".buy");
            }

            multi.exec(function(err, auctionData) {
                var kind;
                var itemCount = 0;
                log.info(JSON.stringify(auctionData));
                for(var index = 0; index < auctionIndex.length; ++index)
                {
                    kind = auctionData[0];
                    if (kind === null)
                        break;
                    //log.info("kind="+kind);
                    //log.info("type="+type);
                    if((type === 2 && (ItemTypes.isArmor(kind) || ItemTypes.isArcherArmor(kind))) ||
                        (type === 3 && (ItemTypes.isWeapon(kind) || ItemTypes.isArcherWeapon(kind))) ||
                        (type === 0 && player.name === auctionData[1]))
                    {
                        msg.push(parseInt(auctionIndex[index]));
                        msg.push(parseInt(auctionData.shift()));
                        msg.push(auctionData.shift());
                        msg.push(parseInt(auctionData.shift()));
                        msg.push(parseInt(auctionData.shift()));
                        msg.push(parseInt(auctionData.shift()));
                        msg.push(parseInt(auctionData.shift()));
                        ++itemCount;
                    }
                    else
                    {
                        auctionData.shift();
                        auctionData.shift();
                        auctionData.shift();
                        auctionData.shift();
                        auctionData.shift();
                        auctionData.shift();
                    }
                }
                msg[2] = itemCount;
                player.server.pushToPlayer(player, new Messages.AuctionOpen(msg));
            });
        });

    },


    handleDelAuctionItem: function (index)
    {
        client.lrem('auctionIndex', -1, index);
        client.hget("s:auction", "auctionCount", function(err, auctionCount){
            client.hdel('s:auction', 'i' + index + ".p");
            client.hdel('s:auction', 'i' + index + ".k");
            client.hdel('s:auction', 'i' + index + ".c");
            client.hdel('s:auction', 'i' + index + ".sk");
            client.hdel('s:auction', 'i' + index + ".sl");
            client.hdel('s:auction', 'i' + index + ".buy");
        });
    },

    getAuctionItem: function(index, callback)
    {
        var auction;
        multi = client.multi();
        multi.hget('s:auction', "i" + index + ".p");
        multi.hget('s:auction', "i" + index + ".k");
        multi.hget('s:auction', "i" + index + ".c");
        multi.hget('s:auction', "i" + index + ".sk");
        multi.hget('s:auction', "i" + index + ".sl");
        multi.hget('s:auction', "i" + index + ".buy");

        multi.exec(function(err, replies) {
            auction = {
                player: replies.shift(),
                item: {
                    itemKind: parseInt(replies.shift()),
                    itemNumber: parseInt(replies.shift()),
                    itemSkillKind: parseInt(replies.shift()),
                    itemSkillLevel: parseInt(replies.shift())
                },
                value: parseInt(replies.shift())
            };
            callback(auction);
        });
    }
});