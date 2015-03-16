var Utils = require('../utils');

var cls = require("../lib/class"),
    Player = require('../player'),
    Messages = require("../message"),
    redis = require("redis"),
    bcrypt = require("bcrypt");

module.exports = DatabaseHandler = cls.Class.extend({
    init: function(config){
        client = redis.createClient(config.redis_port, config.redis_host, {socket_nodelay: true});
        client.auth("klhjkHGBmnvzZXZXZhsdfsd66-124&^^%$^@--fbkbgdJGBGBG04y1bVXVXVXp49xk!i24");
    },
    loadPlayer: function(player){
        var self = this;
        var userKey = "u:" + player.name;
        var curTime = new Date().getTime();
        client.smembers("usr", function(err, replies){
            for(var index = 0; index < replies.length; index++){
                if(replies[index].toString() === player.name){
                    client.multi()
                        .hget(userKey, "pw") // 0
                        .hget(userKey, "armor") // 1
                        .hget(userKey, "weapon") // 2
                        .hget(userKey, "exp") // 3
                        .hget("b:" + player.connection._connection.remoteAddress, "time") // 4
                        .hget("b:" + player.connection._connection.remoteAddress, "banUseTime") // 5
                        .hget("b:" + player.connection._connection.remoteAddress, "loginTime") // 6
                        .hget(userKey, "avatar") // 7
                        .zrange("adrank", "-1", "-1") // 8
                        .get("nextNewArmor") // 9
                        .hget(userKey, "inventory0") // 10
                        .hget(userKey, "inventory0:number") // 11
                        .hget(userKey, "inventory1") // 12
                        .hget(userKey, "inventory1:number") // 13
                        .hget(userKey, "achievement1:found") // 14
                        .hget(userKey, "achievement1:progress") // 15
                        .hget(userKey, "achievement2:found") // 16
                        .hget(userKey, "achievement2:progress") // 17
                        .hget(userKey, "achievement3:found") // 18
                        .hget(userKey, "achievement3:progress") // 19
                        .hget(userKey, "achievement4:found") // 20
                        .hget(userKey, "achievement4:progress") // 21
                        .hget(userKey, "achievement5:found") // 22
                        .hget(userKey, "achievement5:progress") // 23
                        .hget(userKey, "achievement6:found") // 24
                        .hget(userKey, "achievement6:progress") // 25
                        .smembers("adminname") // 26
                        .zscore("adrank", player.name) // 27
                        .hget(userKey, "weaponAvatar") // 28
                        .hget(userKey, "x") // 29
                        .hget(userKey, "y") // 30
                        .hget(userKey, "achievement7:found") // 31
                        .hget(userKey, "achievement7:progress") // 32
                        .hget(userKey, "achievement8:found") // 33
                        .hget(userKey, "achievement8:progress") // 34
                        .hget("cb:" + player.connection._connection.remoteAddress, "etime") // 35
                        .smembers("moderators") // 36
                        .hget("b:" + player.connection._connection.remoteAddress, "rtime") //37
                        //.get(userKey, "userGuild")
                        /*
                         * Add a .hget here to select the guild the player is in, use
                         * the other ones above similarily.
                         * .hget(userKey, "guild")
                         * 
                         */
                         
                        .exec(function(err, replies){
                            var pw = replies[0];
                            var armor = replies[1];
                            var weapon = replies[2];
                            var exp = Utils.NaN2Zero(replies[3]);
                            var bannedTime = Utils.NaN2Zero(replies[4]);
                            var banUseTime = Utils.NaN2Zero(replies[5]);
                            var lastLoginTime = Utils.NaN2Zero(replies[6]);
                            var avatar = replies[7];
                            var pubTopName = replies[8];
                            var nextNewArmor = replies[9];
                            var inventory = [replies[10], replies[12]];
                            var inventoryNumber = [
                              Utils.NaN2Zero(replies[11]),
                              Utils.NaN2Zero(replies[13])];
                            var achievementFound = [
                              Utils.trueFalse(replies[14]),
                              Utils.trueFalse(replies[16]),
                              Utils.trueFalse(replies[18]),
                              Utils.trueFalse(replies[20]),
                              Utils.trueFalse(replies[22]),
                              Utils.trueFalse(replies[24]),
                              Utils.trueFalse(replies[31]),
                              Utils.trueFalse(replies[33])
                            ];
                            var achievementProgress = [
                              Utils.NaN2Zero(replies[15]),
                              Utils.NaN2Zero(replies[17]),
                              Utils.NaN2Zero(replies[19]),
                              Utils.NaN2Zero(replies[21]),
                              Utils.NaN2Zero(replies[23]),
                              Utils.NaN2Zero(replies[25]),
                              Utils.NaN2Zero(replies[32]),
                              Utils.NaN2Zero(replies[34])
                            ];
                            var adminnames = replies[26];
                            var pubPoint =  Utils.NaN2Zero(replies[27]);
                            var weaponAvatar = replies[28] ? replies[28] : weapon;
                            
                            var x = Utils.NaN2Zero(replies[29]);
                            var y = Utils.NaN2Zero(replies[30]);
                            var chatBanEndTime = Utils.NaN2Zero(replies[35]);
                            var moderators = replies[36];
                            var banTime = replies[37];
                            //var curTime = new Date();
                            //Check ban here
                            
                            if(banTime > curTime){
                                 
                                player.connection.sendUTF8("ban"); 
                                
                                player.connection.close("Closing connection to: " + player.name);
                            
                                return;
                            } 
                            // Check Password

                            bcrypt.compare(player.pw, pw, function(err, res) {
                                if(!res) {
                                    player.connection.sendUTF8("invalidlogin");
                                    player.connection.close("Wrong Password: " + player.name);
                                    return;
                                }

                               var d = new Date();
                                var lastLoginTimeDate = new Date(lastLoginTime);
                                if(lastLoginTimeDate.getDate() !== d.getDate()
                                && pubPoint > 0){
                                  var targetInventoryNumber = -1;
                                  if(inventory[0] === "burger"){
                                    targetInventoryNumber = 0;
                                  } else if(inventory[1] === "burger"){
                                    targetInventoryNumber = 1;
                                  } else if(inventory[0] === null){
                                    targetInventoryNumber = 0;
                                  } else if(inventory[1] === null){
                                    targetInventoryNumber = 1;
                                  }

                                  if(targetInventoryNumber >= 0){
                                    if(pubPoint > 100){
                                      pubPoint = 100;
                                    }
                                    inventory[targetInventoryNumber] = "burger";
                                    inventoryNumber[targetInventoryNumber] += pubPoint*10;
                                    self.setInventory(player.name,
                                             Types.getKindFromString("burger"),
                                             targetInventoryNumber,
                                             inventoryNumber[targetInventoryNumber]);
                                    client.zrem("adrank", player.name);
                                  }
                                } 
                                //client.hset("adminname:" + "Flavius");
                                //adminnames.push("Flavius");
                                //client.sadd("adminname", "Flavius");
                                //client.sadd("adminname", "AnonRobot");
                                //client.sadd("adminname", "Paris");
                                //client.sadd("moderators", "iEatRawMeat");
                                // Check Ban
                                d.setDate(d.getDate() - d.getDay());
                                d.setHours(0, 0, 0);
                                if(lastLoginTime < d.getTime()){
                                    log.info(player.name + "ban is initialized.");
                                    bannedTime = 0;
                                    client.hset("b:" + player.connection._connection.remoteAddress, "time", bannedTime);
                                }
                                client.hset("b:" + player.connection._connection.remoteAddress, "loginTime", curTime);

                                if(player.name === pubTopName.toString()){
                                    avatar = nextNewArmor;
                                }

                                var admin = null;
                                var iA = 0; // Index - Administrators
                                for(iA = 0; iA < adminnames.length; iA++){
                                    if(adminnames[iA] === player.name){
                                        admin = 1;
                                        log.info("Admin " + player.name + " has logged in.");
                                    }
                                }
                                var moderator = null;
                                var iM = 0; //Moderators Index
                                for (iM = 0; iM < moderators.length; iM++) {
                                    if (moderators[iM] === player.name) {
                                        moderator = 1;
                                        log.info("Moderator " + player.name + " has logged in.");
                                    }
                                    
                                }
                                
                                log.info("Player name: " + player.name);
                                log.info("Armor: " + armor);
                                log.info("Weapon: " + weapon);
                                log.info("Experience: " + exp);
                                log.info("Banned Time: " + (new Date(bannedTime)).toString());
                                log.info("Ban Use Time: " + (new Date(banUseTime)).toString());
                                log.info("Last Login Time: " + lastLoginTimeDate.toString());
                                log.info("Chatting Ban End Time: " + (new Date(chatBanEndTime)).toString());

                                player.sendWelcome(armor, weapon,
                                    avatar, weaponAvatar, exp, admin,
                                    bannedTime, banUseTime,
                                    inventory, inventoryNumber, x, y,
                                    chatBanEndTime);
                            });
                    });
                    return;
                }
            }

            // Could not find the user
            player.connection.sendUTF8("invalidlogin");
            player.connection.close("User does not exist: " + player.name);
            return;
        });
    },

    createPlayer: function(player) {
        
        var userKey = "u:" + player.name;
        var curTime = new Date().getTime();

        // Check if username is taken
        client.sismember('usr', player.name, function(err, reply) {
            if(reply === 1) {
                //this.checkBan(player);
                
                
                player.connection.sendUTF8("userexists");
                player.connection.close("Username not available: " + player.name);
                return;
            } else {
                // Add the player
                //this.checkBan(player);
                client.multi()
                    
                    .sadd("usr", player.name)
                    .hset(userKey, "pw", player.pw)
                    .hset(userKey, "email", player.email)
                    .hset(userKey, "armor", "clotharmor")
                    .hset(userKey, "avatar", "clotharmor")
                    .hset(userKey, "weapon", "sword1")
                    .hset(userKey, "exp", 0)
                    .hset("b:" + player.connection._connection.remoteAddress, "loginTime", curTime)
                    .hget("b:" + player.connection._connection.remoteAddress, "rtime") //9
                    
                    .exec(function(err, replies){
                        log.info("New User: " + player.name);
                        var banTime = replies[8];
                        var curTime = new Date().getTime();
                        log.info("Player is banned for: " + banTime);
                        
                        if(banTime > curTime){
                                 
                                player.connection.sendUTF8("ban"); 
                                
                                player.connection.close("Closing connection to: " + player.name);
                            
                                return;
                        } 
                        
                        player.sendWelcome(
                            "clotharmor", "sword1", "clotharmor", "sword1", 0,
                             null, 0, 0,
                             [null, null], [0, 0],
                             [false, false, false, false, false, false],
                             [0, 0, 0, 0, 0, 0],
                             player.x, player.y, 0);
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
                        .hget("u:" + player.name, "x")
                        .hget("u:" + player.name, "y")
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
                                 
                                 /*log.info("Player " + player.name + " is banned. Sending to Black Hole.");
                                 client.hset("u:" + player.name, "x", 154);
                                 client.hset("u:" + player.name, "y", 4);
                                 log.info("X: " + player.x + " y: " + player.y);
                                 player.name = "Banned";*/
                             } /*else {
                                 log.info("Player isn't banned anymore.");
                                
                                 log.info("X: " + posX + " y: " + posY);
                                if (posX == 154 && posY == 4) {
                                    log.info("Player no longer banned, sending to world.");
                                    client.hset("u:" + player.name, "x", 156);
                                    client.hset("u:" + player.name, "y", 294);
                                 
                                 
                                }
                             }*/
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
                    client.hset("u:" + banPlayer.name, "x", 154);
                    client.hset("u:" + banPlayer.name, "y", 4);
                    adminPlayer.server.pushBroadcast(new Messages.Chat(banPlayer, "/1 " + adminPlayer.name + " has banned " + banPlayer.name + " for " + days + "days"));
                    setTimeout( function(){ banPlayer.connection.close("Added IP Banned player: " + banPlayer.name + " " + banPlayer.connection._connection.remoteAddress); }, 500);
                    client.hset("b:" + banPlayer.connection._connection.remoteAddress, "rtime", (curTime+(days*24*60*60*1000)).toString());
                    
                    banPlayer.chatBanEndTime = curTime + (days*24*60*60*1000);
                    client.hset("cb:" + banPlayer.connection._connection.remoteAddress, "etime", (banPlayer.chatBanEndTime).toString());
                    log.info(adminPlayer.name + "-- BAN ->" + banPlayer.name + " to " + (new Date(curTime+(days*24*60*60*1000)).toString()));
                    return;
                }
            }
        });
    },
    unmute: function(adminPlayer, targetPlayer) {
        client.smembers("adminname", function(err, replies){
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
        client.smembers("adminname", function(err, replies){
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
                    adminPlayer.server.pushBroadcast(new Messages.Chat(banPlayer, "/1 " + banMsg));
                    log.info(banMsg);
                }
                return;
            });
        }
    },
    banTerm: function(time){
        return Math.pow(2, time)*500*60;
    },
    equipArmor: function(name, armor){
        log.info("Set Armor: " + name + " " + armor);
        client.hset("u:" + name, "armor", armor);
    },
    equipAvatar: function(name, armor){
        log.info("Set Avatar: " + name + " " + armor);
        client.hset("u:" + name, "avatar", armor);
    },
    equipWeapon: function(name, weapon){
        log.info("Set Weapon: " + name + " " + weapon);
        client.hset("u:" + name, "weapon", weapon);
    },
    setExp: function(name, exp){
        log.info("Set Exp: " + name + " " + exp);
        client.hset("u:" + name, "exp", exp);
    },
   setInventory: function(name, itemKind, inventoryNumber, itemNumber){
        log.info(itemNumber, "is the Item Number.");
        if(itemKind){
            client.hset("u:" + name, "inventory" + inventoryNumber, Types.getKindAsString(itemKind));
            client.hset("u:" + name, "inventory" + inventoryNumber + ":number", itemNumber);
           log.info("SetInventory: " + name + ", "
                                     + Types.getKindAsString(itemKind) + ", "
                                     + inventoryNumber + ", "
                                     + itemNumber);
        } else if (itemNumber === 0) {
            this.makeEmptyInventory(name, inventoryNumber);
        } else {
            this.makeEmptyInventory(name, inventoryNumber);
        }
    },
    makeEmptyInventory: function(name, number){
        log.info("Empty Inventory: " + name + " " + number);
        client.hdel("u:" + name, "inventory" + number);
        client.hdel("u:" + name, "inventory" + number + ":number");
    },
    foundAchievement: function(name, number){
        log.info("Found Achievement: " + name + " " + number);
        if(number < 100){
          client.hset("u:" + name, "achievement" + number + ":found", "true");
        } else{
          client.hset("u:" + name, "dailyQuest" + (number-100) + ":found", "true");
          client.hset("u:" + name, "dailyQuest" + (number-100) + ":foundTime", (new Date()).getTime());
        }
    },
    progressAchievement: function(name, number, progress){
        log.info("Progress Achievement: " + name + " " + number + " " + progress);
        if(number < 100){
          client.hset("u:" + name, "achievement" + number + ":progress", progress);
        } else{
          client.hset("u:" + name, "dailyQuest" + (number-100) + ":progress", progress);
        }
    },
    setUsedPubPts: function(name, usedPubPts){
        log.info("Set Used Pub Points: " + name + " " + usedPubPts);
        client.hset("u:" + name, "usedPubPts", usedPubPts);
    },
    setPlayerPosition: function(player, x, y) {
        
        log.info("Setting position: x: " + x + " y: " + y );
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
    moveToBlackHole: function(player, x, y) {
        
        log.info("Moving " + player.name + " to Black Hole.");
        client.hset("u:" + player.name, "x", x);
        client.hset("u:" + player.name, "y", y);
    },
    
    setCheckpoint: function(name, x, y){
        log.info("Set Check Point: " + name + " " + x + " " + y);
        client.hset("u:" + name, "x", x);
        client.hset("u:" + name, "y", y);
    },
    
    loadQuest: function(player, callback){
        var userKey = "u:" + player.name;
        var multi = client.multi();
        var i=0;
        for(i=0; i<Types.Quest.TOTAL_QUEST_NUMBER; i++){
          multi.hget(userKey, "achievement" + (i+1) + ":found");
          multi.hget(userKey, "achievement" + (i+1) + ":progress");
        }
        for(i=0; i<4; i++){
          multi.hget(userKey, "dailyQuest" + (i+1) + ":found");
          multi.hget(userKey, "dailyQuest" + (i+1) + ":progress");
          multi.hget(userKey, "dailyQuest" + (i+1) + ":foundTime");
        }
        multi.exec(function(err, replies){
          var i=0;
          var dFound, dProgress, foundTime;

          for(i=0; i<Types.Quest.TOTAL_QUEST_NUMBER; i++){
            dFound = Utils.trueFalse(replies.shift());
            dProgress = Utils.NaN2Zero(replies.shift());

            player.achievement[i+1] = {
              found: dFound,
              progress: dProgress,
            };
          }

          for(i=0; i<4; i++){
            dFound = Utils.trueFalse(replies.shift());
            dProgress = Utils.NaN2Zero(replies.shift());
            foundTime = Utils.NaN2Zero(replies.shift());

            if((new Date(foundTime)).getDate() !== (new Date()).getDate()){
              dFound = false;
              dProgress = 0;
              client.hset(userKey, "dailyQuest" + (i+1) + ":found", "false");
              client.hset(userKey, "dailyQuest" + (i+1) + ":progress", 0);
            }

            player.achievement[i+101] = {
              found: dFound,
              progress: dProgress,
              foundTime: foundTime,
            }
          }
          callback();
        });
      },
    
    loadBoard: function(player, command, number, replyNumber){
      log.info("Load Board: " + player.name + " " + command + " " + number + " " + replyNumber);
      if(command === 'view'){
        client.multi()
        .hget('bo:free', number+':title')
        .hget('bo:free', number+':content')
        .hget('bo:free', number+':writer')
        .hincrby('bo:free', number+':cnt', 1)
        .smembers('bo:free:' + number + ':up')
        .smembers('bo:free:' + number + ':down')
        .hget('bo:free', number+':time')
        .exec(function(err, replies){
          var title = replies[0];
          var content = replies[1];
          var writer = replies[2];
          var counter = replies[3];
          var up = replies[4].length;
          var down = replies[5].length;
          var time = replies[6];
          player.send([Types.Messages.BOARD,
                       'view',
                       title,
                       content,
                       writer,
                       counter,
                       up,
                       down,
                       time]);
        });
      } else if(command === 'reply'){
        client.multi()
        .hget('bo:free', number+':reply:'+replyNumber+':writer')
        .hget('bo:free', number+':reply:'+replyNumber+':content')
        .smembers('bo:free:' + number+':reply:'+replyNumber+':up')
        .smembers('bo:free:' + number+':reply:'+replyNumber+':down')

        .hget('bo:free', number+':reply:'+(replyNumber+1)+':writer')
        .hget('bo:free', number+':reply:'+(replyNumber+1)+':content')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+1)+':up')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+1)+':down')

        .hget('bo:free', number+':reply:'+(replyNumber+2)+':writer')
        .hget('bo:free', number+':reply:'+(replyNumber+2)+':content')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+2)+':up')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+2)+':down')

        .hget('bo:free', number+':reply:'+(replyNumber+3)+':writer')
        .hget('bo:free', number+':reply:'+(replyNumber+3)+':content')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+3)+':up')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+3)+':down')

        .hget('bo:free', number+':reply:'+(replyNumber+4)+':writer')
        .hget('bo:free', number+':reply:'+(replyNumber+4)+':content')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+4)+':up')
        .smembers('bo:free:' + number+':reply:'+(replyNumber+4)+':down')

        .exec(function(err, replies){
          player.send([Types.Messages.BOARD,
                       'reply',
                        replies[0],  replies[1],  replies[2].length, replies[3].length,
                        replies[4],  replies[5],  replies[6].length, replies[7].length,
                        replies[8],  replies[9],  replies[10].length, replies[11].length,
                        replies[12], replies[13], replies[14].length, replies[15].length,
                        replies[16], replies[17], replies[18].length, replies[19].length]);
        });
      } else if(command === 'up'){
        if(player.level >= 50){
          client.sadd('bo:free:' + number + ':up', player.name);
        }
      } else if(command === 'down'){
        if(player.level >= 50){
          client.sadd('bo:free:' + number + ':down', player.name);
        }
      } else if(command === 'replyup'){
        if(player.level >= 50){
          client.sadd('bo:free:'+number+':reply:'+replyNumber+':up', player.name);
        }
      } else if(command === 'replydown'){
        if(player.level >= 50){
          client.sadd('bo:free:'+number+':reply:'+replyNumber+':down', player.name);
        }
      } else if(command === 'list'){
        client.hget('bo:free', 'lastnum', function(err, reply){
          var lastnum = reply;
          if(number > 0){
            lastnum = number;
          }
          client.multi()
          .hget('bo:free', lastnum +':title')
          .hget('bo:free', (lastnum-1) +':title')
          .hget('bo:free', (lastnum-2) +':title')
          .hget('bo:free', (lastnum-3) +':title')
          .hget('bo:free', (lastnum-4) +':title')
          .hget('bo:free', (lastnum-5) +':title')
          .hget('bo:free', (lastnum-6) +':title')
          .hget('bo:free', (lastnum-7) +':title')
          .hget('bo:free', (lastnum-8) +':title')
          .hget('bo:free', (lastnum-9) +':title')

          .hget('bo:free', lastnum +':writer')
          .hget('bo:free', (lastnum-1) +':writer')
          .hget('bo:free', (lastnum-2) +':writer')
          .hget('bo:free', (lastnum-3) +':writer')
          .hget('bo:free', (lastnum-4) +':writer')
          .hget('bo:free', (lastnum-5) +':writer')
          .hget('bo:free', (lastnum-6) +':writer')
          .hget('bo:free', (lastnum-7) +':writer')
          .hget('bo:free', (lastnum-8) +':writer')
          .hget('bo:free', (lastnum-9) +':writer')

          .hget('bo:free', lastnum +':cnt')
          .hget('bo:free', (lastnum-1) +':cnt')
          .hget('bo:free', (lastnum-2) +':cnt')
          .hget('bo:free', (lastnum-3) +':cnt')
          .hget('bo:free', (lastnum-4) +':cnt')
          .hget('bo:free', (lastnum-5) +':cnt')
          .hget('bo:free', (lastnum-6) +':cnt')
          .hget('bo:free', (lastnum-7) +':cnt')
          .hget('bo:free', (lastnum-8) +':cnt')
          .hget('bo:free', (lastnum-9) +':cnt')

          .smembers('bo:free:' + lastnum + ':up')
          .smembers('bo:free:' + (lastnum-1) + ':up')
          .smembers('bo:free:' + (lastnum-2) + ':up')
          .smembers('bo:free:' + (lastnum-3) + ':up')
          .smembers('bo:free:' + (lastnum-4) + ':up')
          .smembers('bo:free:' + (lastnum-5) + ':up')
          .smembers('bo:free:' + (lastnum-6) + ':up')
          .smembers('bo:free:' + (lastnum-7) + ':up')
          .smembers('bo:free:' + (lastnum-8) + ':up')
          .smembers('bo:free:' + (lastnum-9) + ':up')

          .smembers('bo:free:' + lastnum + ':down')
          .smembers('bo:free:' + (lastnum-1) + ':down')
          .smembers('bo:free:' + (lastnum-2) + ':down')
          .smembers('bo:free:' + (lastnum-3) + ':down')
          .smembers('bo:free:' + (lastnum-4) + ':down')
          .smembers('bo:free:' + (lastnum-5) + ':down')
          .smembers('bo:free:' + (lastnum-6) + ':down')
          .smembers('bo:free:' + (lastnum-7) + ':down')
          .smembers('bo:free:' + (lastnum-8) + ':down')
          .smembers('bo:free:' + (lastnum-9) + ':down')

          .hget('bo:free', lastnum + ':replynum')
          .hget('bo:free', (lastnum+1) + ':replynum')
          .hget('bo:free', (lastnum+2) + ':replynum')
          .hget('bo:free', (lastnum+3) + ':replynum')
          .hget('bo:free', (lastnum+4) + ':replynum')
          .hget('bo:free', (lastnum+5) + ':replynum')
          .hget('bo:free', (lastnum+6) + ':replynum')
          .hget('bo:free', (lastnum+7) + ':replynum')
          .hget('bo:free', (lastnum+8) + ':replynum')
          .hget('bo:free', (lastnum+9) + ':replynum')

          .exec(function(err, replies){
            var i=0;
            var msg = [Types.Messages.BOARD, 'list', lastnum];

            for(i=0; i<30; i++){
                msg.push(replies[i]);
            }
            for(i=30; i<50; i++){
                msg.push(replies[i].length);
            }
            for(i=50; i<60; i++){
                msg.push(replies[i]);
            }

            player.send(msg);
          });
        });
      }
    },
    writeBoard: function(player, title, content){
      log.info("Write Board: " + player.name + " " + title);
      client.hincrby('bo:free', 'lastnum', 1, function(err, reply){
        var curTime = new Date().getTime();
        var number = reply ? reply : 1;
        client.multi()
        .hset('bo:free', number+':title', title)
        .hset('bo:free', number+':content', content)
        .hset('bo:free', number+':writer', player.name)
        .hset('bo:free', number+':time', curTime)
        .exec();
        player.send([Types.Messages.BOARD,
                     'view',
                     title,
                     content,
                     player.name,
                     0,
                     0,
                     0,
                     curTime]);
      });
    },
    writeReply: function(player, content, number){
      log.info("Write Reply: " + player.name + " " + content + " " + number);
      var self = this;
      client.hincrby('bo:free', number + ':replynum', 1, function(err, reply){
        var replyNum = reply ? reply : 1;
        client.multi()
        .hset('bo:free', number+':reply:'+replyNum+':content', content)
        .hset('bo:free', number+':reply:'+replyNum+':writer', player.name)
        .exec(function(err, replies){
          player.send([Types.Messages.BOARD,
                       'reply',
                       player.name,
                       content]);
        });
      });
    },
    pushKungWord: function(player, word){
      var server = player.server;

      if(player === server.lastKungPlayer){ return; }
      if(server.isAlreadyKung(word)){ return; }
      if(!server.isRightKungWord(word)){ return; }

      if(server.kungWords.length === 0){
        client.srandmember('dic', function(err, reply){
          var randWord = reply;
          server.pushKungWord(player, randWord);
        });
      } else{
        client.sismember('dic', word, function(err, reply){
          if(reply === 1){
            server.pushKungWord(player, word);
          } else{
            player.send([Types.Messages.NOTIFY, word + "는 사전에 없습니다."]);
          }
        });
      }
    }
});
