import _ from 'underscore';
import Grids from '../renderer/grids';
import Chest from '../entity/objects/chest';
import Player from '../entity/character/player/player';
import Item from '../entity/objects/item';
import Sprites from './sprites';
import Mob from '../entity/character/mob/mob';
import NPC from '../entity/character/npc/npc';
import Projectile from '../entity/objects/projectile';
import Modules from '../utils/modules';
import Packets from '../network/packets';

/**
 * Entities in the game
 * Character (Mob, Npc, Player), Chest, Item, Projectile
 * @class
 */
export default class Entities {
  constructor(game) {
    this.game = game;
    this.renderer = game.renderer;

    this.grids = null;
    this.sprites = null;

    this.entities = {};
    this.decrepit = {};
  }

  load() {
    this.game.app.sendStatus('Lots of monsters ahead...');

    if (!this.sprites) {
      this.sprites = new Sprites(this.game.renderer);

      this.sprites.onLoadedSprites(() => {
        this.game.input.loadCursors();
        this.game.start();
        this.game.postLoad();
      });
    }

    this.game.app.sendStatus('Yes, you are also a monster...');

    if (!this.grids) {
      this.grids = new Grids(this.game.map);
    }
  }

  update() {
    if (this.sprites) this.sprites.updateSprites();
  }

  create(info) {
    let entity;

    if (this.isPlayer(info.id)) {
      return;
    }

    switch (info.type) {
      default:
        break;
      case 'chest':
        /**
         * Here we will parse the different types of chests..
         * We can go Dark Souls style and implement mimics
         * the proper way -ahem- TTA V1.0
         */

        const chest = new Chest(info.id, info.string); // eslint-disable-line
        entity = chest;
        break;

      case 'npc':
        const npc = new NPC(info.id, info.string); // eslint-disable-line
        entity = npc;
        break;

      case 'item':
        const item = new Item( // eslint-disable-line
          info.id,
          info.string,
          info.count,
          info.ability,
          info.abilityLevel,
        );
        entity = item;
        break;

      case 'mob':
        const mob = new Mob(info.id, info.string); // eslint-disable-line

        mob.setHitPoints(info.hitPoints);
        mob.setMaxHitPoints(info.maxHitPoints);

        mob.attackRange = info.attackRange;
        mob.level = info.level;

        entity = mob;

        break;

      case 'projectile':
        const attacker = this.get(info.characterId); // eslint-disable-line
        const target = this.get(info.targetId); // eslint-disable-line

        if (!attacker || !target) {
          return;
        }

        attacker.lookAt(target);

        const projectile = new Projectile( // eslint-disable-line
          info.id,
          info.projectileType,
          attacker,
        );

        projectile.name = info.name;

        projectile.setStart(attacker.x, attacker.y);
        projectile.setTarget(target);

        projectile.setSprite(this.getSprite(projectile.name));
        projectile.setAnimation('travel', projectile.getSpeed());

        projectile.angled = true;
        projectile.type = info.type;

        /**
         * Move this into the external overall function
         */

        projectile.onImpact(() => {
          /**
           * The data in the projectile is only for rendering purposes
           * there is nothing you can change for the actual damage output here.
           */

          if (this.isPlayer(projectile.owner.id) || this.isPlayer(target.id)) {
            this.game.socket.send(Packets.Projectile, [
              Packets.ProjectileOpcode.Impact,
              info.id,
              target.id,
            ]);
          }

          if (info.hitType === Modules.Hits.Explosive) target.explosion = true;

          this.game.info.create(
            Modules.Hits.Damage,
            [info.damage, this.isPlayer(target.id)],
            target.x,
            target.y,
          );

          target.triggerHealthBar();

          this.unregisterPosition(projectile);
          delete this.entities[projectile.getId()];
        });

        this.addEntity(projectile);

        attacker.performAction(attacker.orientation, Modules.Actions.Attack);
        attacker.triggerHealthBar();

        return;

      case 'player':
        const player = new Player(); // eslint-disable-line

        player.setId(info.id);
        player.setName(info.name);
        player.setGridPosition(info.x, info.y);

        player.rights = info.rights;
        player.level = info.level;
        player.pvp = info.pvp;
        player.pvpKills = info.pvpKills;
        player.pvpDeaths = info.pvpDeaths;
        player.type = info.type;

        const hitPointsData = info.hitPoints; // eslint-disable-line
        const manaData = info.mana; // eslint-disable-line

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
        info.type === 'item' ? `item-${info.string}` : info.string,
      ),
    );

    entity.idle();
    entity.type = info.type;

    this.addEntity(entity);

    if (info.type !== 'item' && entity.handler) {
      entity.handler.setGame(this.game);
      entity.handler.load();
    }

    /**
     * Get ready for errors!
     */
  }

  isPlayer(id) {
    return this.game.player.id === id;
  }

  get(id) {
    if (id in this.entities) return this.entities[id];

    return null;
  }

  exists(id) {
    return id in this.entities;
  }

  clearPlayers(exception) {
    _.each(this.entities, (entity) => {
      if (entity.id !== exception.id && entity.type === 'player') {
        this.grids.removeFromRenderingGrid(
          entity,
          entity.gridX,
          entity.gridY,
        );
        this.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

        delete this.entities[entity.id];
      }
    });

    this.grids.resetPathingGrid();
  }

  addEntity(entity) {
    if (this.entities[entity.id]) return;

    this.entities[entity.id] = entity;
    this.registerPosition(entity);

    if (
      !(entity instanceof Item && entity.dropped)
      && !this.renderer.isPortableDevice()
    ) entity.fadeIn(this.game.time);
  }

  removeItem(item) {
    if (!item) return;

    this.grids.removeFromItemGrid(item, item.gridX, item.gridY);
    this.grids.removeFromRenderingGrid(item, item.gridX, item.gridY);

    delete this.entities[item.id];
  }

  registerPosition(entity) {
    if (!entity) return;

    if (
      entity.type === 'player'
      || entity.type === 'mob'
      || entity.type === 'npc'
      || entity.type === 'chest'
    ) {
      this.grids.addToEntityGrid(entity, entity.gridX, entity.gridY);

      if (entity.type !== 'player' || entity.nonPathable) this.grids.addToPathingGrid(entity.gridX, entity.gridY);
    }

    if (entity.type === 'item') this.grids.addToItemGrid(entity, entity.gridX, entity.gridY);

    this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);
  }

  registerDuality(entity) {
    if (!entity) return;

    this.grids.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

    this.grids.addToRenderingGrid(entity, entity.gridX, entity.gridY);

    if (entity.nextGridX > -1 && entity.nextGridY > -1) {
      this.grids.entityGrid[entity.nextGridY][entity.nextGridX][
        entity.id
      ] = entity;

      if (!(entity instanceof Player)) {
        this.grids.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
      }
    }
  }

  unregisterPosition(entity) {
    if (!entity) return;

    this.grids.removeEntity(entity);
  }

  getSprite(name) {
    console.log('get Sprite', this.sprites.sprites);
    return this.sprites.sprites[name];
  }

  getAll() {
    return this.entities;
  }

  forEachEntity(callback) {
    _.each(this.entities, (entity) => {
      callback(entity);
    });
  }

  forEachEntityAround(x, y, radius, callback) {
    for (let i = x - radius, maxI = x + radius; i <= maxI; i += 1) {
      for (let j = y - radius, maxJ = y + radius; j <= maxJ; j += 1) {
        if (!this.map.isOutOfBounds(i, j)) {
          _.each(this.grids.renderingGrid[j][i], (entity) => {
            callback(entity);
          });
        }
      }
    }
  }
}
