/* global module, log */

var cls = require('../lib/class'),
    config = require('../../config.json'),
    Player = require('./entity/character/player/player'),
    Map = require('../map/map'),
    _ = require('underscore'),
    Messages = require('../network/messages'),
    Utils = require('../util/utils'),
    Mobs = require('../util/mobs'),
    Mob = require('./entity/character/mob/mob'),
    NPCs = require('../util/npcs'),
    NPC = require('./entity/npc/npc'),
    Items = require('../util/items'),
    Item = require('./entity/objects/item'),
    Character = require('./entity/character/character'),
    Projectile = require('./entity/objects/projectile'),
    Packets = require('../network/packets'),
    Formulas = require('./formulas'),
    Modules = require('../util/modules');

module.exports = World = cls.Class.extend({

    init: function(id, socket, database) {
        var self = this;

        self.id = id;
        self.socket = socket;
        self.database = database;

        self.playerCount = 0;
        self.maxPlayers = config.maxPlayers;
        self.updateTime = config.updateTime;
        self.debug = false;

        self.players = {};
        self.entities = {};
        self.items = {};
        self.mobs = {};
        self.npcs = {};
        self.projectiles = {};

        self.packets = {};
        self.groups = {};

        self.logging = [];

        self.loadedGroups = false;

        self.ready = false;

        self.malformTimeout = null;

        self.onPlayerConnection(function(connection) {
            var remoteAddress = connection.socket.conn.remoteAddress;

            if (self.logging.indexOf(remoteAddress) > -1) {
                connection.sendUTF8('malform');
                connection.close();

                if (!self.malformTimeout)
                    self.malformTimeout = setTimeout(function() {
                        self.removeLogging(remoteAddress);

                        clearTimeout(self.malformTimeout);
                        self.malformTimeout = null;
                    }, 20000);

                return;
            }

            var clientId = Utils.generateClientId(),
                player = new Player(self, self.database, connection, clientId);

            self.logging.push(remoteAddress);

            self.addToPackets(player);

            self.pushToPlayer(player, new Messages.Handshake(clientId, config.devClient));

            self.populationCallback(self.playerCount + 1);
        });

        self.onPopulationUpdate(function(newPopulation) {
            self.playerCount = newPopulation;

            self.pushBroadcast(new Messages.Population(self.playerCount));
        });
    },

    load: function() {
        var self = this;

        log.info('************ World ' + self.id + ' ***********');

        /**
         * The reason maps are loaded per each world is because
         * we can have slight modifications for each world if we want in the
         * future. Using region loading, we can just send the client
         * whatever new map we have created server sided. Cleaner and nicer.
         */

        self.map = new Map(self);
        self.map.isReady(function() {
            self.loadGroups();

            self.spawnEntities();
        });
        /**
         * Similar to TTA engine here, but it's loaded upon initialization
         * rather than being called from elsewhere.
         */

        self.tick();

        if (!config.offlineMode)
            self.dataParser();

        self.ready = true;

        log.info('********************************');
    },

    tick: function() {
        var self = this;

        setInterval(function() {

            self.parsePackets();
            self.parseGroups();

        }, 1000 / self.updateTime);
    },

    dataParser: function() {
        var self = this;

        setInterval(function() {
            self.saveAll();
        }, 30000);
    },

    parsePackets: function() {
        var self = this;

        /**
         * This parses through the packet pool and sends them
         */

        for (var id in self.packets) {
            if (self.packets[id].length > 0 && self.packets.hasOwnProperty(id)) {
                var conn = self.socket.getConnection(id);

                if (conn) {
                    conn.send(self.packets[id]);
                    self.packets[id] = [];
                    self.packets[id].id = id;
                } else
                    delete self.socket.getConnection(id);
            }
        }

    },

    parseGroups: function() {
        var self = this;

        if (!self.loadedGroups)
            return;

        self.map.groups.forEachGroup(function(groupId) {

            if (self.groups[groupId].incoming.length < 1)
                return;

            self.sendSpawns(groupId);

            self.groups[groupId].incoming = [];
        });
    },

    /**
     * Entity related functions
     */

    handleDamage: function(attacker, target, damage) {
        var self = this;

        if (!attacker || !target || isNaN(damage))
            return;

        //Stop screwing with this - it's so the target retaliates.

        target.hit(attacker);

        target.applyDamage(damage);

        self.pushToAdjacentGroups(target.group, new Messages.Points(target.instance, target.getHitPoints(), null));

        if (target.getHitPoints() < 1) {

            target.combat.forEachAttacker(function(attacker) {

                attacker.removeTarget();

                self.pushToAdjacentGroups(target.group, new Messages.Combat(Packets.CombatOpcode.Finish, [attacker.instance, target.instance]));


                /**
                 * Why do we check here for entity type here?
                 *
                 * It is well built to implement special abilities in the future
                 * such as when a player dies - all the nearby attackers have a
                 * wanted level on them or have some inflicted amage.
                 */

                if (target.type === 'mob')
                    attacker.addExperience(Mobs.getXp(target.id));

            });

            self.pushToAdjacentGroups(target.group, new Messages.Despawn(target.instance));
            self.handleDeath(target);
        }

    },

    handleDeath: function(character) {
        var self = this;

        if (character.type === 'mob') {
            var deathX = character.x,
                deathY = character.y;

            if (character.deathCallback)
                character.deathCallback();

            self.removeEntity(character);

            character.destroy();

            var drop = character.getDrop();

            if (drop)
                self.dropItem(drop.id, drop.count, deathX, deathY);


        } else if (character.type === 'player')
            character.die();
    },

    createProjectile: function(dynamic, info, hitInfo) {
        var self = this,
            projectile;

        if (dynamic) {
            var attacker = info.shift(),
                target = info.shift();

            if (!attacker || !target)
                return;

            var startX = attacker.x,
                startY = attacker.y,
                type = attacker.getProjectile();

            projectile = new Projectile(type, Utils.generateInstance(5, type, startX));

            projectile.setStart(startX, startY);
            projectile.setTarget(target);

            projectile.damage = Formulas.getDamage(attacker, target);
            projectile.owner = attacker;

            if (hitInfo.type !== Modules.Hits.Damage)
                projectile.special = hitInfo.type;

            self.addProjectile(projectile);

        }

        return projectile;
    },

    /**
     *
     * @param {{instance: int}} groupId
     */

    sendSpawns: function(groupId) {
        var self = this;

        if (!groupId)
            return;

        _.each(self.groups[groupId].incoming, function(entity) {
            if (entity.instance === null)
                return;

            self.pushToGroup(groupId, new Messages.Spawn(entity), entity.isPlayer() ? entity.instance : null);
        });
    },

    loadGroups: function() {
        var self = this;

        self.map.groups.forEachGroup(function(groupId) {
            self.groups[groupId] = {
                entities: {},
                players: [],
                incoming: []
            };

        });

        self.loadedGroups = true;
    },

    getEntityByInstance: function(instance) {
        if (instance in this.entities)
            return this.entities[instance];
    },

    /**
     * Important functions for sending
     * messages to the player(s)
     */

    pushBroadcast: function(message) {
        var self = this;

        _.each(self.packets, function(packet) {
            packet.push(message.serialize());
        });
    },

    pushSelectively: function(message, ignores) {
        var self = this;

        _.each(self.packets, function(packet) {
            if (ignores.indexOf(packet.id) < 0)
                packet.push(message.serialize());
        });
    },

    pushToPlayer: function(player, message) {
        if (player && player.instance in this.packets)
            this.packets[player.instance].push(message.serialize());
    },

    pushToGroup: function(id, message, ignoreId) {
        var self = this,
            group = self.groups[id];

        if (!group)
            return;

        _.each(group.players, function(playerId) {
            if (playerId !== ignoreId)
                self.pushToPlayer(self.getEntityByInstance(playerId), message);
        });
    },

    pushToAdjacentGroups: function(groupId, message, ignoreId) {
        var self = this;

        self.map.groups.forEachAdjacentGroup(groupId, function(id) {
            self.pushToGroup(id, message, ignoreId);
        });
    },

    pushToOldGroups: function(player, message) {
        var self = this;

        _.each(player.recentGroups, function(id) {
            self.pushToGroup(id, message);
        });

        player.recentGroups = [];
    },

    addToGroup: function(entity, groupId) {
        var self = this,
            newGroups = [];

        if (entity && groupId && (groupId in self.groups)) {
            self.map.groups.forEachAdjacentGroup(groupId, function(id) {
                var group = self.groups[id];

                if (group && group.entities) {
                    group.entities[entity.instance] = entity;
                    newGroups.push(id);
                }
            });

            entity.group = groupId;

            if (entity instanceof Player)
                self.groups[groupId].players.push(entity.instance);
        }

        return newGroups;
    },

    removeFromGroups: function(entity) {
        var self = this,
            oldGroups = [];

        if (entity && entity.group) {
            var group = self.groups[entity.group];

            if (entity instanceof Player)
                group.players = _.reject(group.players, function(id) { return id === entity.instance; });

            self.map.groups.forEachAdjacentGroup(entity.group, function(id) {
                if (self.groups[id] && entity.instance in self.groups[id].entities) {
                    delete self.groups[id].entities[entity.instance];
                    oldGroups.push(id);
                }
            });

            entity.group = null;
        }

        return oldGroups;
    },

    incomingToGroup: function(entity, groupId) {
        var self = this;

        if (!entity || !groupId)
            return;

        self.map.groups.forEachAdjacentGroup(groupId, function(id) {
            var group = self.groups[id];

            if (group && !_.include(group.entities, entity.instance))
                group.incoming.push(entity);
        });
    },

    handleEntityGroup: function(entity) {
        var self = this,
            groupsChanged = false;

        if (!entity)
            return groupsChanged;

        var groupId = self.map.groups.groupIdFromPosition(entity.x, entity.y);

        if (!entity.group || (entity.group && entity.group !== groupId)) {
            groupsChanged = true;

            self.incomingToGroup(entity, groupId);

            var oldGroups = self.removeFromGroups(entity),
                newGroups = self.addToGroup(entity, groupId);

            if (_.size(oldGroups) > 0)
                entity.recentGroups = _.difference(oldGroups, newGroups);
        }

        return groupsChanged;
    },

    spawnEntities: function() {
        var self = this,
            entities = 0;

        _.each(self.map.staticEntities, function(key, tileIndex) {
            var isMob = !!Mobs.Properties[key],
                isNpc = !!NPCs.Properties[key],
                isItem = !!Items.Data[key],
                info = isMob ? Mobs.Properties[key] : (isNpc ? NPCs.Properties[key] : isItem ? Items.getData(key) : null),
                position = self.map.indexToGridPosition(tileIndex);

            position.x++;

            if (!info || info === 'null') {
                if (self.debug)
                    log.info('Unknown object spawned at: ' + position.x + ' ' + position.y);

                return;
            }

            var instance = Utils.generateInstance(isMob ? 2 : (isNpc ? 3 : 4), info.id + entities, position.x + entities, position.y);

            if (isMob) {
                var mob = new Mob(info.id, instance, position.x, position.y);

                mob.static = true;

                mob.onRespawn(function() {
                    mob.dead = false;

                    mob.refresh();

                    self.addMob(mob);
                });

                self.addMob(mob);
            }

            if (isNpc)
                self.addNPC(new NPC(info.id, instance, position.x, position.y));

            if (isItem) {
                var item = new Item(info.id, instance, position.x, position.y);

                item.static = true;

                self.addItem(item);
            }

            entities++;
        });

        log.info('Spawned ' + Object.keys(self.entities).length + ' entities!');
    },

    spawnMob: function(id, x, y) {
        var self = this,
            instance = Utils.generateInstance(2, id, x + id, y),
            mob = new Mob(id, instance, x, y);

        if (!Mobs.exists(id))
            return;

        self.addMob(mob);

        return mob;
    },

    dropItem: function(id, count, x, y) {
        var self = this,
            instance = Utils.generateInstance(4, id + (Object.keys(self.entities)).length, x, y),
            item = new Item(id, instance, x, y);

        item.count = count;
        item.dropped = true;

        self.addItem(item);

        item.despawn();

        item.onBlink(function() {
            self.pushBroadcast(new Messages.Blink(item.instance));
        });

        item.onDespawn(function() {
            self.removeItem(item);
        });
    },

    pushEntities: function(player) {
        var self = this,
            entities;

        if (!player || !(player.group in self.groups))
            return;

        entities = _.keys(self.groups[player.group].entities);

        entities = _.reject(entities, function(instance) {
            return instance === player.instance;
        });

        entities = _.map(entities, function(instance) {
            return parseInt(instance);
        });

        if (entities)
            player.send(new Messages.List(entities));
    },

    addEntity: function(entity) {
        var self = this;

        if (entity.instance in self.entities)
            log.info('Entity ' + entity.instance + ' already exists.');

        self.entities[entity.instance] = entity;
        self.handleEntityGroup(entity);

        if (entity instanceof Character)
            entity.getCombat().setWorld(self);

    },

    addPlayer: function(player) {
        var self = this;

        self.addEntity(player);
        self.players[player.instance] = player;
    },

    addToPackets: function(player) {
        var self = this;

        self.packets[player.instance] = [];
    },

    addNPC: function(npc) {
        var self = this;

        self.addEntity(npc);
        self.npcs[npc.instance] = npc;
    },

    addMob: function(mob) {
        var self = this;

        if (!Mobs.exists(mob.id)) {
            log.error('Cannot spawn mob. ' + mob.id + ' does not exist.');
            return;
        }

        self.addEntity(mob);
        self.mobs[mob.instance] = mob;

        mob.onHit(function(attacker) {
            if (mob.isDead() || mob.combat.started)
                return;

            mob.combat.begin(attacker);
        });
    },

    addItem: function(item) {
        var self = this;

        if (item.static)
            item.onRespawn(self.addItem.bind(self, item));

        self.addEntity(item);
        self.items[item.instance] = item;
    },

    addProjectile: function(projectile) {
        var self = this;

        self.addEntity(projectile);
        self.projectiles[projectile.instance] = projectile;
    },

    removeEntity: function(entity) {
        var self = this;

        if (entity.instance in self.entities)
            delete self.entities[entity.instance];

        if (entity.instance in self.mobs)
            delete self.mobs[entity.instance];

        if (entity.instance in self.items)
            delete self.items[entity.instance];

        self.removeFromGroups(entity);
    },

    cleanCombat: function(entity) {
        entity.combat.stop();

        _.each(this.entities, function(oEntity) {
            if (oEntity instanceof Character && oEntity.combat.hasAttacker(entity))
                oEntity.combat.removeAttacker(entity);
        });
    },

    removeItem: function(item) {
        var self = this;

        self.removeEntity(item);
        self.pushBroadcast(new Messages.Despawn(item.instance));

        if (item.static)
            item.respawn();
    },

    removePlayer: function(player) {
        var self = this;

        self.pushToAdjacentGroups(player.group, new Messages.Despawn(player.instance));

        self.populationCallback(self.playerCount - 1);

        if (player.ready)
            player.save();

        self.removeEntity(player);

        self.cleanCombat(player);

        delete self.players[player.instance];
        delete self.packets[player.instance];
    },

    removeLogging: function(remoteAddress) {
        var self = this,
            index = self.logging.indexOf(remoteAddress);

        if (index > -1)
            self.logging.splice(index, 1);
    },

    playerInWorld: function(username) {
        var self = this;

        for (var id in self.players)
            if (self.players.hasOwnProperty(id))
                if (self.players[id].username === username)
                    return true;

        return false;
    },

    getPlayerByName: function(username) {
        var self = this;

        for (var id in self.players)
            if (self.players.hasOwnProperty(id))
                if (self.players[id].username.toLowerCase() === username.toLowerCase())
                    return self.players[id];

        return null;
    },

    saveAll: function() {
        var self = this;

        _.each(self.players, function(player) {
            player.save();
        })
    },

    getPVPAreas: function() {
        return this.map.areas['PVP'].pvpAreas;
    },

    getMusicAreas: function() {
        return this.map.areas['Music'].musicAreas;
    },

    onPopulationUpdate: function(callback) {
        this.populationCallback = callback;
    },

    onPlayerConnection: function(callback) {
        this.playerConnectCallback = callback;
    }

});