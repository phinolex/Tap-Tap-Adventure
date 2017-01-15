var cls = require("./lib/class"),
    _ = require("underscore"),
    Log = require('log'),
    Entity = require('./entity/entity'),
    EntitySpawn = require('./entity/entityspawn'),
    Character = require('./entity/character/character'),
    Mob = require('./entity/character/mob/mob'),
    Map = require('./map/map'),
    Npc = require('./entity/npc'),
    NpcData = require('./utils/data/npcdata'),
    Player = require('./entity/character/player/player'),
    Item = require('./entity/item/item'),
    Items = require('./utils/data/itemdata'),
    MobArea = require('./map/areas/mobarea'),
    ChestArea = require('./map/areas/chestarea'),
    Chest = require('./entity/item/chest'),
    Messages = require('./network/packets/message'),
    MobData = require("./utils/data/mobdata"),
    Utils = require("./utils/utils"),
    Types = require("../../../shared/js/gametypes"),
    ItemTypes = require("../../../shared/js/itemtypes"),
    MobController = require("./entity/character/mob/mobcontroller"),
    Pet = require("./entity/character/player/pet"),
    SkillData = require("./utils/data/skilldata"),
    GatherData = require("./utils/data/gatherdata"),
    Gather = require("./entity/item/gather"),
    Lobby = require('./lobby'),
    MinigameHandler = require('./handlers/minigamehandler'),
    AchievementData = require('./utils/data/achievementdata')

module.exports = World = cls.Class.extend({
    init: function(id, maxPlayers, socket, database) {
        var self = this;

        self.id = id;
        self.maxPlayers = maxPlayers;
        self.socket = socket;
        self.database = database;
        self.map = null;
        self.entities = {};
        self.players = {};
        self.mobs = {};
        self.attackets = {};
        self.items = {};
        self.equipping = {};
        self.hurt = {};
        self.npcs = {};
        self.pets = {};
        self.gather = {};
        self.projectiles = {};
        self.mobAreas = [];
        self.chestAreas = [];
        self.groups = {};
        self.party = [];
        self.tradingInstances = [];
        self.isDay = true;
        self.packets = {};
        self.cycleSpeed = 50;
        self.mobControllerSpeed = 200;
        self.itemCount = 0;
        self.playerCount = 0;
        self.zoneGroupsReady = false;
        self.uselessDebugging = false;
        self.positionUpdate = [];
        self.minigameStarted = false;
        self.redScore = 0;
        self.blueScore = 0;
        self.masterPassword = "Dh22dSJl295JNGB01";
        self.development = true;

        /**
         * Handlers
         */

        self.onPlayerConnect(function(player) {
            player.onRequestPosition(function() {
                if (player.lastCheckpoint)
                    return player.lastCheckpoint.getRandomPosition();
                else
                    return self.map.getRandomStartingPosition();
            });
        });

        self.onPlayerEnter(function(player) {
            if (!player.hasEnteredGame)
                self.incrementPlayerCount();

            self.pushToPlayer(player, new Messages.Population(self.playerCount));
            self.pushRelevantEntityListTo(player);

            player.flagPVP(self.map.isPVP(player.x, player.y));
            player.checkGameFlag(self.map.isGameArea(player.x, player.y));

            var move_callback = function(x, y) {
                player.flagPVP(self.map.isPVP(x, y));
                player.checkGameFlag(self.map.isGameArea(x, y));

                player.forEachAttacker(function(mob) {
                    if (mob.target == null)
                        player.removeAttacker(mob);

                    if (mob.target)
                        var target = self.getEntityById(mob.target.id);

                    if (target) {
                        var pos = self.findPositionNextTo(mob, target);
                        if (mob.distanceToSpawningPoint(pos.x, pos.y) >= 7) {
                            mob.clearTarget();
                            mob.forgetEveryone();
                            player.removeAttacker(mob);
                        } else
                            self.moveEntity(mob, pos.x, pos.y);
                    }
                });

            };

            player.packetHandler.onMove(move_callback);
            player.packetHandler.onLootMove(move_callback);

            player.packetHandler.onZone(function() {
                var groupsChanged = self.handleEntityGroupMembership(player);

                if (groupsChanged) {
                    self.pushToPreviousGroups(player, new Messages.Destroy(player));
                    self.pushRelevantEntityListTo(player);
                }
            });

            player.packetHandler.onBroadcast(function(message, ignoreSelf) {
                self.pushToAdjacentGroups(player.group, message, ignoreSelf ? player.id : null);
            });

            player.packetHandler.onBroadcastToZone(function(message, ignoreSelf) {
                self.pushToGroup(player.group, message, ignoreSelf ? player.id : null);
            });

            player.packetHandler.onExit(function() {
                if (player.gameFlag) {
                    player.setPosition(33, 90);
                    self.getMinigameHandler().getPVPMinigame().removePlayer(player);
                }

                self.database.setPlayerPosition(player, player.x, player.y);
                self.database.setPointsData(player.name, player.hitPoints, player.mana);
                self.decrementPlayerCount();
                self.removePlayer(player);
                if (self.removed_callback)
                    self.removed_callback();
            });

            if (self.added_callback)
                self.added_callback();

        });

        self.onEntityAttack(function(attacker) {
            var target = self.getEntityById(attacker.target.id);
            if (target && attacker.type == "mob")
                attacker.follow(target);

            if (attacker instanceof Pet)
                attacker.hit();
        });

        self.onRegenTick(function() {
            self.forEachCharacter(function(character) {
                if (character instanceof Player) {
                    if (character.poisoned) {
                        character.poisonHealthBy(1);
                        self.pushToPlayer(character, character.poison());
                    } else {
                        if (!character.hasFullHealth() && character.isAttacked()) {
                            character.regenHealthBy(1);
                            self.pushToPlayer(character, character.regen());
                        }

                        if (!character.hasFullMana() && character.isAttacked()) {
                            character.regenManaBy(1);
                            self.pushToPlayer(character, new Messages.Mana(character.mana));
                        }
                    }
                }
            });
        });
        log.info("[GameEngine] World - " + self.id + " successfully initialized.");

        /**
         * Just initialize those after everything is set, to be safe.
         */

        self.lobby = new Lobby(self);
        self.minigameHandler = new MinigameHandler(self);
    },

    moveEntity: function(entity, x, y) {
        if(entity) {
            entity.setPosition(x, y);
            this.handleEntityGroupMembership(entity);
        }
    },

    arrayContains: function(array, object) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == object)
                return true;
        }
        return false;
    },

    addParty: function (player1, player2) {
        if (player1 && player2) {
            var party = new Party(this, player1, player2);
            this.party.push(party);
            return party;
        }
    },

    removeParty: function (party)
    {
        this.party = _.reject(this.party, function (el) { return el === party; });
        delete this.party;
    },

    run: function(mapN) {
        var self = this;

        /**
         * Map Loading
         */

        self.map = new Map(mapN);
        self.map.ready(function() {
            self.initZoneGroups();

            _.each(self.map.mobAreas, function(a) {
                var area = new MobArea(a.id, a.nb, a.type, a.x, a.y, a.width, a.height, self);
                area.spawnMobs();
                self.mobAreas.push(area);
            });

            _.each(self.map.chestAreas, function(a) {
                var area = new ChestArea(a.id, a.x, a.y, a.w, a.h, a.tx, a.ty, a.i, self);
                self.chestAreas.push(area);
                area.onEmpty(self.handleEmptyChestArea.bind(self, area));
            });

            _.each(self.map.staticChests, function(chest) {
                var c = self.createChest(chest.x, chest.y, chest.i);
                self.addStaticItem(c);
            });

            self.spawnStaticEntities();
            self.spawnStaticEntities2();

            _.each(self.chestAreas, function(area) {
                area.setNumberOfEntities(area.entities.length);
            });

            self.mobController = new MobController(self, self.map);
            self.mobController.setEntityStep();
        });

        /**
         * World Tasks.
         */
        self.initializeGameTick();
        //self.initializeGather();
        self.initializeMobController();
        self.updatePlayers();
        //self.initializeDayCycle();
    },

    updatePlayers: function() {
        var self = this;

        setInterval(function() {
            for (var p in self.players) {
                var player = self.players[p];
                self.pushBroadcast(new Messages.Teleport(player));
                    //player.packetHandler.broadcast(new Messages.Teleport(player), true);

            }
        }, 2000);
    },
    
    initializeDayCycle: function() {
        var self = this,
            time = new Date().getTime();

        setInterval(function() {
            var currentTime = new Date().getTime();
            if (currentTime - time === 3600000) {
                time = new Date().getTime();
                self.isDay = !self.isDay;
                self.sendToAll(new Messages.TimeOfDay(self.isDay));
            }

        }, 10000)
    },

    sendToAll: function(message) {
        var self = this;

        for (var player in self.players) {
            if (self.players.hasOwnProperty(player))
                player.send(message);
        }
    },

    initializeGameTick: function() {
        var self = this;
        var regenCount = self.getCycleSpeed() * 2;
        var updateCount = 0;

        setInterval(function() {
            self.processGroups();
            self.processPackets();

            if (updateCount < regenCount)
                updateCount ++;
            else {
                if (self.regen_callback)
                    self.regen_callback();

                updateCount = 0;
            }

        }, 1000 / self.getCycleSpeed());
    },

    initializeMobController: function() {
        var self = this;

        setInterval(function() {
            if (self.mobController) {
                setTimeout(function() {
                    self.mobController.checkPetHit();
                    self.mobController.checkMove();
                    self.mobController.checkAggro();
                    self.mobController.checkHit();
                }, self.mobControllerSpeed - 10);
            }
        }, self.mobControllerSpeed);
    },

    initializeGather: function() {
        var self = this;

        setInterval(function() {
            self.forEachGather(function (gather) {
                self.pushToAdjacentGroups(gather.group, gather.despawn());
                self.handleItemDespawn(gather);
            });
        }, 150000);
    },

    initializeRoaming: function() {
        var self = this,
            lastPickedId = null;

        setInterval(function() {
            var mobId = getRandomMob();
            if (mobId != lastPickedId) {
                var mob = self.getEntityById(mobId);
                
                
                
                lastPickedId = mobId;   
            }
        }, 500);
    },

    getArraySize: function(array) {
        var size = 0;
        for (var i in array) {
            if (array.hasOwnProperty(i))
                size++;
        }
        return size;
    },

    getRandomMob: function() {
        var self = this,
            length = 0;
        
        for (var mob in self.mobs)
            length++;
        
        var randomInt = Utils.randomInt(0, length),
            count = 0;

        for (var mobId in self.mobs) {
            if (count == randomInt)
                return mobId;
            
            count++;
        }
        
        return -1;
    },

    processGroups: function() {
        var self = this;

        if (self.zoneGroupsReady) {
            self.map.forEachGroup(function(id) {
                var spawns = [];
                if (self.groups[id].incoming.length > 0) {
                    spawns = _.each(self.groups[id].incoming, function(entity) {
                        if (entity.kind == null)
                            return;

                        if (entity instanceof Player)
                            self.pushToGroup(id, new Messages.Spawn(entity), entity.id);
                        else
                            self.pushToGroup(id, new Messages.Spawn(entity));
                    });

                    self.groups[id].incoming = [];
                }
            });
        }
    },

    processPackets: function() {
        var self = this,
            connection;
        for (var id in self.packets) {
            if (id != null && typeof id !== 'undefined') {
                if (self.packets.hasOwnProperty(id)) {
                    if (self.packets[id].length > 0 && typeof self.packets[id] != 'undefined' && self.packets[id] != null) {
                        if (self.socket.getConnection(id) != null && typeof self.socket.getConnection(id) != 'undefined') {
                            connection = self.socket.getConnection(id);

                            connection.send(self.packets[id]);
                            self.packets[id] = [];
                        } else
                            delete self.socket.getConnection(id);
                    }
                }
            }
        }
    },


    initZoneGroups: function() {
        var self = this;

        self.map.forEachGroup(function(id) {
            self.groups[id] = {
                entities : {},
                players: [],
                incoming: []
            };
        });

        self.zoneGroupsReady = true;
    },

    pushRelevantEntityListTo: function(player) {
        var self = this;
        var entities;

        if (player && player.group in self.groups) {
            entities = _.keys(self.groups[player.group].entities);

            entities = _.reject(entities, function(id) {
                return id === player.id;
            });

            entities = _.map(entities, function(id) {
                return parseInt(id, 10);
            });

            if(entities) {
                //log.info(JSON.stringify(entities));
                self.pushToPlayer(player, new Messages.List(entities));
            }
        }
    },

    loggedInPlayer: function(name) {
        var self = this;

        for (var id in self.players) {
            if (self.players.hasOwnProperty(id)) {
                if (self.players[id].name === name) {
                    if (!self.players[id].isDead)
                        return true;
                }
            }
        }

        return false;
    },

    pushSpawnsToPlayer: function(player, ids) {
        var self = this;

        _.each(ids, function(id) {
            var entity = self.getEntityById(id);
            if(entity && entity.kind)
            {
                self.pushToPlayer(player, new Messages.Spawn(entity));
            }

        });
    },

    removeFromGroups: function(entity) {
        var self = this;
        var oldGroups = [];

        if (entity && entity.group) {
            var group = self.groups[entity.group];
            if (entity instanceof Player) {
                group.players = _.reject(group.players, function (id) {
                    return id === entity.id;
                });
            }

            self.map.forEachAdjacentGroup(entity.group, function(id) {
                if (self.groups[id] && entity.id in self.groups[id].entities) {
                    delete self.groups[id].entities[entity.id];
                    oldGroups.push(id);
                }
            });
            entity.group = null;
        }

        return oldGroups;
    },

    pushToPlayer: function(player, message) {
        var self = this;

        if (player && player.id in self.packets)
            self.packets[player.id].push(message.serialize());
    },

    pushToGroup: function(groupId, message, ignoredPlayer) {
        var self = this;
        var group = self.groups[groupId];

        if (group) {
            _.each(group.players, function(playerId) {
                if (playerId !== ignoredPlayer)
                    self.pushToPlayer(self.getEntityById(playerId), message);
            });
        }
    },

    addAsIncomingToGroup: function(entity, groupId) {
        var self = this;
        var isChest = entity && entity instanceof Chest;
        var isItem = entity && entity instanceof Item;
        var isDroppedItem = entity && isItem && !entity.isStatic && !entity.isFromChest;

        if (entity && groupId) {
            self.map.forEachAdjacentGroup(groupId, function(id) {
                var group = self.groups[id];
                if (group) {
                    if (!_.include(group.entities, entity.id) && (!isItem || isChest || (isItem && !isDroppedItem)))
                        group.incoming.push(entity);
                }
            });
        }
    },

    addToGroup: function(entity, groupId) {
        var self = this;
        var newGroups = [];

        if (entity && groupId && (groupId in self.groups)) {
            if (self.groups.hasOwnProperty(groupId)) {
                self.map.forEachAdjacentGroup(groupId, function(id) {
                    if (self.groups[id] && self.groups[id].entities) {
                        self.groups[id].entities[entity.id] = entity;
                        newGroups.push(id);
                    }
                });

                entity.group = groupId;

                if (entity instanceof Player)
                    self.groups[groupId].players.push(entity.id);
            }
        }
        return newGroups;
    },


    pushToAdjacentGroups: function(groupId, message, ignoredPlayer) {
        var self = this;

        self.map.forEachAdjacentGroup(groupId, function(id) {
            self.pushToGroup(id, message, ignoredPlayer);
        });
    },


    pushToPreviousGroups: function(player, message) {
        var self = this;

        _.each(player.recentlyLeftGroups, function(id) {
            self.pushToGroup(id, message);
        });

        player.recentlyLeftGroups = [];
    },

    pushBroadcast: function(message, ignoredPlayer)  {
        var self = this;
        for (var id in self.packets) {
            if (self.packets.hasOwnProperty(id)) {
                if (id != ignoredPlayer)
                    self.packets[id].push(message.serialize());
            }
        }
    },

    broadcastAttacker: function(character) {
        var self = this;
        if (character)
            self.pushToAdjacentGroups(character.group, character.attack(), character.id);

        if (self.attack_callback)
            self.attack_callback(character);
    },

    addEntity: function(entity) {
        var self = this;
        self.entities[entity.id] = entity;
        self.handleEntityGroupMembership(entity);
    },

    addPlayer: function(player) {
        var self = this;
        self.addEntity(player);
        self.players[player.id] = player;
        self.packets[player.id] = [];
    },

    addMob: function(mob) {
        var self = this;
        self.addEntity(mob);
        self.mobs[mob.id] = mob;
    },

    addGather: function(gather) {
        var self = this;
        self.addEntity(gather);
        self.gather[gather.id] = gather;
    },

    addProjectile: function(projectile) {
        var self = this;
        self.addEntity(projectile);
        self.projectiles[projectile.id] = projectile;
    },

    addNpc: function(kind, x, y) {
        var self = this;

        var npc = new Npc('8' + x + y, kind, x, y);
        self.addEntity(npc);
        self.npcs[npc.id] = npc;
        npc.isAchievementNPC = Types.isAchievementNPC(kind);

        return npc;
    },

    addPet: function (player, kind, x, y) {
        var self = this;
        var pet = new Pet('9'+player.id+kind, kind, x, y, player.id);
        self.addEntity(pet);
        self.pets[pet.id] = pet;
        pet.onStep(function() {

        });

        pet.onRequestPath(function(x, y) {
            if (this.x == x && this.y == y)
                return null;
            var ignore = [this, self.getEntityById(this.playerId)];
            //log.info("path="+JSON.stringify(path));
            return self.mobController.findPath(this, x, y);
        });

        pet.onStopPathing(function(x, y) {
        });
        player.pets.push(pet);
        return pet;
    },

    addItem: function(item) {
        var self = this;

        self.addEntity(item);
        self.items[item.id] = item;

        return item;
    },


    removeEntity: function(entity) {
        var self = this;

        if (entity.id in self.pets)
            delete self.pets[entity.id];

        if (entity.id in self.entities)
            delete self.entities[entity.id];

        if (entity.id in self.mobs)
            delete self.mobs[entity.id];

        if (entity.id in self.items)
            delete self.items[entity.id];

        if (entity.id in self.gather)
            delete self.gather[entity.id];

        if (entity.type == 'mob') {
            self.clearMobAggroLink(entity);
            self.clearMobHateLinks(entity);
        }

        entity.destroy();
        self.removeFromGroups(entity);
    },

    removePlayer: function(player) {
        var self = this;

        if (player.party) {
            var party = player.party;
            party.removePlayer(player);
            player.packetHandler.handlePartyAbandoned(party);
        }

        if (player.pets) {
            for (var i=0; i < player.pets.length; ++i) {
                var pet = player.pets[i];
                self.removeEntity(pet);
            }
            player.pets = null;
        }

        player.packetHandler.broadcast(player.despawn());
        self.removeEntity(player);
        //self.decrementPlayerCount();

        delete self.players[player.id];
        delete self.packets[player.id];
    },

    createItem: function(kind, x, y, count) {
        var self = this;
        var id = '9' +  self.itemCount++;
        var item = null;

        if (kind === 37) // CHEST
            item = new Chest(id, x, y);
        else
            item = new Item(id, kind, x, y, count);

        return item;
    },

    createChest: function(x, y, items) {
        var self = this;
        var chest = self.createItem(37, x, y); // CHEST
        //log.info("Items: " + items);
        chest.setItems(items);
        return chest;
    },

    addStaticItem: function(item) {
        var self = this;

        item.isStatic = true;
        item.onRespawn(self.addStaticItem.bind(self, item));

        return self.addItem(item);
    },

    addItemFromChest: function(kind, x, y) {
        var self = this;
        var item = self.createItem(kind, x, y);
        item.isFromChest = true;

        return self.addItem(item);
    },

    clearMobAggroLink: function(mob) {
        var self = this;
        var player = null;
        if (mob.target) {
            player = self.getEntityById(mob.target.id);
            if (player)
                player.removeAttacker(mob);
        }
    },

    clearMobHateLinks: function(mob) {
        var self = this;
        if (mob) {
            _.each(mob.hatelist, function(obj) {
                var player = self.getEntityById(obj.id);
                if (player && player instanceof Player)
                    player.removeHater(mob);
            });
        }
    },

    getEntityById: function(id) {
        var self = this;
        if (id in self.entities) {
            if (self.entities.hasOwnProperty(id))
                return self.entities[id];
        }
    },

    forEachEntity: function(callback) {
        var self = this;
        for (var id in self.entities) {
            if (self.entities.hasOwnProperty(id))
                callback(self.entities[id]);
        }
    },

    forEachPlayer: function(callback) {
        var self = this;
        for (var id in self.players) {
            if (self.players.hasOwnProperty(id))
                callback(self.players[id]);
        }
    },

    forEachMob: function(callback) {
        var self = this;
        for (var id in self.mobs) {
            if (self.mobs.hasOwnProperty(id))
                callback(self.mobs[id]);
        }
    },

    forEachCharacter: function(callback) {
        var self = this;

        self.forEachPlayer(callback);
        self.forEachMob(callback);
    },

    forEachPet: function(callback) {
        var self = this;
        for (var id in self.pets) {
            if (self.pets.hasOwnProperty(id))
                callback(self.pets[id]);
        }
    },

    forEachGather: function(callback) {
        var self = this;
        for (var id in self.gather) {
            if (self.gather.hasOwnProperty(id))
                callback(self.gather[id]);
        }
    },

    chooseMobTarget: function(mob, hateRank) {
        var self = this;
        var player = self.getEntityById(mob.getHatedPlayerId(hateRank));

        if (player && !(mob.id in player.attackers)) {
            self.clearMobAggroLink(mob);

            player.addAttacker(mob);
            mob.setTarget(player);

            self.broadcastAttacker(mob);
        }
    },

    handlePlayerVanish: function(player) {
        var self = this;
        var previousAttackers = [];

        player.forEachAttacker(function(mob) {
            previousAttackers.push(mob);
            self.chooseMobTarget(mob, 2);
        });

        _.each(previousAttackers, function(mob) {
            player.removeAttacker(mob);
            mob.clearTarget();
            mob.forgetPlayer(player.id, 1000);
        });

        self.database.setPlayerPosition(player, player.x, player.y);

        self.handleEntityGroupMembership(player);
        self.pushToPreviousGroups(player, new Messages.Destroy(player));
        //self.pushRelevantEntityListTo(player);
    },

    handleMobHate: function(mobId, entityId, hatePoints) {
        var self = this;
        var mob = self.getEntityById(mobId);
        var entity = self.getEntityById(entityId);
        var mostHated;

        if (entity && mob && entity instanceof Player) {
            mob.increaseHateFor(entityId, hatePoints);
            entity.addHater(mob);

            if (mob.hitPoints > 0)
                self.chooseMobTarget(mob);
        }
    },

    handleGather: function (player, target) {
        var self = this;
        var item = self.getDroppedGatherItem(target);
        var xp = GatherData.Kinds[target.kind].xp;
        player.incExp(xp);
        self.pushToPlayer(player, new Messages.Kill(target, player.level, xp));
        self.pushToAdjacentGroups(target.group, target.despawn());
        self.removeEntity(target);

        if (item && item.count > 0) {
            self.pushToAdjacentGroups(target.group, target.drop(item));
            self.pushToPlayer(player, target.drop(item));
            self.handleItemDespawn(item);
        }
    },

    handleHurtEntity: function(entity, attacker, damage) {
        var self = this;
        
        if (entity instanceof Player)
            self.pushToPlayer(entity, entity.health(attacker));

        if (attacker instanceof Player)
            attacker.packetHandler.broadcast(new Messages.Damage(entity, damage == 0 ? "MISS" : damage, entity.hitPoints, entity.maxHitPoints, attacker.id), false);


        if (entity.hitPoints <= 0) {
            if (entity.type === 'mob') {
                var mob = entity;
                var item = self.getDroppedItem(mob);

                var mainTanker = self.getEntityById(mob.getMainTankerId());

                if (mainTanker && mainTanker instanceof Player) {
                    if (mainTanker.party)
                        mainTanker.party.incExp(mob);
                    else {
                        mainTanker.incExp(MobData.Kinds[mob.kind].xp, mob);
                        self.pushToPlayer(mainTanker, new Messages.Kill(mob, mainTanker.level, mob.xp));
                    }
                } else {
                    if (attacker.party)
                        attacker.party.incExp(mob);

                    else
                    {
                        attacker.incExp(MobData.Kinds[mob.kind].xp, mob);
                        self.pushToPlayer(attacker, new Messages.Kill(mob, attacker.level, mob.xp));
                    }
                }

                self.pushToAdjacentGroups(mob.group, mob.despawn());

                if (item && item.count > 0) {
                    self.pushToAdjacentGroups(mob.group, mob.drop(item));
                    self.handleItemDespawn(item);
                }
            }

            if (entity.type === 'player') {

                if (entity.getTeam() == Types.Messages.REDTEAM)
                    self.getMinigameHandler().getPVPMinigame().redScore += 1;
                else if (entity.getTeam() == Types.Messages.BLUETEAM)
                    self.getMinigameHandler().getPVPMinigame().blueScore += 1;

                attacker.addPVPKill();
                entity.addPVPDeath();

                self.handlePlayerVanish(entity);
                self.pushToAdjacentGroups(entity.group, entity.despawn());
            }

            attacker.removeAttacker(entity);
            self.removeEntity(entity);
        }
    },

    handleEntityGroupMembership: function(entity) {
        var self = this;
        var changedGroups = false;

        if (entity) {
            var groupId = self.map.getGroupIdFromPosition(entity.x, entity.y);
            if (!entity.group || (entity.group && entity.group !== groupId)) {
                changedGroups = true;
                self.addAsIncomingToGroup(entity, groupId);
                var oldGroups = self.removeFromGroups(entity);
                var newGroups = self.addToGroup(entity, groupId);

                if (_.size(oldGroups) > 0)
                    entity.recentlyLeftGroups = _.difference(oldGroups, newGroups);
            }
        }
        return changedGroups;
    },

    handleItemDespawn: function(item) {
        var self = this;
        if(item) {
            item.handleDespawn({
                beforeBlinkDelay: 20000,
                blinkCallback: function() {
                    self.pushToAdjacentGroups(item.group, new Messages.Blink(item));
                },
                blinkingDuration: 4000,
                despawnCallback: function() {
                    self.pushToAdjacentGroups(item.group, new Messages.Destroy(item));
                    self.removeEntity(item);
                }
            });
        }
    },

    handleEmptyChestArea: function(area) {
        var self = this;
        if(area) {
            var chest = self.addItem(self.createChest(area.chestX, area.chestY, area.items));
            self.handleItemDespawn(chest);
        }
    },

    handleOpenedChest: function(chest, player) {
        var self = this;
        self.pushToAdjacentGroups(chest.group, chest.despawn());
        self.removeEntity(chest);

        var itemString = chest.getRandomItem();
        var kind = ItemTypes.getKindFromString(itemString);
        if (kind) {
            var item = self.addItemFromChest(kind, chest.x, chest.y);
            self.handleItemDespawn(item);
        }
    },

    /*despawn: function(entity) {
     var self = this;
     self.pushToAdjacentGroups(entity.group, entity.despawn());

     if (entity.id in self.entities) {
     if (self.entities.hasOwnProperty(entity.id))
     self.removeEntity(entity);
     }
     },*/

    spawnStaticEntities: function() {
        var self = this;
        var count = 0;

        _.each(self.map.staticEntities, function(kindName, tid) {
            var kind;
            if (MobData.Properties[kindName])
                kind = MobData.Properties[kindName].kind;
            else if (NpcData.Properties[kindName])
            {
                kind = NpcData.Properties[kindName].kind;
            }
            else
                kind = ItemTypes.getKindFromString(kindName);

            var pos = self.map.tileIndexToGridPosition(tid);

            if (NpcData.isNpc(kind))
                self.addNpc(kind, pos.x + 1, pos.y);

            if (MobData.isMob(kind)) {
                var mob = new Mob('7' + kind + count++, kind, pos.x + 1, pos.y);
                mob.onRespawn(function() {
                    mob.isDead = false;
                    self.addMob(mob);
                    if (mob.area && mob.area instanceof ChestArea)
                        mob.area.addToArea(mob);
                });


                mob.onMove(self.onMobMoveCallback.bind(self));

                self.addMob(mob);
                self.tryAddingMobToChestArea(mob);
            }

            kind = ItemTypes.getKindFromString(kindName);
            if (ItemTypes.isItem(kind))
                self.addStaticItem(self.createItem(kind, pos.x + 1, pos.y));
        });
    },

    spawnEntity: function(kind, x, y) {
        var self = this;

        //log.info("kind="+kind);
        if (NpcData.isNpc(kind))
            self.addNpc(kind, x, y);
        else if (GatherData.isGather(kind)) {
            //log.info("create gather");
            var gather = new Gather('8' + kind + x + y, kind, x, y);
            self.addGather(gather);
            gather.onRespawn(function() {
                var posX = ~~(Utils.randomRange(0,self.map.width));
                var posY = ~~(Utils.randomRange(0,self.map.height));
                while (!self.isValidPosition(posX, posY))
                {
                    posX = ~~(Utils.randomRange(0,self.map.width));
                    posY = ~~(Utils.randomRange(0,self.map.height));
                }
                gather.x = posX;
                gather.y = posY;
                self.addGather(gather);
            });

        }
        else if (MobData.isMob(kind)) {
            var mob = new Mob('7' + kind + x + y, kind, x, y);

            mob.onRespawn(function() {
                mob.isDead = false;
                self.addMob(mob);

                if (mob.area && mob.area instanceof ChestArea)
                    mob.area.addToArea(mob);
            });

            mob.onMove(self.onMobMoveCallback.bind(self));

            self.addMob(mob);
            self.tryAddingMobToChestArea(mob);
        } else if (ItemTypes.isItem(kind))
            self.addStaticItem(self.createItem(kind, x, y));
    },


    isValidPosition: function(x, y) {
        var self = this;
        return self.map && _.isNumber(x) && _.isNumber(y) && !self.map.isOutOfBounds(x, y) && !self.map.isColliding(x, y);
    },

    getDroppedGatherItem: function(gather) {
        var self = this;
        var drops = GatherData.Kinds[gather.kind].drops;
        var v = Utils.random(1000);
        var p = 0;
        var m = 0;
        var item = null;
        for (var itemName in drops) {
            if (drops.hasOwnProperty(itemName)) {
                var percentage = drops[itemName];

                m = p;
                p += percentage;

                if (v >= m && v < p) {
                    item = self.addItem(self.createItem(ItemTypes.getKindFromString(itemName), gather.x, gather.y));
                    break;
                }
            }
        }
        return item;
    },

    getDroppedItem: function(mob) {
        var self = this,
            drops = mob.drops,
            v = Utils.random(1000),
            p = 0,
            m = 0,
            item = null;


        for (var itemName in drops) {
            if (drops.hasOwnProperty(itemName)) {
                var getPercentage = drops[itemName];
                m = p;
                p += getPercentage;

                if (v >= m && v < p) {
                    var logic = ItemTypes.getKindFromString(itemName) == 400 ? Utils.randomInt(1, mob.level * (Math.floor(Math.pow(2, mob.level / 7) / (mob.level / 4)))) : 1;
                    item = self.createItem(ItemTypes.getKindFromString(itemName), mob.x, mob.y, logic);
                    self.addItem(item);

                    return item;
                }
            }
        }

        return null;
    },

    spawnStaticEntities2: function() {
        var self = this;
        _.each(EntitySpawn.EntitySpawnData, function(value, key) {
            self.spawnEntity(value.id, value.x, value.y);
        });
    },

    findPositionNextTo: function(entity, target) {
        var self = this;
        var valid = false;
        var pos;

        while (!valid) {
            pos = entity.getPositionNextTo(target);
            valid = self.isValidPosition(pos.x, pos.y);
        }

        return pos;
    },

    moveMobEntity: function(entity, x, y) {
        if(entity) {
            entity.setPosition(x, y);
            this.handleEntityGroupMembership(entity);
            this.pushToAdjacentGroups(entity.group, new Messages.Move(entity));
        }
    },

    onPlayerConnect: function(callback) {
        this.connect_callback = callback;
    },

    onPlayerEnter: function(callback) {
        this.enter_callback = callback;
    },

    onPlayerAdded: function(callback) {
        this.added_callback = callback;
    },

    onPlayerRemoved: function(callback) {
        this.removed_callback = callback;
    },

    onRegenTick: function(callback) {
        this.regen_callback = callback;
    },

    onEntityAttack: function(callback) {
        this.attack_callback = callback;
    },

    onMobMoveCallback: function(mob) {
        var self = this;

        self.handleEntityGroupMembership(mob);
        self.pushToAdjacentGroups(mob.group, new Messages.Move(mob));
    },

    getCycleSpeed: function() {
        return this.cycleSpeed;
    },

    getPlayerByName: function(name) {
        var self = this;
        for (var id in self.players) {
            if (self.players.hasOwnProperty(id)) {
                if (self.players[id].name.toLowerCase() === name.toLowerCase())
                    return self.players[id];
            }
        }
        return null;
    },

    tryAddingMobToChestArea: function(mob) {
        var self = this;
        _.each(self.chestAreas, function(area) {
            if (area.contains(mob))
                area.addToArea(mob);
        });
    },

    updatePopulation: function(totalPlayers) {
        this.pushBroadcast(new Messages.Population(this.playerCount, totalPlayers ? totalPlayers : this.playerCount));
    },

    incrementPlayerCount: function() {
        this.setPlayerCount(this.playerCount + 1);
    },

    getPlayerCount: function() {
        var count = 0;
        for (var p in this.players) {
            if (this.players.hasOwnProperty(p))
                count += 1;
        }

        return count;
    },

    setPlayerCount: function(count) {
        this.playerCount = count;
    },

    decrementPlayerCount: function() {
        if (this.playerCount > 0)
            this.setPlayerCount(this.playerCount - 1);
    },

    resetCharacterData: function() {
        var self = this,
            dAttackSpeed = 50,
            dMoveSpeed = 150,
            dWalkSpeed = 100,
            dIdleSpeed = 450,
            dAttackRate = 1000;

        var data = [dAttackSpeed, dMoveSpeed, dWalkSpeed, dIdleSpeed, dAttackRate];

        self.sendToAll(new Messages.CharData(data));
    },

    getTargetsAround: function(entity, range) {
        var x = entity.x;
        var y = entity.y;
        var entities = [];
        this.forEachCharacter(function (entity) {
            if (entity.x >= x-range && entity.x <= x+range &&
                entity.y >= y-range && entity.y <= y+range)
            {
                entities.push(entity);
            }
        });
        return entities;
    },

    getMinigameHandler: function() {
        return this.minigameHandler;
    }
});
