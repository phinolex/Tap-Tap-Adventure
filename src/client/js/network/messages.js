import _ from 'underscore';
import Packets from './packets';

/**
 * Do not clutter up the Socket class with callbacks,
 * have this class here until a better method arises in my head.
 *
 * This class should not have any complex functionality, its main
 * role is to provide organization for packets and increase readability
 *
 * Please respect the order of the Packets Enum and arrange functions
 * accordingly.
 */
export default class Messages {
  constructor(app) {
    this.app = app;

    this.messages = [];

    this.messages[Packets.Handshake] = this.receiveHandshake;
    this.messages[Packets.Welcome] = this.receiveWelcome;
    this.messages[Packets.Spawn] = this.receiveSpawn;
    this.messages[Packets.Equipment] = this.receiveEquipment;
    this.messages[Packets.List] = this.receiveEntityList;
    this.messages[Packets.Sync] = this.receiveSync;
    this.messages[Packets.Movement] = this.receiveMovement;
    this.messages[Packets.Teleport] = this.receiveTeleport;
    this.messages[Packets.Despawn] = this.receiveDespawn;
    this.messages[Packets.Combat] = this.receiveCombat;
    this.messages[Packets.Animation] = this.receiveAnimation;
    this.messages[Packets.Projectile] = this.receiveProjectile;
    this.messages[Packets.Population] = this.receivePopulation;
    this.messages[Packets.Points] = this.receivePoints;
    this.messages[Packets.Network] = this.receiveNetwork;
    this.messages[Packets.Chat] = this.receiveChat;
    this.messages[Packets.Command] = this.receiveCommand;
    this.messages[Packets.Inventory] = this.receiveInventory;
    this.messages[Packets.Bank] = this.receiveBank;
    this.messages[Packets.Ability] = this.receiveAbility;
    this.messages[Packets.Quest] = this.receiveQuest;
    this.messages[Packets.Notification] = this.receiveNotification;
    this.messages[Packets.Blink] = this.receiveBlink;
    this.messages[Packets.Heal] = this.receiveHeal;
    this.messages[Packets.Experience] = this.receiveExperience;
    this.messages[Packets.Death] = this.receiveDeath;
    this.messages[Packets.Audio] = this.receiveAudio;
    this.messages[Packets.NPC] = this.receiveNPC;
    this.messages[Packets.Respawn] = this.receiveRespawn;
    this.messages[Packets.Enchant] = this.receiveEnchant;
    this.messages[Packets.Guild] = this.receiveGuild;
    this.messages[Packets.Pointer] = this.receivePointer;
    this.messages[Packets.PVP] = this.receivePVP;
    this.messages[Packets.Shop] = this.receiveShop;
  }

  handleData(data) {
    const packet = data.shift();

    if (this.messages[packet] && _.isFunction(this.messages[packet])) {
      this.messages[packet].call(this, data);
    }
  }

  handleBulkData(data) {
    _.each(data, (message) => {
      this.handleData(message);
    });
  }

  handleUTF8(message) {
    this.app.toggleLogin(false);

    switch (message) {
      case 'updated':
        this.app.sendError(null, 'The client has been updated!');
        break;

      case 'full':
        this.app.sendError(null, 'The servers are currently full!');
        break;

      case 'error':
        this.app.sendError(null, 'The server has responded with an error!');
        break;

      case 'development':
        this.app.sendError(
          null,
          'The game is currently in development mode.',
        );
        break;

      case 'disallowed':
        this.app.sendError(
          null,
          'The server is currently not accepting connections!',
        );
        break;

      case 'maintenance':
        this.app.sendError(
          null,
          'WTF?! Adventure is currently under construction.',
        );
        break;

      case 'userexists':
        this.app.sendError(
          null,
          'The username you have chosen already exists.',
        );
        break;

      case 'emailexists':
        this.app.sendError(
          null,
          'The email you have chosen is not available.',
        );
        break;

      case 'loggedin':
        this.app.sendError(null, 'The player is already logged in!');
        break;

      case 'invalidlogin':
        this.app.sendError(
          null,
          'You have entered the wrong username or password.',
        );
        break;

      case 'toofast':
        this.app.sendError(
          null,
          'You are trying to log in too fast from the same connection.',
        );
        break;

      case 'malform':
        this.app.game.handleDisconnection(true);
        this.app.sendError(null, 'Client has experienced a malfunction.');
        break;

      case 'timeout':
        this.app.sendError(
          null,
          'You have been disconnected for being inactive for too long.',
        );
        break;

      case 'validatingLogin':
        this.app.sendError(null, 'Validating login...');
        break;
      default:
        this.app.sendError(null, `An unknown error has occurred: ${message}`);
        break;
    }
  }

  /**
   * Data Receivers
   */

  receiveHandshake(data) {
    if (this.handshakeCallback) {
      this.handshakeCallback(data.shift());
    }
  }

  receiveWelcome(data) {
    const playerData = data.shift();

    if (this.welcomeCallback) {
      this.welcomeCallback(playerData);
    }
  }

  receiveSpawn(data) {
    if (this.spawnCallback) {
      this.spawnCallback(data);
    }
  }

  receiveEquipment(data) {
    const equipType = data.shift();
    const equipInfo = data.shift();

    if (this.equipmentCallback) {
      this.equipmentCallback(equipType, equipInfo);
    }
  }

  receiveEntityList(data) {
    if (this.entityListCallback) {
      this.entityListCallback(data);
    }
  }

  receiveSync(data) {
    if (this.syncCallback) {
      this.syncCallback(data.shift());
    }
  }

  receiveMovement(data) {
    const movementData = data.shift();
    if (this.movementCallback) {
      this.movementCallback(movementData);
    }
  }

  receiveTeleport(data) {
    const teleportData = data.shift();

    if (this.teleportCallback) {
      this.teleportCallback(teleportData);
    }
  }

  receiveDespawn(data) {
    const id = data.shift();

    if (this.despawnCallback) {
      this.despawnCallback(id);
    }
  }

  receiveCombat(data) {
    const combatData = data.shift();

    if (this.combatCallback) {
      this.combatCallback(combatData);
    }
  }

  receiveAnimation(data) {
    const id = data.shift();
    const info = data.shift();

    if (this.animationCallback) {
      this.animationCallback(id, info);
    }
  }

  receiveProjectile(data) {
    const type = data.shift();
    const info = data.shift();

    if (this.projectileCallback) {
      this.projectileCallback(type, info);
    }
  }

  receivePopulation(data) {
    if (this.populationCallback) {
      this.populationCallback(data.shift());
    }
  }

  receivePoints(data) {
    const pointsData = data.shift();

    if (this.pointsCallback) {
      this.pointsCallback(pointsData);
    }
  }

  receiveNetwork(data) {
    const opcode = data.shift();

    if (this.networkCallback) {
      this.networkCallback(opcode);
    }
  }

  receiveChat(data) {
    const info = data.shift();

    if (this.chatCallback) {
      this.chatCallback(info);
    }
  }

  receiveCommand(data) {
    const info = data.shift();

    if (this.commandCallback) {
      this.commandCallback(info);
    }
  }

  receiveInventory(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.inventoryCallback) {
      this.inventoryCallback(opcode, info);
    }
  }

  receiveBank(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.bankCallback) {
      this.bankCallback(opcode, info);
    }
  }

  receiveAbility(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.abilityCallback) {
      this.abilityCallback(opcode, info);
    }
  }

  receiveQuest(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.questCallback) {
      this.questCallback(opcode, info);
    }
  }

  receiveNotification(data) {
    const opcode = data.shift();
    const message = data.shift();

    if (this.notificationCallback) {
      this.notificationCallback(opcode, message);
    }
  }

  receiveBlink(data) {
    const instance = data.shift();

    if (this.blinkCallback) {
      this.blinkCallback(instance);
    }
  }

  receiveHeal(data) {
    if (this.healCallback) {
      this.healCallback(data.shift());
    }
  }

  receiveExperience(data) {
    if (this.experienceCallback) {
      this.experienceCallback(data.shift());
    }
  }

  receiveDeath(data) {
    if (this.deathCallback) {
      this.deathCallback(data.shift());
    }
  }

  receiveAudio(data) {
    if (this.audioCallback) {
      this.audioCallback(data.shift());
    }
  }

  receiveNPC(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.npcCallback) {
      this.npcCallback(opcode, info);
    }
  }

  receiveRespawn(data) {
    const id = data.shift();
    const x = data.shift();
    const y = data.shift();

    if (this.respawnCallback) {
      this.respawnCallback(id, x, y);
    }
  }

  receiveEnchant(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.enchantCallback) {
      this.enchantCallback(opcode, info);
    }
  }

  receiveGuild(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.guildCallback) {
      this.guildCallback(opcode, info);
    }
  }

  receivePointer(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.pointerCallback) {
      this.pointerCallback(opcode, info);
    }
  }

  receivePVP(data) {
    const id = data.shift();
    const pvp = data.shift();

    if (this.pvpCallback) {
      this.pvpCallback(id, pvp);
    }
  }

  receiveShop(data) {
    const opcode = data.shift();
    const info = data.shift();

    if (this.shopCallback) {
      this.shopCallback(opcode, info);
    }
  }

  /**
   * Universal Callbacks
   */

  onHandshake(callback) {
    this.handshakeCallback = callback;
  }

  onWelcome(callback) {
    this.welcomeCallback = callback;
  }

  onSpawn(callback) {
    this.spawnCallback = callback;
  }

  onEquipment(callback) {
    this.equipmentCallback = callback;
  }

  onEntityList(callback) {
    this.entityListCallback = callback;
  }

  onSync(callback) {
    this.syncCallback = callback;
  }

  onMovement(callback) {
    this.movementCallback = callback;
  }

  onTeleport(callback) {
    this.teleportCallback = callback;
  }

  onDespawn(callback) {
    this.despawnCallback = callback;
  }

  onCombat(callback) {
    this.combatCallback = callback;
  }

  onAnimation(callback) {
    this.animationCallback = callback;
  }

  onProjectile(callback) {
    this.projectileCallback = callback;
  }

  onPopulation(callback) {
    this.populationCallback = callback;
  }

  onPoints(callback) {
    this.pointsCallback = callback;
  }

  onNetwork(callback) {
    this.networkCallback = callback;
  }

  onChat(callback) {
    this.chatCallback = callback;
  }

  onCommand(callback) {
    this.commandCallback = callback;
  }

  onInventory(callback) {
    this.inventoryCallback = callback;
  }

  onBank(callback) {
    this.bankCallback = callback;
  }

  onAbility(callback) {
    this.abilityCallback = callback;
  }

  onQuest(callback) {
    this.questCallback = callback;
  }

  onNotification(callback) {
    this.notificationCallback = callback;
  }

  onBlink(callback) {
    this.blinkCallback = callback;
  }

  onHeal(callback) {
    this.healCallback = callback;
  }

  onExperience(callback) {
    this.experienceCallback = callback;
  }

  onDeath(callback) {
    this.deathCallback = callback;
  }

  onAudio(callback) {
    this.audioCallback = callback;
  }

  onNPC(callback) {
    this.npcCallback = callback;
  }

  onRespawn(callback) {
    this.respawnCallback = callback;
  }

  onEnchant(callback) {
    this.enchantCallback = callback;
  }

  onGuild(callback) {
    this.guildCallback = callback;
  }

  onPointer(callback) {
    this.pointerCallback = callback;
  }

  onPVP(callback) {
    this.pvpCallback = callback;
  }

  onShop(callback) {
    this.shopCallback = callback;
  }
}
