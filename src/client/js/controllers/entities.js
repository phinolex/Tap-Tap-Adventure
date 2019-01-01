/* global log, _, Modules, Packets */

define([
  "../renderer/grids",
  "../entity/objects/chest",
  "../entity/character/character",
  "../entity/character/player/player",
  "../entity/objects/item",
  "./sprites",
  "../entity/character/mob/mob",
  "../entity/character/npc/npc",
  "../entity/objects/projectile"
], function(
  Grids,
  Chest,
  Character,
  Player,
  Item,
  Sprites,
  Mob,
  NPC,
  Projectile
) {
  return Class.extend({
    init(game) {
      var self = this;

      this.game = game;
      this.renderer = game.renderer;

      this.grids = null;
      this.sprites = null;

      this.entities = {};
      this.decrepit = {};
    },

    load() {
      var self = this;

      this.game.app.sendStatus("Lots of monsters ahead...");

      if (!this.sprites) {
        this.sprites = new Sprites(this.game.renderer);

        this.sprites.onLoadedSprites(function() {
          this.game.input.loadCursors();
        });
      }

      this.game.app.sendStatus("Yes, you are also a monster...");

      if (!this.grids) this.grids = new Grids(this.game.map);
    },

    update() {
      var self = this;

      if (this.sprites) this.sprites.updateSprites();
    },

    create(info) {
      var self = this,
        entity;

      if (this.isPlayer(info.id)) return;

      switch (info.type) {
        case "chest":
          /**
           * Here we will parse the different types of chests..
           * We can go Dark Souls style and implement mimics
           * the proper way -ahem- TTA V1.0
           */

          var chest = new Chest(info.id, info.string);

          entity = chest;

          break;

        case "npc":
          var npc = new NPC(info.id, info.string);

          entity = npc;

          break;

        case "item":
          var item = new Item(
            info.id,
            info.string,
            info.count,
            info.ability,
            info.abilityLevel
          );

          entity = item;

          break;

        case "mob":
          var mob = new Mob(info.id, info.string);

          mob.setHitPoints(info.hitPoints);
          mob.setMaxHitPoints(info.maxHitPoints);

          mob.attackRange = info.attackRange;
          mob.level = info.level;

          entity = mob;

          break;

        case "projectile":
          var attacker = this.get(info.characterId),
            target = this.get(info.targetId);

          if (!attacker || !target) return;

          attacker.lookAt(target);

          var projectile = new Projectile(
            info.id,
            info.projectileType,
            attacker
          );

          projectile.name = info.name;

          projectile.setStart(attacker.x, attacker.y);
          projectile.setTarget(target);

          projectile.setSprite(this.getSprite(projectile.name));
          projectile.setAnimation("travel", projectile.getSpeed());

          projectile.angled = true;
          projectile.type = info.type;

          /**
           * Move this into the external overall function
           */

          projectile.onImpact(function() {
            /**
             * The data in the projectile is only for rendering purposes
             * there is nothing you can change for the actual damage output here.
             */

            if (this.isPlayer(projectile.owner.id) || this.isPlayer(target.id))
              this.game.socket.send(Packets.Projectile, [
                Packets.ProjectileOpcode.Impact,
                info.id,
                target.id
              ]);

            if (info.hitType === Modules.Hits.Explosive)
              target.explosion = true;

            this.game.info.create(
              Modules.Hits.Damage,
              [info.damage, this.isPlayer(target.id)],
              target.x,
              target.y
            );

            target.triggerHealthBar();

            this.unregisterPosition(projectile);
            delete this.entities[projectile.getId()];
          });

          this.addEntity(projectile);

          attacker.performAction(attacker.orientation, Modules.Actions.Attack);
          attacker.triggerHealthBar();

          return;

        case "player":
          var player = new Player();

          player.setId(info.id);
          player.setName(info.name);
          player.setGridPosition(info.x, info.y);

          player.rights = info.rights;
          player.level = info.level;
          player.pvp = info.pvp;
          player.pvpKills = info.pvpKills;
          player.pvpDeaths = info.pvpDeaths;
          player.type = info.type;

          var hitPointsData = info.hitPoints,
            manaData = info.mana;

          player.setHitPoints(hitPointsData[0]);
          player.setMaxHitPoints(hitPointsData[1]);

          player.setMana(manaData[0]);
          player.setMaxMana(manaData[1]);

          player.setSprite(this.getSprite(info.armour[1]));
          player.idle();

          player.setEquipment(Modules.Equipment.Armour, info.armour);
          player.setEquipment(Modules.Equipment.Weapon, info.weapon);
          player.setEquipment(Modules.Equipment.Pendant, info.pendant);
          player.setEquipment(Modules.Equipment.Ring, info.ring);
          player.setEquipment(Modules.Equipment.Boots, info.boots);

          player.loadHandler(this.game);

          this.addEntity(player);

          return;
      }

      if (!entity) return;

      entity.setGridPosition(info.x, info.y);
      entity.setName(info.name);

      entity.setSprite(
        this.getSprite(
          info.type === "item" ? "item-" + info.string : info.string
        )
      );

      entity.idle();
      entity.type = info.type;

      this.addEntity(entity);

      if (info.type !== "item" && entity.handler) {
        entity.handler.setGame(this.game);
        entity.handler.load();
      }

      /**
       * Get ready for errors!
       */
    },

    isPlayer(id) {
      return this.game.player.id === id;
    },

    get(id) {
      var self = this;

      if (id in this.entities) return this.entities[id];

      return null;
    },

    exists(id) {
      return id in this.entities;
    },

    clearPlayers(exception) {
      var self = this;

      _.each(this.entities, function(entity) {
        if (entity.id !== exception.id && entity.type === "player") {
          this.grids.removeFromRenderingGrid(
            entity,
            entity.gridX,
            entity.gridY
          );
          this.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

          delete this.entities[entity.id];
        }
      });

      this.grids.resetPathingGrid();
    },

    addEntity(entity) {
      var self = this;

      if (this.entities[entity.id]) return;

      this.entities[entity.id] = entity;
      this.registerPosition(entity);

      if (
        !(entity instanceof Item && entity.dropped) &&
        !this.renderer.isPortableDevice()
      )
        entity.fadeIn(this.game.time);
    },

    removeItem(item) {
      var self = this;

      if (!item) return;

      this.grids.removeFromItemGrid(item, item.gridX, item.gridY);
      this.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

      delete this.entities[item.id];
    },

    registerPosition(entity) {
      var self = this;

      if (!entity) return;

      if (
        entity.type === "player" ||
        entity.type === "mob" ||
        entity.type === "npc" ||
        entity.type === "chest"
      ) {
        this.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

        if (entity.type !== "player" || entity.nonPathable)
          this.grids.addToPathingGrid(entity.gridX, entity.gridY);
      }

      if (entity.type === "item")
        this.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

      this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
    },

    registerDuality(entity) {
      var self = this;

      if (!entity) return;

      this.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

      this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

      if (entity.nextGridX > -1 && entity.nextGridY > -1) {
        this.grids.entityGrid[entity.nextGridY][entity.nextGridX][
          entity.id
        ] = entity;

        if (!(entity instanceof Player))
          this.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
      }
    },

    unregisterPosition(entity) {
      var self = this;

      if (!entity) return;

      this.grids.removeEntity(entity);
    },

    getSprite(name) {
      return this.sprites.sprites[name];
    },

    getAll() {
      return this.entities;
    },

    forEachEntity(callback) {
      _.each(this.entities, function(entity) {
        callback(entity);
      });
    },

    forEachEntityAround(x, y, radius, callback) {
      var self = this;

      for (var i = x - radius, max_i = x + radius; i <= max_i; i++) {
        for (var j = y - radius, max_j = y + radius; j <= max_j; j++) {
          if (this.map.isOutOfBounds(i, j)) continue;

          _.each(this.grids.renderingGrid[j][i], function(entity) {
            callback(entity);
          });
        }
      }
    }
  });
});
