/* global module, log */

var cls = require("../lib/class"),
  config = require("../../config.json"),
  Player = require("./entity/character/player/player"),
  Map = require("../map/map"),
  _ = require("underscore"),
  Messages = require("../network/messages"),
  Utils = require("../util/utils"),
  Mobs = require("../util/mobs"),
  Mob = require("./entity/character/mob/mob"),
  NPCs = require("../util/npcs"),
  NPC = require("./entity/npc/npc"),
  Items = require("../util/items"),
  Item = require("./entity/objects/item"),
  Chest = require("./entity/objects/chest"),
  Character = require("./entity/character/character"),
  Projectile = require("./entity/objects/projectile"),
  Packets = require("../network/packets"),
  Formulas = require("./formulas"),
  Modules = require("../util/modules"),
  Minigames = require("../controllers/minigames"),
  Shops = require("../controllers/shops");

module.exports = World = cls.Class.extend({
  constructor(id, socket, database) {
    

    this.id = id;
    this.socket = socket;
    this.database = database;

    this.playerCount = 0;
    this.maxPlayers = config.maxPlayers;
    this.updateTime = config.updateTime;
    this.debug = false;

    this.players = {};
    this.entities = {};
    this.items = {};
    this.chests = {};
    this.mobs = {};
    this.npcs = {};
    this.projectiles = {};

    this.packets = {};
    this.groups = {};

    this.loadedGroups = false;

    this.ready = false;

    this.malformTimeout = null;

    this.onPlayerConnection(function(connection) {
      var remoteAddress = connection.socket.conn.remoteAddress;

      if (config.development) {
        connection.sendUTF8("maintenance");
        connection.close();

        return;
      }

      var clientId = Utils.generateClientId(),
        player = new Player(self, this.database, connection, clientId),
        diff =
          new Date().getTime() -
          this.socket.ips[connection.socket.conn.remoteAddress];

      if (diff < 4000) {
        connection.sendUTF8("toofast");
        connection.close("Logging in too rapidly");

        return;
      }

      this.socket.ips[
        connection.socket.conn.remoteAddress
      ] = new Date().getTime();

      this.addToPackets(player);

      this.pushToPlayer(
        player,
        new Messages.Handshake(clientId, config.devClient)
      );
    });

    this.onPopulationChange(function() {
      /**
       * Grab the exact number of players from
       * the array of packets instead of adding
       * and subtracting and risking uncertainties.
       */

      this.pushBroadcast(new Messages.Population(this.getPopulation()));
    });
  },

  load(onWorldLoad) {
    

    log.info("************ World " + this.id + " ***********");

    /**
     * The reason maps are loaded per each world is because
     * we can have slight modifications for each world if we want in the
     * future. Using region loading, we can just send the client
     * whatever new map we have created server sided. Cleaner and nicer.
     */

    this.map = new Map(self);
    this.map.isReady(function() {
      this.loadGroups();

      this.spawnChests();
      this.spawnEntities();

      log.info("The map has been successfully loaded!");

      this.loaded();

      onWorldLoad();
    });
  },

  loaded() {
    
    /**
     * Similar to TTA engine here, but it's loaded upon initialization
     * rather than being called from elsewhere.
     */

    this.tick();

    if (!config.offlineMode) this.dataParser();

    this.ready = true;

    log.info("********************************");
  },

  tick() {
    

    setInterval(function() {
      this.parsePackets();
      this.parseGroups();
    }, 1000 / this.updateTime);
  },

  dataParser() {
    

    setInterval(function() {
      this.saveAll();
    }, 30000);
  },

  parsePackets() {
    

    /**
     * This parses through the packet pool and sends them
     */

    for (var id in this.packets) {
      if (this.packets[id].length > 0 && this.packets.hasOwnProperty(id)) {
        var conn = this.socket.getConnection(id);

        if (conn) {
          conn.send(this.packets[id]);
          this.packets[id] = [];
          this.packets[id].id = id;
        } else delete this.socket.getConnection(id);
      }
    }
  },

  parseGroups() {
    

    if (!this.loadedGroups) return;

    this.map.groups.forEachGroup(function(groupId) {
      if (this.groups[groupId].incoming.length < 1) return;

      this.sendSpawns(groupId);

      this.groups[groupId].incoming = [];
    });
  },

  /**
   * Entity related functions
   */

  kill(entity) {
    

    entity.applyDamage(entity.hitPoints);

    this.pushToAdjacentGroups(
      entity.group,
      new Messages.Points(entity.instance, entity.getHitPoints(), null)
    );
    this.pushToAdjacentGroups(
      entity.group,
      new Messages.Despawn(entity.instance)
    );

    this.handleDeath(entity, true);
  },

  handleDamage(attacker, target, damage) {
    

    if (!attacker || !target || isNaN(damage) || target.invincible) return;

    if (target.type === "player" && target.hitCallback)
      target.hitCallback(attacker, damage);

    //Stop screwing with this - it's so the target retaliates.

    target.hit(attacker);

    target.applyDamage(damage);

    this.pushToAdjacentGroups(
      target.group,
      new Messages.Points(target.instance, target.getHitPoints(), null)
    );

    if (target.getHitPoints() < 1) {
      target.combat.forEachAttacker(function(attacker) {
        attacker.removeTarget();

        this.pushToAdjacentGroups(
          target.group,
          new Messages.Combat(Packets.CombatOpcode.Finish, [
            attacker.instance,
            target.instance
          ])
        );

        if (attacker.type === "player" || target.type === "player") {
          if (target.type === "mob")
            attacker.addExperience(Mobs.getXp(target.id));

          if (attacker.type === "player") attacker.killCharacter(target);
        }
      });

      this.pushToAdjacentGroups(
        target.group,
        new Messages.Despawn(target.instance)
      );
      this.handleDeath(target);
    }
  },

  handleDeath(character, ignoreDrops) {
    

    if (!character) return;

    if (character.type === "mob") {
      var deathX = character.x,
        deathY = character.y;

      if (character.deathCallback) character.deathCallback();

      this.removeEntity(character);

      character.dead = true;

      character.destroy();

      character.combat.stop();

      if (!ignoreDrops) {
        var drop = character.getDrop();

        if (drop) this.dropItem(drop.id, drop.count, deathX, deathY);
      }
    } else if (character.type === "player") character.die();
  },

  createProjectile(info, hitInfo) {
    var self = this,
      attacker = info.shift(),
      target = info.shift();

    if (!attacker || !target) return null;

    var startX = attacker.x,
      startY = attacker.y,
      type = attacker.getProjectile(),
      hit = null;

    var projectile = new Projectile(
      type,
      Utils.generateInstance(5, type, startX + startY)
    );

    projectile.setStart(startX, startY);
    projectile.setTarget(target);

    if (attacker.type === "player") hit = attacker.getHit(target);

    projectile.damage = hit
      ? hit.damage
      : Formulas.getDamage(attacker, target, true);
    projectile.hitType = hit ? hit.type : Modules.Hits.Damage;

    projectile.owner = attacker;

    this.addProjectile(projectile);

    return projectile;
  },

  /**
   *
   * @param {{instance: int}} groupId
   */

  sendSpawns(groupId) {
    

    if (!groupId) return;

    _.each(this.groups[groupId].incoming, function(entity) {
      if (entity.instance === null) return;

      this.pushToGroup(
        groupId,
        new Messages.Spawn(entity),
        entity.isPlayer() ? entity.instance : null
      );
    });
  },

  loadGroups() {
    

    this.map.groups.forEachGroup(function(groupId) {
      this.groups[groupId] = {
        entities: {},
        players: [],
        incoming: []
      };
    });

    this.loadedGroups = true;
  },

  getEntityByInstance(instance) {
    if (instance in this.entities) return this.entities[instance];
  },

  /**
   * Important functions for sending
   * messages to the player(s)
   */

  pushBroadcast(message) {
    

    _.each(this.packets, function(packet) {
      packet.push(message.serialize());
    });
  },

  pushSelectively(message, ignores) {
    

    _.each(this.packets, function(packet) {
      if (ignores.indexOf(packet.id) < 0) packet.push(message.serialize());
    });
  },

  pushToPlayer(player, message) {
    if (player && player.instance in this.packets)
      this.packets[player.instance].push(message.serialize());
  },

  pushToGroup(id, message, ignoreId) {
    var self = this,
      group = this.groups[id];

    if (!group) return;

    _.each(group.players, function(playerId) {
      if (playerId !== ignoreId)
        this.pushToPlayer(this.getEntityByInstance(playerId), message);
    });
  },

  pushToAdjacentGroups(groupId, message, ignoreId) {
    

    this.map.groups.forEachAdjacentGroup(groupId, function(id) {
      this.pushToGroup(id, message, ignoreId);
    });
  },

  pushToOldGroups(player, message) {
    

    _.each(player.recentGroups, function(id) {
      this.pushToGroup(id, message);
    });

    player.recentGroups = [];
  },

  addToGroup(entity, groupId) {
    var self = this,
      newGroups = [];

    if (entity && groupId && groupId in this.groups) {
      this.map.groups.forEachAdjacentGroup(groupId, function(id) {
        var group = this.groups[id];

        if (group && group.entities) {
          group.entities[entity.instance] = entity;
          newGroups.push(id);
        }
      });

      entity.group = groupId;

      if (entity instanceof Player)
        this.groups[groupId].players.push(entity.instance);
    }

    return newGroups;
  },

  removeFromGroups(entity) {
    var self = this,
      oldGroups = [];

    if (entity && entity.group) {
      var group = this.groups[entity.group];

      if (entity instanceof Player)
        group.players = _.reject(group.players, function(id) {
          return id === entity.instance;
        });

      this.map.groups.forEachAdjacentGroup(entity.group, function(id) {
        if (this.groups[id] && entity.instance in this.groups[id].entities) {
          delete this.groups[id].entities[entity.instance];
          oldGroups.push(id);
        }
      });

      entity.group = null;
    }

    return oldGroups;
  },

  incomingToGroup(entity, groupId) {
    

    if (!entity || !groupId) return;

    this.map.groups.forEachAdjacentGroup(groupId, function(id) {
      var group = this.groups[id];

      if (group && !_.include(group.entities, entity.instance))
        group.incoming.push(entity);
    });
  },

  handleEntityGroup(entity) {
    var self = this,
      groupsChanged = false;

    if (!entity) return groupsChanged;

    var groupId = this.map.groups.groupIdFromPosition(entity.x, entity.y);

    if (!entity.group || (entity.group && entity.group !== groupId)) {
      groupsChanged = true;

      this.incomingToGroup(entity, groupId);

      var oldGroups = this.removeFromGroups(entity),
        newGroups = this.addToGroup(entity, groupId);

      if (_.size(oldGroups) > 0)
        entity.recentGroups = _.difference(oldGroups, newGroups);
    }

    return groupsChanged;
  },

  spawnEntities() {
    var self = this,
      entities = 0;

    _.each(this.map.staticEntities, function(key, tileIndex) {
      var isMob = !!Mobs.Properties[key],
        isNpc = !!NPCs.Properties[key],
        isItem = !!Items.Data[key],
        info = isMob
          ? Mobs.Properties[key]
          : isNpc
          ? NPCs.Properties[key]
          : isItem
          ? Items.getData(key)
          : null,
        position = this.map.indexToGridPosition(tileIndex);

      position.x++;

      if (!info || info === "null") {
        if (this.debug)
          log.info(
            "Unknown object spawned at: " + position.x + " " + position.y
          );

        return;
      }

      var instance = Utils.generateInstance(
        isMob ? 2 : isNpc ? 3 : 4,
        info.id + entities,
        position.x + entities,
        position.y
      );

      if (isMob) {
        var mob = new Mob(info.id, instance, position.x, position.y);

        mob.static = true;

        mob.onRespawn(function() {
          mob.dead = false;

          mob.refresh();

          this.addMob(mob);
        });

        this.addMob(mob);
      }

      if (isNpc)
        this.addNPC(new NPC(info.id, instance, position.x, position.y));

      if (isItem) {
        var item = this.createItem(info.id, instance, position.x, position.y);
        item.static = true;
        this.addItem(item);
      }

      entities++;
    });

    log.info("Spawned " + Object.keys(this.entities).length + " entities!");
  },

  spawnChests() {
    var self = this,
      chests = 0;

    _.each(this.map.chests, function(info) {
      this.spawnChest(info.i, info.x, info.y, true);

      chests++;
    });

    log.info("Spawned " + Object.keys(this.chests).length + " static chests");
  },

  spawnMob(id, x, y) {
    var self = this,
      instance = Utils.generateInstance(2, id, x + id, y),
      mob = new Mob(id, instance, x, y);

    if (!Mobs.exists(id)) return;

    this.addMob(mob);

    return mob;
  },

  spawnChest(items, x, y, staticChest) {
    var self = this,
      chestCount = Object.keys(this.chests).length,
      instance = Utils.generateInstance(5, 194, chestCount, x, y),
      chest = new Chest(194, instance, x, y);

    chest.items = items;

    if (staticChest) {
      chest.static = staticChest;

      chest.onRespawn(this.addChest.bind(self, chest));
    }

    chest.onOpen(function() {
      /**
       * Pretty simple concept, detect when the player opens the chest
       * then remove it and drop an item instead. Give it a 25 second
       * cooldown prior to respawning and voila.
       */

      this.removeChest(chest);

      this.dropItem(Items.stringToId(chest.getItem()), 1, chest.x, chest.y);
    });

    this.addChest(chest);

    return chest;
  },

  createItem(id, instance, x, y) {
    

    var item;

    if (Items.hasPlugin(id))
      item = new (Items.isNewPlugin(id))(id, instance, x, y);
    else item = new Item(id, instance, x, y);

    return item;
  },

  dropItem(id, count, x, y) {
    var self = this,
      instance = Utils.generateInstance(
        4,
        id + Object.keys(this.entities).length,
        x,
        y
      );

    var item = this.createItem(id, instance, x, y);

    item.count = count;
    item.dropped = true;

    this.addItem(item);
    item.despawn();

    item.onBlink(function() {
      this.pushBroadcast(new Messages.Blink(item.instance));
    });

    item.onDespawn(function() {
      this.removeItem(item);
    });
  },

  pushEntities(player) {
    var self = this,
      entities;

    if (!player || !(player.group in this.groups)) return;

    entities = _.keys(this.groups[player.group].entities);

    entities = _.reject(entities, function(instance) {
      return instance === player.instance;
    });

    entities = _.map(entities, function(instance) {
      return parseInt(instance);
    });

    if (entities) player.send(new Messages.List(entities));
  },

  addEntity(entity) {
    

    if (entity.instance in this.entities)
      log.info("Entity " + entity.instance + " already exists.");

    this.entities[entity.instance] = entity;

    if (entity.type !== "projectile") this.handleEntityGroup(entity);

    if (entity.x > 0 && entity.y > 0)
      this.getGrids().addToEntityGrid(entity, entity.x, entity.y);

    entity.onSetPosition(function() {
      this.getGrids().updateEntityPosition(entity);

      if (entity.isMob() && entity.isOutsideSpawn()) {
        entity.removeTarget();
        entity.combat.forget();
        entity.combat.stop();

        entity.return();

        this.pushBroadcast(
          new Messages.Combat(
            Packets.CombatOpcode.Finish,
            null,
            entity.instance
          )
        );
        this.pushBroadcast(
          new Messages.Movement(Packets.MovementOpcode.Move, [
            entity.instance,
            entity.x,
            entity.y,
            false,
            false
          ])
        );
      }
    });

    if (entity instanceof Character) {
      entity.getCombat().setWorld(self);

      entity.onStunned(function(stun) {
        this.pushToAdjacentGroups(
          entity.group,
          new Messages.Movement(Packets.MovementOpcode.Stunned, [
            entity.instance,
            stun
          ])
        );
      });
    }
  },

  addPlayer(player) {
    

    this.addEntity(player);
    this.players[player.instance] = player;

    if (this.populationCallback) this.populationCallback();
  },

  addToPackets(player) {
    

    this.packets[player.instance] = [];
  },

  addNPC(npc) {
    

    this.addEntity(npc);
    this.npcs[npc.instance] = npc;
  },

  addMob(mob) {
    

    if (!Mobs.exists(mob.id)) {
      log.error("Cannot spawn mob. " + mob.id + " does not exist.");
      return;
    }

    this.addEntity(mob);
    this.mobs[mob.instance] = mob;

    mob.addToChestArea(this.getChestAreas());

    mob.onHit(function(attacker) {
      if (mob.isDead() || mob.combat.started) return;

      mob.combat.begin(attacker);
    });
  },

  addItem(item) {
    

    if (item.static) item.onRespawn(this.addItem.bind(self, item));

    this.addEntity(item);
    this.items[item.instance] = item;
  },

  addProjectile(projectile) {
    

    this.addEntity(projectile);
    this.projectiles[projectile.instance] = projectile;
  },

  addChest(chest) {
    

    this.addEntity(chest);
    this.chests[chest.instance] = chest;
  },

  removeEntity(entity) {
    

    if (entity.instance in this.entities) delete this.entities[entity.instance];

    if (entity.instance in this.mobs) delete this.mobs[entity.instance];

    if (entity.instance in this.items) delete this.items[entity.instance];

    this.getGrids().removeFromEntityGrid(entity, entity.x, entity.y);

    this.removeFromGroups(entity);
  },

  cleanCombat(entity) {
    entity.combat.stop();

    _.each(this.entities, function(oEntity) {
      if (oEntity instanceof Character && oEntity.combat.hasAttacker(entity))
        oEntity.combat.removeAttacker(entity);
    });
  },

  removeItem(item) {
    

    this.removeEntity(item);
    this.pushBroadcast(new Messages.Despawn(item.instance));

    if (item.static) item.respawn();
  },

  removePlayer(player) {
    

    this.pushToAdjacentGroups(
      player.group,
      new Messages.Despawn(player.instance)
    );

    if (player.ready) player.save();

    if (this.populationCallback) this.populationCallback();

    this.removeEntity(player);

    this.cleanCombat(player);

    if (player.isGuest) this.database.delete(player);

    delete this.players[player.instance];
    delete this.packets[player.instance];
  },

  removeProjectile(projectile) {
    

    this.removeEntity(projectile);

    delete this.projectiles[projectile.instance];
  },

  removeChest(chest) {
    

    this.removeEntity(chest);
    this.pushBroadcast(new Messages.Despawn(chest.instance));

    if (chest.static) chest.respawn();
    else delete this.chests[chest.instance];
  },

  playerInWorld(username) {
    

    for (var id in this.players)
      if (this.players.hasOwnProperty(id))
        if (this.players[id].username === username) return true;

    return false;
  },

  getPlayerByName(username) {
    

    for (var id in this.players)
      if (this.players.hasOwnProperty(id))
        if (this.players[id].username.toLowerCase() === username.toLowerCase())
          return this.players[id];

    return null;
  },

  saveAll() {
    

    _.each(this.players, function(player) {
      player.save();
    });
  },

  getPVPAreas() {
    return this.map.areas["PVP"].pvpAreas;
  },

  getMusicAreas() {
    return this.map.areas["Music"].musicAreas;
  },

  getChestAreas() {
    return this.map.areas["Chests"].chestAreas;
  },

  getGrids() {
    return this.map.grids;
  },

  getPopulation() {
    return _.size(this.players);
  },

  onPlayerConnection(callback) {
    this.playerConnectCallback = callback;
  },

  onPopulationChange(callback) {
    this.populationCallback = callback;
  }
});
