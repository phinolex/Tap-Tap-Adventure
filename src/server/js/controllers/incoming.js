/* global log */

var cls = require("../lib/class"),
  Packets = require("../network/packets"),
  Request = require("request"),
  config = require("../../config.json"),
  Creator = require("../database/creator"),
  _ = require("underscore"),
  Messages = require("../network/messages"),
  sanitizer = require("sanitizer"),
  Commands = require("./commands"),
  Items = require("../util/items"),
  Utils = require("../util/utils");

module.exports = Incoming = cls.Class.extend({
  init(player) {
    var self = this;

    this.player = player;
    this.connection = this.player.connection;
    this.world = this.player.world;
    this.mysql = this.player.mysql;
    this.commands = new Commands(this.player);

    this.connection.listen(function(data) {
      var packet = data.shift(),
        message = data[0];

      if (!Utils.validPacket(packet)) {
        log.error("Non-existent packet received: " + packet + " data: ");
        log.error(message);

        return;
      }

      this.player.refreshTimeout();

      switch (packet) {
        case Packets.Intro:
          this.handleIntro(message);
          break;

        case Packets.Ready:
          this.handleReady(message);
          break;

        case Packets.Who:
          this.handleWho(message);
          break;

        case Packets.Equipment:
          this.handleEquipment(message);
          break;

        case Packets.Movement:
          this.handleMovement(message);
          break;

        case Packets.Request:
          this.handleRequest(message);
          break;

        case Packets.Target:
          this.handleTarget(message);
          break;

        case Packets.Combat:
          this.handleCombat(message);
          break;

        case Packets.Projectile:
          this.handleProjectile(message);
          break;

        case Packets.Network:
          this.handleNetwork(message);
          break;

        case Packets.Chat:
          this.handleChat(message);
          break;

        case Packets.Inventory:
          this.handleInventory(message);
          break;

        case Packets.Bank:
          this.handleBank(message);
          break;

        case Packets.Respawn:
          this.handleRespawn(message);
          break;

        case Packets.Trade:
          this.handleTrade(message);
          break;

        case Packets.Enchant:
          this.handleEnchant(message);
          break;

        case Packets.Click:
          this.handleClick(message);
          break;

        case Packets.Warp:
          this.handleWarp(message);
          break;
      }
    });
  },

  handleIntro(message) {
    log.info("incoming message:" + message.toString());

    var self = this,
      loginType = message.shift(),
      username = message.shift().toLowerCase(),
      password = message.shift(),
      isRegistering = loginType === Packets.IntroOpcode.Register,
      isGuest = loginType === Packets.IntroOpcode.Guest,
      email = isRegistering ? message.shift() : "",
      formattedUsername = username
        ? username.charAt(0).toUpperCase() + username.slice(1)
        : "";

    this.player.username = formattedUsername.substr(0, 32).trim();
    this.player.password = password.substr(0, 32).trim();
    this.player.email = email.substr(0, 128).trim();

    if (this.introduced) return;

    if (this.world.playerInWorld(this.player.username)) {
      this.connection.sendUTF8("loggedin");
      this.connection.close("Player already logged in..");
      return;
    }

    if (config.overrideAuth) {
      this.mysql.login(this.player);
      return;
    }

    if (config.offlineMode) {
      var creator = new Creator(null);

      this.player.isNew = true;
      this.player.load(creator.getPlayerData(this.player));
      this.player.isNew = false;
      this.player.intro();

      return;
    }

    this.introduced = true;

    if (isRegistering) {
      info.log("is registering");
      var registerOptions = {
        method: "GET",
        uri:
          "https://taptapadventure.com/api/register.php?a=" +
          "9a4c5ddb-5ce6-4a01-a14f-3ae49d8c6507" +
          "&u=" +
          this.player.username +
          "&p=" +
          this.player.password +
          "&e=" +
          this.player.email
      };

      Request(registerOptions, function(error, response, body) {
        try {
          var data = JSON.parse(JSON.parse(body).data);

          switch (data.code) {
            case "ok":
              this.mysql.register(this.player);
              break;

            case "internal-server-error": //email
              this.connection.sendUTF8("emailexists");
              this.connection.close("Email not available.");
              break;

            case "not-authorised": //username
              this.connection.sendUTF8("userexists");
              this.connection.close("Username not available.");
              break;

            default:
              this.connection.sendUTF8("error");
              this.connection.close("Unknown API Response: " + error);
              break;
          }
        } catch (e) {
          log.info("Could not decipher API message");

          this.connection.sendUTF8("disallowed");
          this.connection.close("API response is malformed!");
        }
      });
    } else if (isGuest) {
      this.player.username = "Guest" + Utils.randomInt(0, 2000000);
      this.player.password = null;
      this.player.email = null;
      this.player.isGuest = true;

      this.mysql.login(this.player);
    } else {
      console.log("validating login");
      this.connection.sendUTF8("validatingLogin");
      this.mysql.login(this.player);
    }
  },

  handleReady(message) {
    var self = this,
      isReady = message.shift();

    if (!isReady) return;

    this.player.ready = true;

    this.world.handleEntityGroup(this.player);
    this.world.pushEntities(this.player);

    this.player.sendEquipment();
    this.player.loadInventory();
    this.player.loadBank();
    this.player.loadQuests();

    this.player.handler.detectMusic();

    if (this.player.readyCallback) this.player.readyCallback();
  },

  handleWho(message) {
    var self = this;

    _.each(message.shift(), function(id) {
      var entity = this.world.getEntityByInstance(id);

      if (entity && entity.id) this.player.send(new Messages.Spawn(entity));
    });
  },

  handleEquipment(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.EquipmentOpcode.Unequip:
        var type = message.shift();

        if (!this.player.inventory.hasSpace()) {
          this.player.send(
            new Messages.Notification(
              Packets.NotificationOpcode.Text,
              "You do not have enough space in your inventory."
            )
          );
          return;
        }

        switch (type) {
          case "weapon":
            if (!this.player.hasWeapon()) return;

            this.player.inventory.add(this.player.weapon.getItem());
            this.player.setWeapon(-1, -1, -1, -1);

            break;

          case "armour":
            if (this.player.hasArmour() && this.player.armour.id === 114)
              return;

            this.player.inventory.add(this.player.armour.getItem());
            this.player.setArmour(114, 1, -1, -1);

            break;

          case "pendant":
            if (!this.player.hasPendant()) return;

            this.player.inventory.add(this.player.pendant.getItem());
            this.player.setPendant(-1, -1, -1, -1);

            break;

          case "ring":
            if (!this.player.hasRing()) return;

            this.player.inventory.add(this.player.ring.getItem());
            this.player.setRing(-1, -1, -1, -1);

            break;

          case "boots":
            if (!this.player.hasBoots()) return;

            this.player.inventory.add(this.player.boots.getItem());
            this.player.setBoots(-1, -1, -1, -1);

            break;
        }

        this.player.send(
          new Messages.Equipment(Packets.EquipmentOpcode.Unequip, [type])
        );
        this.player.sync();

        break;
    }
  },

  handleMovement(message) {
    var self = this,
      opcode = message.shift();

    if (!this.player || this.player.dead) return;

    switch (opcode) {
      case Packets.MovementOpcode.Request:
        var requestX = message.shift(),
          requestY = message.shift(),
          playerX = message.shift(),
          playerY = message.shift();

        if (playerX !== this.player.x || playerY !== this.player.y) return;

        this.player.guessPosition(requestX, requestY);

        break;

      case Packets.Movement.Started:
        var selectedX = message.shift(),
          selectedY = message.shift(),
          pX = message.shift(),
          pY = message.shift();

        if (pX !== this.player.x || pY !== this.player.y || this.player.stunned)
          return;

        this.player.moving = true;

        break;

      case Packets.MovementOpcode.Step:
        var x = message.shift(),
          y = message.shift();

        if (this.player.stunned) return;

        this.player.setPosition(x, y);

        break;

      case Packets.MovementOpcode.Stop:
        var posX = message.shift(),
          posY = message.shift(),
          id = message.shift(),
          hasTarget = message.shift(),
          entity = this.world.getEntityByInstance(id);

        if (entity && entity.type === "item" && !hasTarget)
          this.player.inventory.add(entity);

        if (this.world.map.isDoor(posX, posY) && !hasTarget) {
          var destination = this.world.map.getDoorDestination(posX, posY);

          this.player.teleport(destination.x, destination.y, true);
        } else this.player.setPosition(posX, posY);

        this.player.moving = false;
        this.player.lastMovement = new Date().getTime();

        break;

      case Packets.MovementOpcode.Entity:
        var instance = message.shift(),
          entityX = message.shift(),
          entityY = message.shift(),
          oEntity = this.world.getEntityByInstance(instance);

        if (!oEntity || (oEntity.x === entityX && oEntity.y === entityY))
          return;

        oEntity.setPosition(entityX, entityY);

        if (oEntity.hasTarget()) oEntity.combat.forceAttack();

        break;
    }
  },

  handleRequest(message) {
    var self = this,
      id = message.shift();

    if (id !== this.player.instance) return;

    this.world.pushEntities(this.player);
  },

  handleTarget(message) {
    var self = this,
      opcode = message.shift(),
      instance = message.shift();

    log.debug("Targeted: " + instance);

    switch (opcode) {
      case Packets.TargetOpcode.Talk:
        var entity = this.world.getEntityByInstance(instance);

        if (!entity) return;

        if (entity.type === "chest") {
          entity.openChest();
          return;
        }

        if (entity.dead) return;

        if (this.player.npcTalkCallback) this.player.npcTalkCallback(entity);

        break;

      case Packets.TargetOpcode.Attack:
        var target = this.world.getEntityByInstance(instance);

        if (!target || target.dead || !this.canAttack(this.player, target))
          return;

        this.world.pushToAdjacentGroups(
          target.group,
          new Messages.Combat(
            Packets.CombatOpcode.Initiate,
            this.player.instance,
            target.instance
          )
        );

        break;

      case Packets.TargetOpcode.None:
        this.player.combat.stop();
        this.player.removeTarget();

        break;
    }
  },

  handleCombat(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.CombatOpcode.Initiate:
        var attacker = this.world.getEntityByInstance(message.shift()),
          target = this.world.getEntityByInstance(message.shift());

        if (
          !target ||
          target.dead ||
          !attacker ||
          attacker.dead ||
          !this.canAttack(attacker, target)
        )
          return;

        attacker.setTarget(target);

        if (!attacker.combat.started) attacker.combat.forceAttack();
        else {
          attacker.combat.start();

          attacker.combat.attack(target);
        }

        if (target.combat) target.combat.addAttacker(attacker);

        break;
    }
  },

  handleProjectile(message) {
    var self = this,
      type = message.shift();

    switch (type) {
      case Packets.ProjectileOpcode.Impact:
        var projectile = this.world.getEntityByInstance(message.shift()),
          target = this.world.getEntityByInstance(message.shift());

        if (!target || target.dead || !projectile) return;

        this.world.handleDamage(projectile.owner, target, projectile.damage);
        this.world.removeProjectile(projectile);

        if (target.combat.started || target.dead || target.type !== "mob")
          return;

        target.begin(projectile.owner);

        break;
    }
  },

  handleNetwork(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.NetworkOpcode.Pong:
        log.info("Pingy pongy pung pong.");
        break;
    }
  },

  handleChat(message) {
    var self = this,
      text = sanitizer.escape(sanitizer.sanitize(message.shift()));

    if (!text || text.length < 1 || !/\S/.test(text)) return;

    if (text.charAt(0) === "/" || text.charAt(0) === ";")
      this.commands.parse(text);
    else {
      if (this.player.isMuted()) {
        this.player.send(
          new Messages.Notification(
            Packets.NotificationOpcode.Text,
            "You are currently muted."
          )
        );
        return;
      }

      if (!this.player.canTalk) {
        this.player.send(
          new Messages.Notification(
            Packets.NotificationOpcode.Text,
            "You are not allowed to talk for the duration of this event."
          )
        );
        return;
      }

      this.world.pushToGroup(
        this.player.group,
        new Messages.Chat({
          id: this.player.instance,
          name: this.player.username,
          withBubble: true,
          text: text,
          duration: 7000
        })
      );
    }
  },

  handleInventory(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.InventoryOpcode.Remove:
        var item = message.shift(),
          count;

        if (!item) return;

        if (item.count > 1) count = message.shift();

        var id = Items.stringToId(item.string),
          iSlot = this.player.inventory.slots[item.index];

        if (count > iSlot.count) count = iSlot.count;

        this.player.inventory.remove(
          id,
          count ? count : item.count,
          item.index
        );

        this.world.dropItem(id, count, this.player.x, this.player.y);

        break;

      case Packets.InventoryOpcode.Select:
        var index = message.shift(),
          slot = this.player.inventory.slots[index],
          string = slot.string,
          sCount = slot.count,
          ability = slot.ability,
          abilityLevel = slot.abilityLevel;

        if (!slot) return;

        id = Items.stringToId(slot.string);

        if (slot.equippable) {
          if (!this.player.canEquip(string)) return;

          this.player.inventory.remove(id, slot.count, slot.index);

          this.player.equip(string, sCount, ability, abilityLevel);
        } else if (slot.edible) {
          this.player.inventory.remove(id, 1, slot.index);

          this.player.eat(id);
        }

        break;
    }
  },

  handleBank(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.BankOpcode.Select:
        var type = message.shift(),
          index = message.shift(),
          isBank = type === "bank";

        if (isBank) {
          var bankSlot = this.player.bank.slots[index];

          //Infinite stacks move all at onces, otherwise move one by one.
          var moveAmount =
            Items.maxStackSize(bankSlot.id) === -1 ? bankSlot.count : 1;

          if (this.player.inventory.add(bankSlot, moveAmount))
            this.player.bank.remove(bankSlot.id, moveAmount, index);
        } else {
          var inventorySlot = this.player.inventory.slots[index];

          if (
            this.player.bank.add(
              inventorySlot.id,
              inventorySlot.count,
              inventorySlot.ability,
              inventorySlot.abilityLevel
            )
          )
            this.player.inventory.remove(
              inventorySlot.id,
              inventorySlot.count,
              index
            );
        }

        break;
    }
  },

  handleRespawn(message) {
    var self = this,
      instance = message.shift();

    if (this.player.instance !== instance) return;

    var spawn = this.player.getSpawn();

    this.player.dead = false;
    this.player.setPosition(spawn.x, spawn.y);

    this.world.pushToAdjacentGroups(
      this.player.group,
      new Messages.Spawn(this.player),
      this.player.instance
    );
    this.player.send(
      new Messages.Respawn(this.player.instance, this.player.x, this.player.y)
    );

    this.player.revertPoints();
  },

  handleTrade(message) {
    var self = this,
      opcode = message.shift(),
      oPlayer = this.world.getEntityByInstance(message.shift());

    if (!oPlayer || !opcode) return;

    switch (opcode) {
      case Packets.TradeOpcode.Request:
        break;

      case Packets.TradeOpcode.Accept:
        break;

      case Packets.TradeOpcode.Decline:
        break;
    }
  },

  handleEnchant(message) {
    var self = this,
      opcode = message.shift();

    switch (opcode) {
      case Packets.EnchantOpcode.Select:
        var index = message.shift(),
          item = this.player.inventory.slots[index],
          type = "item";

        if (Items.isShard(item.id)) type = "shards";

        this.player.enchant.add(type, item);

        break;

      case Packets.EnchantOpcode.Remove:
        this.player.enchant.remove(message.shift());

        break;

      case Packets.EnchantOpcode.Enchant:
        this.player.enchant.enchant();

        break;
    }
  },

  handleClick(message) {
    var self = this,
      type = message.shift(),
      isOpen = message.shift();

    switch (type) {
      case "profile":
        if (this.player.profileToggleCallback)
          this.player.profileToggleCallback(isOpen);

        break;
    }
  },

  handleWarp(message) {
    var self = this,
      id = parseInt(message.shift()) - 1;

    if (this.player.warp) this.player.warp.warp(id);
  },

  canAttack(attacker, target) {
    /**
     * Used to prevent client-sided manipulation. The client will send the packet to start combat
     * but if it was modified by a presumed hacker, it will simply cease when it arrives to this condition.
     */

    if (attacker.type === "mob" || target.type === "mob") return true;

    return (
      attacker.type === "player" &&
      target.type === "player" &&
      attacker.pvp &&
      target.pvp
    );
  }
});
