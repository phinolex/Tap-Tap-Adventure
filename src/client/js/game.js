/* global window, document */
import _ from 'underscore';
import $ from 'jquery';
import log from './lib/log';
import Renderer from './renderer/renderer';
import LocalStorage from './utils/storage';
import Map from './map/map';
import Socket from './network/socket';
import Player from './entity/character/player/player';
import Updater from './renderer/updater';
import Entities from './controllers/entities';
import Input from './controllers/input';
import PlayerHandler from './entity/character/player/playerhandler';
import Pathfinder from './utils/pathfinder';
import Zoning from './controllers/zoning';
import Info from './controllers/info';
import Bubble from './controllers/bubble';
import Interface from './controllers/interface';
import Audio from './controllers/audio';
import Pointer from './controllers/pointer';
import Modules from './utils/modules';
import Packets from './network/packets';
import Detect from './utils/detect';

export default class Game {
  constructor(app) {
    this.app = app;
    this.id = -1;
    this.socket = null;
    this.messages = null;
    this.renderer = null;
    this.updater = null;
    this.storage = null;
    this.entities = null;
    this.input = null;
    this.map = null;
    this.playerHandler = null;
    this.pathfinder = null;
    this.zoning = null;
    this.info = null;
    this.interface = null;
    this.audio = null;
    this.welcome = null;
    this.player = null;
    this.stopped = false;
    this.started = false;
    this.ready = false;
    this.loaded = false;
    this.time = new Date();
    this.pvp = false;
    this.population = -1;
    this.lastTime = new Date().getTime();

    this.loadRenderer();
    this.loadControllers();
  }

  start() {
    if (this.started) {
      return;
    }

    this.app.fadeMenu();
    this.tick();

    this.started = true;
  }

  stop() {
    this.stopped = false;
    this.started = false;
    this.ready = false;
  }

  tick() {
    if (this.ready) {
      this.time = new Date().getTime();

      this.renderer.render();
      this.updater.update();

      if (!this.stopped) {
        window.requestAnimFrame(this.tick.bind(this));
      }

      // Could also use function() { this.tick(); }
    }
  }

  unload() {
    this.socket = null;
    this.messages = null;
    this.renderer = null;
    this.updater = null;
    this.storage = null;
    this.entities = null;
    this.input = null;
    this.map = null;
    this.playerHandler = null;
    this.pathfinder = null;
    this.zoning = null;
    this.info = null;
    this.interface = null;
    this.audio.stop();
    this.audio = null;
  }

  loadRenderer() {
    const self = this;


    const background = document.getElementById('background');


    const foreground = document.getElementById('foreground');


    const textCanvas = document.getElementById('textCanvas');


    const entities = document.getElementById('entities');


    const cursor = document.getElementById('cursor');

    this.app.sendStatus('Soul sucking monster...');

    this.setRenderer(
      new Renderer(background, entities, foreground, textCanvas, cursor, self),
    );
  }

  loadControllers() {
    const self = this;


    const hasWorker = this.app.hasWorker();

    this.app.sendStatus(hasWorker ? 'I tried to tell you...' : null);

    if (hasWorker) this.loadMap();

    this.app.sendStatus('Too late now...');

    this.setStorage(new LocalStorage(this.app));

    this.app.sendStatus("You're already doomed...");

    this.setSocket(new Socket(self));
    this.setMessages(this.socket.messages);
    this.setInput(new Input(self));

    this.app.sendStatus("Stop! Before it's too late...");

    const entity = new Entities(self);
    this.setEntityController(entity);

    const info = new Info(self);
    this.setInfo(info);

    const bubble = new Bubble(self);
    this.setBubble(bubble);

    const pointer = new Pointer(self);
    this.setPointer(pointer);

    const audio = new Audio(self);
    this.setAudio(audio);

    const gameInterface = new Interface(self);
    this.setInterface(gameInterface);

    this.implementStorage();

    if (!hasWorker) {
      this.app.sendStatus(null);
      this.loaded = true;
    }
  }

  loadMap() {
    this.map = new Map(this);
    this.map.onReady(() => {
      this.app.sendStatus('Okay I give up...');

      this.setPathfinder(new Pathfinder(this.map.width, this.map.height));

      this.renderer.setMap(this.map);
      this.renderer.loadCamera();

      this.app.sendStatus("You're beyond help at this point...");

      this.setUpdater(new Updater(this));

      this.entities.load();

      this.renderer.setEntities(this.entities);

      this.app.sendStatus(null);

      this.loaded = true;
    });
  }

  connect() {
    this.app.cleanErrors();

    setTimeout(() => {
      this.socket.connect();
    }, 1000);

    this.messages.onHandshake((data) => {
      this.id = data.shift();
      this.development = data.shift();

      this.ready = true;

      if (!this.player) {
        this.createPlayer();
      }

      if (!this.map) {
        this.loadMap();
      }

      this.app.updateLoader('Logging in...');

      if (this.app.isRegistering()) {
        const registerInfo = this.app.registerFields;
        const username = registerInfo[0].val();
        const password = registerInfo[1].val();
        const email = registerInfo[3].val();

        this.socket.send(Packets.Intro, [
          Packets.IntroOpcode.Register,
          username,
          password,
          email,
        ]);
      } else if (this.app.isGuest()) {
        this.socket.send(Packets.Intro, [
          Packets.IntroOpcode.Guest,
          'n',
          'n',
          'n',
        ]);
      } else {
        log.info('logging in');
        const loginInfo = this.app.loginFields;
        const name = loginInfo[0].val();
        const pass = loginInfo[1].val();

        this.socket.send(Packets.Intro, [
          Packets.IntroOpcode.Login,
          name,
          pass,
          'n',
        ]);

        if (this.hasRemember()) {
          this.storage.data.player.username = name;
          this.storage.data.player.password = pass;
        } else {
          this.storage.data.player.username = '';
          this.storage.data.player.password = '';
        }

        this.storage.save();
      }
    });

    this.messages.onWelcome((data) => {
      this.player.load(data);

      this.input.setPosition(this.player.getX(), this.player.getY());

      this.start();
      this.postLoad();
    });

    this.messages.onEquipment((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.EquipmentOpcode.Batch:
          for (let i = 0; i < info.length; i += 1) {
            this.player.setEquipment(i, info[i]);
          }

          this.interface.loadProfile();
          break;

        case Packets.EquipmentOpcode.Equip:
          const equipmentType = info.shift(); // eslint-disable-line
          const name = info.shift(); // eslint-disable-line
          const string = info.shift(); // eslint-disable-line
          const count = info.shift(); // eslint-disable-line
          const ability = info.shift(); // eslint-disable-line
          const abilityLevel = info.shift(); // eslint-disable-line

          this.player.setEquipment(equipmentType, [
            name,
            string,
            count,
            ability,
            abilityLevel,
          ]);

          this.interface.profile.update();

          break;

        case Packets.EquipmentOpcode.Unequip:
          const type = info.shift(); // eslint-disable-line

          this.player.unequip(type);

          if (type === 'armour') this.player.setSprite(this.getSprite(this.player.getSpriteName()));

          this.interface.profile.update();

          break;
      }
    });

    this.messages.onSpawn((data) => {
      this.entities.create(data.shift());
    });

    this.messages.onEntityList((data) => {
      const ids = _.pluck(this.entities.getAll(), 'id');
      const known = _.intersection(ids, data);
      const newIds = _.difference(data, known);

      this.entities.decrepit = _.reject(
        this.entities.getAll(),
        entity => _.include(known, entity.id) || entity.id === this.player.id,
      );

      this.entities.clean();

      this.socket.send(Packets.Who, newIds);
    });

    this.messages.onSync((data) => {
      const entity = this.entities.get(data.id);

      if (!entity || entity.type !== 'player') return;

      if (data.hitPoints) {
        entity.hitPoints = data.hitPoints;
        entity.maxHitPoints = data.maxHitPoints;
      }

      if (data.mana) {
        entity.mana = data.mana;
        entity.maxMana = data.maxMana;
      }

      if (data.experience) {
        entity.experience = data.experience;
        entity.level = data.level;
      }

      if (data.armour) entity.setSprite(this.getSprite(data.armour));

      if (data.weapon) entity.setEquipment(Modules.Equipment.Weapon, data.weapon);

      this.interface.profile.update();
    });

    this.messages.onMovement((data) => {
      const opcode = data.shift();
      const info = data.shift();

      switch (opcode) {
        default:
          break;
        case Packets.MovementOpcode.Move:
          const id = info.shift(); // eslint-disable-line
          const x = info.shift(); // eslint-disable-line
          const y = info.shift(); // eslint-disable-line
          const forced = info.shift(); // eslint-disable-line
          const teleport = info.shift(); // eslint-disable-line
          const entity = this.entities.get(id); // eslint-disable-line

          if (!entity) {
            return;
          }

          if (forced) {
            entity.stop(true);
          }

          this.moveCharacter(entity, x, y);

          break;

        case Packets.MovementOpcode.Follow:
          const follower = this.entities.get(info.shift()); // eslint-disable-line
          const followee = this.entities.get(info.shift()); // eslint-disable-line

          if (!followee || !follower) {
            return;
          }

          follower.follow(followee);

          break;

        case Packets.MovementOpcode.Freeze:
        case Packets.MovementOpcode.Stunned:
          const pEntity = this.entities.get(info.shift()); // eslint-disable-line
          const state = info.shift(); // eslint-disable-line

          if (!pEntity) {
            return;
          }

          if (state) {
            pEntity.stop(false);
          }

          if (opcode === Packets.MovementOpcode.Stunned) {
            pEntity.stunned = state;
          } else if (opcode === Packets.MovementOpcode.Freeze) {
            pEntity.frozen = state;
          }

          break;
      }
    });

    this.messages.onTeleport((data) => {
      const id = data.shift();
      const x = data.shift();
      const y = data.shift();
      const withAnimation = data.shift();
      const isPlayer = id === this.player.id;
      const entity = this.entities.get(id);

      if (!entity) {
        return;
      }

      entity.stop(true);
      entity.frozen = true;

      /**
       * Teleporting an entity seems to cause a glitch with the
       * hitbox. Make sure you keep an eye out for this.
       */

      const doTeleport = () => {
        this.entities.unregisterPosition(entity);
        entity.setGridPosition(x, y);

        if (isPlayer) {
          this.entities.clearPlayers(this.player);
          this.player.clearHealthBar();
          this.renderer.camera.centreOn(entity);
          this.renderer.updateAnimatedTiles();
        } else if (entity.type === 'player') {
          delete this.entities.entities[entity.id];
          return;
        }

        this.socket.send(Packets.Request, [this.player.id]);

        this.entities.registerPosition(entity);

        log.info('Registered..');

        entity.frozen = false;
      };

      if (withAnimation) {
        const originalSprite = entity.sprite;

        entity.teleporting = true;

        entity.setSprite(this.getSprite('death'));

        entity.animate('death', 240, 1, () => {
          doTeleport();

          entity.currentAnimation = null;

          entity.setSprite(originalSprite);
          entity.idle();

          entity.teleporting = false;
        });
      } else doTeleport();
    });

    this.messages.onDespawn((id) => {
      const entity = this.entities.get(id);

      if (!entity) {
        return;
      }

      entity.dead = true;

      entity.stop();

      switch (entity.type) {
        default:
          break;
        case 'item':
          this.entities.removeItem(entity);
          return;

        case 'chest':
          entity.setSprite(this.getSprite('death'));

          entity.setAnimation('death', 120, 1, () => {
            this.entities.unregisterPosition(entity);
            delete this.entities.entities[entity.id];
          });

          return;
      }

      if (this.player.hasTarget() && this.player.target.id === entity.id) {
        this.player.removeTarget();
      }

      this.entities.grids.removeFromPathingGrid(entity.gridX, entity.gridY);

      if (entity.id !== this.player.id && this.player.getDistance(entity) < 5) {
        this.audio.play(
          Modules.AudioTypes.SFX,
          `kill${Math.floor(Math.random() * 2 + 1)}`,
        );
      }

      entity.hitPoints = 0;

      entity.setSprite(this.getSprite('death'));

      entity.animate('death', 120, 1, () => {
        this.entities.unregisterPosition(entity);
        delete this.entities.entities[entity.id];
      });
    });

    this.messages.onCombat((data) => {
      const opcode = data.shift();
      const attacker = this.entities.get(data.shift());
      const target = this.entities.get(data.shift());

      if (!target || !attacker) {
        return;
      }

      switch (opcode) {
        default:
          break;
        case Packets.CombatOpcode.Initiate:
          attacker.setTarget(target);
          target.addAttacker(attacker);

          if (target.id === this.player.id || attacker.id === this.player.id) {
            this.socket.send(Packets.Combat, [
              Packets.CombatOpcode.Initiate,
              attacker.id,
              target.id,
            ]);
          }
          break;

        case Packets.CombatOpcode.Hit:
          const hit = data.shift(); // eslint-disable-line
          const isPlayer = target.id === this.player.id; // eslint-disable-line

          if (!hit.isAoE) {
            attacker.lookAt(target);
            attacker.performAction(
              attacker.orientation,
              Modules.Actions.Attack,
            );
          } else if (hit.hasTerror) {
            target.terror = true;
          }

          switch (hit.type) {
            case Modules.Hits.Critical:
              target.critical = true;
              break;
            default:
              if (attacker.id === this.player.id && hit.damage > 0) {
                this.audio.play(
                  Modules.AudioTypes.SFX,
                  `hit${Math.floor(Math.random() * 2 + 1)}`,
                );
              }
              break;
          }

          this.info.create(
            hit.type,
            [hit.damage, isPlayer],
            target.x,
            target.y,
          );

          attacker.triggerHealthBar();
          target.triggerHealthBar();

          if (isPlayer && hit.damage > 0) this.audio.play(Modules.AudioTypes.SFX, 'hurt');

          break;

        case Packets.CombatOpcode.Finish:
          if (target) {
            target.removeTarget();
            target.forget();
          }

          if (attacker) attacker.removeTarget();

          break;
      }
    });

    this.messages.onAnimation((id, info) => {
      const entity = this.entities.get(id);
      const animation = info.shift();
      const speed = info.shift();
      const count = info.shift();

      if (!entity) {
        return;
      }

      entity.animate(animation, speed, count);
    });

    this.messages.onProjectile((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.ProjectileOpcode.Create:
          this.entities.create(info);
          break;
      }
    });

    this.messages.onPopulation((population) => {
      this.population = population;
    });

    this.messages.onPoints((data) => {
      const id = data.shift();
      const hitPoints = data.shift();
      const mana = data.shift();
      const entity = this.entities.get(id);

      if (!entity) {
        return;
      }

      if (hitPoints) {
        entity.setHitPoints(hitPoints);

        if (
          this.player.hasTarget()
          && this.player.target.id === entity.id
          && this.input.overlay.updateCallback
        ) this.input.overlay.updateCallback(entity.id, hitPoints);
      }

      if (mana) {
        entity.setMana(mana);
      }
    });

    this.messages.onNetwork(() => {
      this.socket.send(Packets.Network, [Packets.NetworkOpcode.Pong]);
    });

    this.messages.onChat((info) => {
      if (!info.duration) {
        info.duration = 5000; // eslint-disable-line
      }

      if (info.withBubble) {
        const entity = this.entities.get(info.id);

        if (entity) {
          this.bubble.create(info.id, info.text, this.time, info.duration);
          this.bubble.setTo(entity);

          this.audio.play(Modules.AudioTypes.SFX, 'npctalk');
        }
      }

      if (info.isGlobal) {
        info.name = `[Global] ${info.name}`; // eslint-disable-line
      }

      this.input.chatHandler.add(info.name, info.text, info.colour);
    });

    this.messages.onCommand(() => {
      /**
       * This is for random miscellaneous commands that require
       * a specific action done by the client as opposed to
       * packet-oriented ones.
       */
    });

    this.messages.onInventory((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.InventoryOpcode.Batch:
          const inventorySize = info.shift(); // eslint-disable-line
          const data = info.shift(); // eslint-disable-line

          this.interface.loadInventory(inventorySize, data);
          break;

        case Packets.InventoryOpcode.Add:
          if (!this.interface.inventory) {
            return;
          }

          this.interface.inventory.add(info);

          if (!this.interface.bank) {
            return;
          }

          this.interface.bank.addInventory(info);

          break;

        case Packets.InventoryOpcode.Remove:
          if (!this.interface.inventory) {
            return;
          }

          this.interface.inventory.remove(info);

          if (!this.interface.bank) {
            return;
          }

          this.interface.bank.removeInventory(info);

          break;
      }
    });

    this.messages.onBank((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.BankOpcode.Batch:
          const bankSize = info.shift(); // eslint-disable-line
          const data = info.shift(); // eslint-disable-line

          this.interface.loadBank(bankSize, data);
          break;

        case Packets.BankOpcode.Add:
          if (!this.interface.bank) {
            return;
          }

          this.interface.bank.add(info);
          break;

        case Packets.BankOpcode.Remove:
          this.interface.bank.remove(info);
          break;
      }
    });

    this.messages.onAbility(() => {});

    this.messages.onQuest((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.QuestOpcode.Batch:
          this.interface.getQuestPage().load(info.quests, info.achievements);
          break;

        case Packets.QuestOpcode.Progress:
          this.interface.getQuestPage().progress(info);
          break;

        case Packets.QuestOpcode.Finish:
          this.interface.getQuestPage().finish(info);
          break;
      }
    });

    this.messages.onNotification((opcode, message) => {
      switch (opcode) {
        default:
          break;
        case Packets.NotificationOpcode.Ok:
          this.interface.displayNotify(message);
          break;

        case Packets.NotificationOpcode.YesNo:
          this.interface.displayConfirm(message);
          break;

        case Packets.NotificationOpcode.Text:
          this.input.chatHandler.add('WORLD', message, 'red');
          break;
      }
    });

    this.messages.onBlink((instance) => {
      const item = this.entities.get(instance);

      if (!item) {
        return;
      }

      item.blink(150);
    });

    this.messages.onHeal((info) => {
      const entity = this.entities.get(info.id);

      if (!entity) {
        return;
      }

      switch (info.type) {
        default:
          break;
        case 'health':
          this.info.create(
            Modules.Hits.Heal,
            [info.amount],
            entity.x,
            entity.y,
          );

          break;

        case 'mana':
          this.info.create(
            Modules.Hits.Mana,
            [info.amount],
            entity.x,
            entity.y,
          );

          break;
      }

      if (entity.hitPoints + info.amount > entity.maxHitPoints) {
        entity.setHitPoints(entity.maxHitPoints);
      } else {
        entity.setHitPoints(entity.hitPoints + info.amount);
      }

      entity.triggerHealthBar();
    });

    this.messages.onExperience((info) => {
      const entity = this.entities.get(info.id);

      if (!entity || entity.type !== 'player') {
        return;
      }

      entity.experience = info.experience;

      if (entity.level !== info.level) {
        entity.level = info.level;
        this.info.create(Modules.Hits.LevelUp, null, entity.x, entity.y);
      } else if (entity.id === this.player.id) {
        this.info.create(Modules.Hits.Experience, [info.amount], entity.x, entity.y);
      }

      this.interface.profile.update();
    });

    this.messages.onDeath((id) => {
      const entity = this.entities.get(id);

      if (!entity || id !== this.player.id) {
        return;
      }

      this.audio.play(Modules.AudioTypes.SFX, 'death');

      this.player.dead = true;
      this.player.removeTarget();
      this.player.orientation = Modules.Orientation.Down;

      this.app.body.addClass('death');
    });

    this.messages.onAudio((song) => {
      this.audio.songName = song;

      if (Detect.isSafari() && !this.audio.song) {
        return;
      }

      this.audio.update();
    });

    this.messages.onNPC((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.NPCOpcode.Talk:
          let entity = this.entities.get(info.id); // eslint-disable-line
          const messages = info.text; // eslint-disable-line
          const isNPC = !info.nonNPC; // eslint-disable-line

          if (!entity) {
            return;
          }

          if (!messages) {
            entity.talkIndex = 0;
            return;
          }

          let message = isNPC ? entity.talk(messages) : messages; // eslint-disable-line

          if (isNPC) {
            const bubble = this.bubble.create(info.id, message, this.time, 5000);

            this.bubble.setTo(entity);

            if (this.renderer.mobile && this.renderer.autoCentre) {
              this.renderer.camera.centreOn(this.player);
            }

            if (bubble) {
              bubble.setClickable();

              bubble.element.click(() => {
                entity = this.entities.get(bubble.id);

                if (entity) {
                  this.input.click({
                    x: entity.gridX,
                    y: entity.gridY,
                  });
                }
              });
            }
          } else {
            this.bubble.create(info.id, message, this.time, 5000);
            this.bubble.setTo(entity);
          }

          let sound = 'npc'; // eslint-disable-line

          if (!message && isNPC) {
            sound = 'npc-end';
            this.bubble.destroy(info.id);
          }

          this.audio.play(Modules.AudioTypes.SFX, sound);

          break;

        case Packets.NPCOpcode.Bank:
          this.interface.bank.display();
          break;

        case Packets.NPCOpcode.Enchant:
          this.interface.enchant.display();
          break;

        case Packets.NPCOpcode.Countdown:
          const cEntity = this.entities.get(info.id); // eslint-disable-line
          const countdown = info.countdown; // eslint-disable-line

          if (cEntity) {
            cEntity.setCountdown(countdown);
          }

          break;
      }
    });

    this.messages.onRespawn((id, x, y) => {
      if (id !== this.player.id) {
        log.error('Player id mismatch.');
        return;
      }

      this.player.setGridPosition(x, y);

      this.entities.addEntity(this.player);

      this.renderer.camera.centreOn(this.player);

      this.player.currentAnimation = null;

      this.player.setSprite(this.getSprite(this.player.getSpriteName()));

      this.player.idle();

      this.player.dead = false;
    });

    this.messages.onEnchant((opcode, info) => {
      const {
        type,
        index,
      } = info;

      switch (opcode) {
        default:
          break;
        case Packets.EnchantOpcode.Select:
          this.interface.enchant.add(type, index);
          break;
        case Packets.EnchantOpcode.Remove:
          this.interface.enchant.moveBack(type, index);
          break;
      }
    });

    this.messages.onGuild((opcode) => {
      switch (opcode) {
        default:
          break;
        case Packets.GuildOpcode.Create:
          break;
        case Packets.GuildOpcode.Join:
          break;
      }
    });

    this.messages.onPointer((opcode, info) => {
      switch (opcode) {
        default:
          break;
        case Packets.PointerOpcode.NPC:
          const entity = this.entities.get(info.id); // eslint-disable-line
          log.info('pointer NPC', info, entity);

          if (!entity) {
            return;
          }

          this.pointer.create(entity.id, Modules.Pointers.Entity);
          this.pointer.setToEntity(entity);
          break;

        case Packets.PointerOpcode.Location:
          this.pointer.create(info.id, Modules.Pointers.Position);
          this.pointer.setToPosition(info.id, info.x * 16, info.y * 16);
          log.info('pointer location', info);
          break;

        case Packets.PointerOpcode.Relative:
          this.pointer.create(info.id, Modules.Pointers.Relative);
          this.pointer.setRelative(info.id, info.x, info.y);
          log.info('pointer relative', info);
          break;

        case Packets.PointerOpcode.Remove:
          this.pointer.clean();
          log.info('pointer remove', info);
          break;
      }
    });

    this.messages.onPVP((id, pvp) => {
      if (this.player.id === id) this.pvp = pvp;
      else {
        const entity = this.entities.get(id);

        if (entity) entity.pvp = pvp;
      }
    });

    this.messages.onShop((opcode) => {
      switch (opcode) {
        default:
          break;
        case Packets.ShopOpcode.Open:
          break;

        case Packets.ShopOpcode.Buy:
          break;

        case Packets.ShopOpcode.Sell:
          break;

        case Packets.ShopOpcode.Refresh:
          break;
      }
    });
  }

  postLoad() {
    /**
     * Call this after the player has been welcomed
     * by the server and the client received the connection.
     */

    this.renderer.loadStaticSprites();

    this.getCamera().setPlayer(this.player);

    this.renderer.renderedFrame[0] = -1;

    this.entities.addEntity(this.player);

    const defaultSprite = this.getSprite(this.player.getSpriteName());

    this.player.setSprite(defaultSprite);
    this.player.idle();

    this.socket.send(Packets.Ready, [true]);

    this.playerHandler = new PlayerHandler(this, this.player);

    this.renderer.updateAnimatedTiles();

    this.zoning = new Zoning(this);

    this.updater.setSprites(this.entities.sprites);

    this.renderer.verifyCentration();

    if (this.storage.data.new) {
      this.storage.data.new = false;
      this.storage.save();
    }

    if (this.storage.data.welcome !== false) {
      this.app.body.addClass('welcomeMessage');
    }
  }

  implementStorage() {
    const loginName = $('#wrapperNameInput');
    const loginPassword = $('#wrapperPasswordInput');

    loginName.prop('readonly', false);
    loginPassword.prop('readonly', false);

    if (!this.hasRemember()) {
      return;
    }

    if (this.getStorageUsername() !== '') {
      loginName.val(this.getStorageUsername());
    }

    if (this.getStoragePassword() !== '') {
      loginPassword.val(this.getStoragePassword());
    }

    $('#rememberMe').addClass('active');
  }

  setPlayerMovement(direction) {
    this.player.direction = direction;
  }

  movePlayer(x, y) {
    this.moveCharacter(this.player, x, y);
  }

  moveCharacter(character, x, y) {
    if (!character) {
      return;
    }

    character.go(x, y);
  }

  findPath(character, x, y, ignores) {
    const grid = this.entities.grids.pathingGrid;
    let path = [];

    if (this.map.isColliding(x, y) || !this.pathfinder || !character) {
      return path;
    }

    if (ignores) {
      _.each(ignores, (entity) => {
        this.pathfinder.ignoreEntity(entity);
      });
    }

    path = this.pathfinder.find(grid, character, x, y, false);

    if (ignores) this.pathfinder.clearIgnores();

    return path;
  }

  onInput(inputType, data) {
    this.input.handle(inputType, data);
  }

  handleDisconnection(noError) {
    /**
     * This function is responsible for handling sudden
     * disconnects of a player whilst in the game, not
     * menu-based errors.
     */

    if (!this.started) return;

    this.stop();
    this.renderer.stop();

    this.unload();

    this.app.showMenu();

    if (noError) {
      this.app.sendError(null, 'You have been disconnected from the server');
      this.app.statusMessage = null;
    }

    this.loadRenderer();
    this.loadControllers();

    this.app.toggleLogin(false);
    this.app.updateLoader('');
  }

  respawn() {
    this.audio.play(Modules.AudioTypes.SFX, 'revive');
    this.app.body.removeClass('death');

    this.socket.send(Packets.Respawn, [this.player.id]);
  }

  tradeWith(player) {
    if (!player || player.id === this.player.id) return;

    this.socket.send(Packets.Trade, [Packets.TradeOpcode.Request, player.id]);
  }

  resize() {
    this.renderer.resize();

    if (this.pointer) this.pointer.resize();
  }

  createPlayer() {
    this.player = new Player();
  }

  getScaleFactor() {
    return this.app.getScaleFactor();
  }

  getStorage() {
    return this.storage;
  }

  getCamera() {
    return this.renderer.camera;
  }

  getSprite(spriteName) {
    return this.entities.getSprite(spriteName);
  }

  getEntityAt(x, y, ignoreSelf) {
    const entities = this.entities.grids.renderingGrid[y][x];

    if (_.size(entities) > 0) {
      return entities[_.keys(entities)[ignoreSelf ? 1 : 0]];
    }

    const items = this.entities.grids.itemGrid[y][x];

    if (_.size(items) > 0) {
      _.each(items, (item) => {
        if (item.stackable) {
          return item;
        }
        return null;
      });

      return items[_.keys(items)[0]];
    }

    return null;
  }

  getStorageUsername() {
    return this.storage.data.player.username;
  }

  getStoragePassword() {
    return this.storage.data.player.password;
  }

  hasRemember() {
    return this.storage.data.player.rememberMe;
  }

  setRenderer(renderer) {
    if (!this.renderer) this.renderer = renderer;
  }

  setStorage(storage) {
    if (!this.storage) this.storage = storage;
  }

  setSocket(socket) {
    if (!this.socket) this.socket = socket;
  }

  setMessages(messages) {
    if (!this.messages) this.messages = messages;
  }

  setUpdater(updater) {
    if (!this.updater) this.updater = updater;
  }

  setEntityController(entities) {
    if (!this.entities) this.entities = entities;
  }

  setInput(input) {
    if (!this.input) {
      this.input = input;
      this.renderer.setInput(this.input);
    }
  }

  setPathfinder(pathfinder) {
    if (!this.pathfinder) this.pathfinder = pathfinder;
  }

  setInfo(info) {
    if (!this.info) this.info = info;
  }

  setBubble(bubble) {
    if (!this.bubble) this.bubble = bubble;
  }

  setPointer(pointer) {
    if (!this.pointer) this.pointer = pointer;
  }

  setInterface(intrface) {
    if (!this.interface) this.interface = intrface;
  }

  setAudio(audio) {
    if (!this.audio) this.audio = audio;
  }
}
