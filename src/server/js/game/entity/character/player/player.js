/* global module, log */

var Character = require("../character"),
  Incoming = require("../../../../controllers/incoming"),
  Armour = require("./equipment/armour"),
  Weapon = require("./equipment/weapon"),
  Pendant = require("./equipment/pendant"),
  Ring = require("./equipment/ring"),
  Boots = require("./equipment/boots"),
  Items = require("../../../../util/items"),
  Messages = require("../../../../network/messages"),
  Formulas = require("../../../formulas"),
  Hitpoints = require("./points/hitpoints"),
  Mana = require("./points/mana"),
  Packets = require("../../../../network/packets"),
  Modules = require("../../../../util/modules"),
  Handler = require("./handler"),
  Quests = require("../../../../controllers/quests"),
  Inventory = require("./containers/inventory/inventory"),
  Abilities = require("./ability/abilities"),
  Bank = require("./containers/bank/bank"),
  config = require("../../../../../config.json"),
  Enchant = require("./enchant/enchant"),
  Guild = require("./guild"),
  Utils = require("../../../../util/utils"),
  Hit = require("../combat/hit"),
  Trade = require("./trade"),
  Warp = require("./warp");

module.exports = Player = Character.extend({
  init(world, database, connection, clientId) {
    var self = this;

    this._super(-1, "player", connection.id, -1, -1);

    this.world = world;
    this.mysql = database;
    this.connection = connection;

    this.clientId = clientId;

    this.incoming = new Incoming(self);

    this.isNew = false;
    this.ready = false;

    this.moving = false;
    this.potentialPosition = null;
    this.futurePosition = null;

    this.groupPosition = null;
    this.newGroup = false;

    this.disconnectTimeout = null;
    this.timeoutDuration = 1000 * 60 * 10; //10 minutes

    this.handler = new Handler(self);

    this.inventory = new Inventory(self, 20);
    this.bank = new Bank(self, 56);
    this.quests = new Quests(self);
    this.abilities = new Abilities(self);
    this.enchant = new Enchant(self);
    this.trade = new Trade(self);
    this.warp = new Warp(self);

    this.introduced = false;
    this.currentSong = null;
    this.acceptedTrade = false;
    this.invincible = false;
    this.noDamage = false;

    this.isGuest = false;

    this.pvp = false;

    this.canTalk = true;

    this.profileDialogOpen = false;
  },

  load(data) {
    var self = this;

    this.loaded = true;
    this.kind = data.kind;
    this.rights = data.rights;
    this.experience = data.experience;
    this.ban = data.ban;
    this.mute = data.mute;
    this.membership = data.membership;
    this.lastLogin = data.lastLogin;
    this.pvpKills = data.pvpKills;
    this.pvpDeaths = data.pvpDeaths;

    this.warp.setLastWarp(data.lastWarp);

    this.level = Formulas.expToLevel(this.experience);
    this.hitPoints = new Hitpoints(
      data.hitPoints,
      Formulas.getMaxHitPoints(this.level)
    );
    this.mana = new Mana(data.mana, Formulas.getMaxMana(this.level));

    var armour = data.armour,
      weapon = data.weapon,
      pendant = data.pendant,
      ring = data.ring,
      boots = data.boots;

    this.setPosition(data.x, data.y);
    this.setArmour(armour[0], armour[1], armour[2], armour[3]);
    this.setWeapon(weapon[0], weapon[1], weapon[2], weapon[3]);
    this.setPendant(pendant[0], pendant[1], pendant[2], pendant[3]);
    this.setRing(ring[0], ring[1], ring[2], ring[3]);
    this.setBoots(boots[0], boots[1], boots[2], boots[3]);

    this.guild = new Guild(data.guild, self);
  },

  loadInventory() {
    var self = this;

    if (config.offlineMode) {
      this.inventory.loadEmpty();
      return;
    }

    this.mysql.loader.getInventory(self, function(
      ids,
      counts,
      skills,
      skillLevels
    ) {
      if (ids.length !== this.inventory.size) this.save();

      this.inventory.load(ids, counts, skills, skillLevels);
      this.inventory.check();
    });
  },

  loadBank() {
    var self = this;

    if (config.offlineMode) {
      this.bank.loadEmpty();
      return;
    }

    this.mysql.loader.getBank(self, function(ids, counts, skills, skillLevels) {
      if (ids.length !== this.bank.size) this.save();

      this.bank.load(ids, counts, skills, skillLevels);
      this.bank.check();
    });
  },

  loadQuests() {
    var self = this;

    if (config.offlineMode) return;

    this.mysql.loader.getQuests(self, function(ids, stages) {
      ids.pop();
      stages.pop();

      if (this.quests.getQuestSize() !== ids.length) {
        log.info("Mismatch in quest data.");
        this.save();
      }

      this.quests.updateQuests(ids, stages);
    });

    this.mysql.loader.getAchievements(self, function(ids, progress) {
      ids.pop();
      progress.pop();

      if (this.quests.getAchievementSize() !== ids.length) {
        log.info("Mismatch in achievements data.");

        this.save();
      }

      this.quests.updateAchievements(ids, progress);
    });

    this.quests.onReady(function() {
      this.send(
        new Messages.Quest(Packets.QuestOpcode.Batch, this.quests.getData())
      );
    });
  },

  intro() {
    var self = this;

    if (this.ban > new Date()) {
      this.connection.sendUTF8("ban");
      this.connection.close("Player: " + this.username + " is banned.");
    }

    if (this.x <= 0 || this.y <= 0) this.sendToSpawn();

    if (this.hitPoints.getHitPoints() < 0)
      this.hitPoints.setHitPoints(this.getMaxHitPoints());

    if (this.mana.getMana() < 0) this.mana.setMana(this.mana.getMaxMana());

    var info = {
      instance: this.instance,
      username: this.username,
      x: this.x,
      y: this.y,
      kind: this.kind,
      rights: this.rights,
      hitPoints: this.hitPoints.getData(),
      mana: this.mana.getData(),
      experience: this.experience,
      level: this.level,
      lastLogin: this.lastLogin,
      pvpKills: this.pvpKills,
      pvpDeaths: this.pvpDeaths
    };

    this.groupPosition = [this.x, this.y];

    /**
     * Send player data to client here
     */

    this.world.addPlayer(self);

    this.send(new Messages.Welcome(info));
  },

  addExperience(exp) {
    var self = this;

    this.experience += exp;

    var oldLevel = this.level;

    this.level = Formulas.expToLevel(this.experience);

    if (oldLevel !== this.level)
      this.hitPoints.setMaxHitPoints(Formulas.getMaxHitPoints(this.level));

    this.world.pushToAdjacentGroups(
      this.group,
      new Messages.Experience({
        id: this.instance,
        amount: exp,
        experience: this.experience,
        level: this.level
      })
    );
  },

  heal(amount) {
    var self = this;
    this.hitPoints = this.healHitPoints(amount);
    this.mana = this.healManaPoints(amount);
  },

  healHitPoints(amount) {
    var self = this,
      type = "health";

    if (this.hitPoints && this.hitPoints.points < this.hitPoints.maxPoints) {
      this.hitPoints.heal(amount);

      this.sync();

      this.world.pushToAdjacentGroups(
        this.group,
        new Messages.Heal({
          id: this.instance,
          type: type,
          amount: amount
        })
      );
    }
  },

  healManaPoints(amount) {
    var self = this,
      type = "mana";

    if (this.mana && this.mana.points < this.mana.maxPoints) {
      this.mana.heal(amount);

      this.sync();

      this.world.pushToAdjacentGroups(
        this.group,
        new Messages.Heal({
          id: this.instance,
          type: type,
          amount: amount
        })
      );
    }
  },

  eat(id) {
    var self = this,
      type,
      amount;

    if (Items.hasPlugin(id)) {
      var tempItem = new (Items.isNewPlugin(id))(id, -1, this.x, this.y);

      tempItem.onUse(self);

      // plugins are responsible for sync and messages to player,
      // or calling player methods that handle that
    }
  },

  equip(string, count, ability, abilityLevel) {
    var self = this,
      data = Items.getData(string),
      type,
      id;

    if (!data || data === "null") return;

    if (Items.isArmour(string)) type = Modules.Equipment.Armour;
    else if (Items.isWeapon(string)) type = Modules.Equipment.Weapon;
    else if (Items.isPendant(string)) type = Modules.Equipment.Pendant;
    else if (Items.isRing(string)) type = Modules.Equipment.Ring;
    else if (Items.isBoots(string)) type = Modules.Equipment.Boots;

    id = Items.stringToId(string);

    switch (type) {
      case Modules.Equipment.Armour:
        if (this.hasArmour() && this.armour.id !== 114)
          this.inventory.add(this.armour.getItem());

        this.setArmour(id, count, ability, abilityLevel);
        break;

      case Modules.Equipment.Weapon:
        if (this.hasWeapon()) this.inventory.add(this.weapon.getItem());

        this.setWeapon(id, count, ability, abilityLevel);
        break;

      case Modules.Equipment.Pendant:
        if (this.hasPendant()) this.inventory.add(this.pendant.getItem());

        this.setPendant(id, count, ability, abilityLevel);
        break;

      case Modules.Equipment.Ring:
        if (this.hasRing()) this.inventory.add(this.ring.getItem());

        this.setRing(id, count, ability, abilityLevel);
        break;

      case Modules.Equipment.Boots:
        if (this.hasBoots()) this.inventory.add(this.boots.getItem());

        this.setBoots(id, count, ability, abilityLevel);
        break;
    }

    this.send(
      new Messages.Equipment(Packets.EquipmentOpcode.Equip, [
        type,
        Items.idToName(id),
        string,
        count,
        ability,
        abilityLevel
      ])
    );

    this.sync();
  },

  canEquip(string) {
    var self = this,
      requirement = Items.getLevelRequirement(string);

    if (requirement > this.level) {
      this.notify(
        "You must be at least level " + requirement + " to equip this."
      );
      return false;
    }

    return true;
  },

  die() {
    var self = this;

    this.dead = true;

    if (this.deathCallback) this.deathCallback();

    this.send(new Messages.Death(this.instance));
  },

  teleport(x, y, isDoor, animate) {
    var self = this;

    if (isDoor && !this.finishedTutorial()) {
      if (this.doorCallback) {
        this.doorCallback(x, y);
      }
      return;
    }

    this.world.pushToAdjacentGroups(
      this.group,
      new Messages.Teleport(this.instance, x, y, animate)
    );

    this.setPosition(x, y);
    this.checkGroups();

    this.world.cleanCombat(self);
  },

  updatePVP(pvp) {
    var self = this;

    /**
     * No need to update if the state is the same
     */

    if (this.pvp === pvp) return;

    if (this.pvp && !pvp) this.notify("You are no longer in a PvP zone!");
    else this.notify("You have entered a PvP zone!");

    this.pvp = pvp;

    this.sendToGroup(new Messages.PVP(this.instance, this.pvp));
  },

  updateMusic(song) {
    var self = this;

    this.currentSong = song;

    this.send(new Messages.Audio(song));
  },

  revertPoints() {
    var self = this;

    this.hitPoints.setHitPoints(this.hitPoints.getMaxHitPoints());
    this.mana.setMana(this.mana.getMaxMana());

    this.sync();
  },

  applyDamage(damage) {
    this.hitPoints.decrement(damage);
  },

  toggleProfile(state) {
    var self = this;

    this.profileDialogOpen = state;

    if (this.profileToggleCallback) this.profileToggleCallback();
  },

  getMana() {
    return this.mana.getMana();
  },

  getMaxMana() {
    return this.mana.getMaxMana();
  },

  getHitPoints() {
    return this.hitPoints.getHitPoints();
  },

  getMaxHitPoints() {
    return this.hitPoints.getMaxHitPoints();
  },

  getTutorial() {
    return this.quests.getQuest(Modules.Quests.Introduction);
  },

  /**
   * Setters
   */

  setArmour(id, count, ability, abilityLevel) {
    var self = this;

    if (!id) return;

    this.armour = new Armour(
      Items.idToString(id),
      id,
      count,
      ability,
      abilityLevel
    );
  },

  breakWeapon() {
    var self = this;

    this.notify("Your weapon has been broken.");

    this.setWeapon(-1, 0, 0, 0);

    this.sendEquipment();
  },

  setWeapon(id, count, ability, abilityLevel) {
    var self = this;

    if (!id) return;

    this.weapon = new Weapon(
      Items.idToString(id),
      id,
      count,
      ability,
      abilityLevel
    );

    if (this.weapon.ranged) this.attackRange = 7;
  },

  setPendant(id, count, ability, abilityLevel) {
    var self = this;

    if (!id) return;

    this.pendant = new Pendant(
      Items.idToString(id),
      id,
      count,
      ability,
      abilityLevel
    );
  },

  setRing(id, count, ability, abilityLevel) {
    var self = this;

    if (!id) return;

    this.ring = new Ring(
      Items.idToString(id),
      id,
      count,
      ability,
      abilityLevel
    );
  },

  setBoots(id, count, ability, abilityLevel) {
    var self = this;

    if (!id) return;

    this.boots = new Boots(
      Items.idToString(id),
      id,
      count,
      ability,
      abilityLevel
    );
  },

  guessPosition(x, y) {
    this.potentialPosition = {
      x: x,
      y: y
    };
  },

  setPosition(x, y) {
    var self = this;

    if (this.dead) return;

    this._super(x, y);

    this.world.pushToAdjacentGroups(
      this.group,
      new Messages.Movement(Packets.MovementOpcode.Move, [
        this.instance,
        x,
        y,
        false,
        false
      ]),
      this.instance
    );
  },

  setFuturePosition(x, y) {
    /**
     * Most likely will be used for anti-cheating methods
     * of calculating the actual time and duration for the
     * displacement.
     */

    this.futurePosition = {
      x: x,
      y: y
    };
  },

  timeout() {
    var self = this;
    this.connection.sendUTF8("timeout");
    this.connection.close(this.username + " timed out.");
  },

  invalidLogin() {
    var self = this;
    this.connection.sendUTF8("invalidlogin");
    this.connection.close(this.username + " invalid login.");
  },

  refreshTimeout() {
    var self = this;

    clearTimeout(this.disconnectTimeout);

    this.disconnectTimeout = setTimeout(function() {
      this.timeout();
    }, this.timeoutDuration);
  },

  /**
   * Getters
   */

  hasArmour() {
    return this.armour && this.armour.name !== "null" && this.armour.id !== -1;
  },

  hasWeapon() {
    return this.weapon && this.weapon.name !== "null" && this.weapon.id !== -1;
  },

  hasBreakableWeapon() {
    return this.weapon && this.weapon.breakable;
  },

  hasPendant() {
    return (
      this.pendant && this.pendant.name !== "null" && this.pendant.id !== -1
    );
  },

  hasRing() {
    return this.ring && this.ring.name !== "null" && this.ring.id !== -1;
  },

  hasBoots() {
    return this.boots && this.boots.name !== "null" && this.boots.id !== -1;
  },

  hasMaxHitPoints() {
    return this.getHitPoints() >= this.hitPoints.getMaxHitPoints();
  },

  hasMaxMana() {
    return this.mana.getMana() >= this.mana.getMaxMana();
  },

  hasSpecialAttack() {
    return (
      this.weapon &&
      (this.weapon.hasCritical() ||
        this.weapon.hasExplosive() ||
        this.weapon.hasStun())
    );
  },

  canBeStunned() {
    return true;
  },

  getState() {
    var self = this;

    return {
      type: this.type,
      id: this.instance,
      name: this.username,
      x: this.x,
      y: this.y,
      rights: this.rights,
      level: this.level,
      pvp: this.pvp,
      pvpKills: this.pvpKills,
      pvpDeaths: this.pvpDeaths,
      hitPoints: this.hitPoints.getData(),
      mana: this.mana.getData(),
      armour: this.armour.getData(),
      weapon: this.weapon.getData(),
      pendant: this.pendant.getData(),
      ring: this.ring.getData(),
      boots: this.boots.getData()
    };
  },

  getRemoteAddress() {
    return this.connection.socket.conn.remoteAddress;
  },

  getSpawn() {
    var self = this,
      position;

    /**
     * Here we will implement functions from quests and
     * other special events and determine a spawn point.
     */

    if (this.getTutorial().isFinished())
      position = {
        x: 325,
        y: 86
      };
    else
      position = {
        x: 17,
        y: 555
      };

    return position;
  },

  getHit(target) {
    var self = this;

    var defaultDamage = Formulas.getDamage(self, target),
      isSpecial = 100 - this.weapon.abilityLevel < Utils.randomInt(0, 100);

    if (!this.hasSpecialAttack() || !isSpecial)
      return new Hit(Modules.Hits.Damage, defaultDamage);

    switch (this.weapon.ability) {
      case Modules.Enchantment.Critical:
        /**
         * Still experimental, not sure how likely it is that you're
         * gonna do a critical strike. I just do not want it getting
         * out of hand, it's easier to buff than to nerf..
         */

        var multiplier = 1.0 + this.weapon.abilityLevel,
          damage = defaultDamage * multiplier;

        return new Hit(Modules.Hits.Critical, damage);

      case Modules.Enchantment.Stun:
        return new Hit(Modules.Hits.Stun, defaultDamage);

      case Modules.Enchantment.Explosive:
        return new Hit(Modules.Hits.Explosive, defaultDamage);
    }
  },

  isMuted() {
    var self = this,
      time = new Date().getTime();

    return this.mute - time > 0;
  },

  isRanged() {
    return this.weapon && this.weapon.isRanged();
  },

  isDead() {
    return this.getHitPoints() < 1 || this.dead;
  },

  /**
   * Miscellaneous
   */

  send(message) {
    this.world.pushToPlayer(this, message);
  },

  sendToGroup(message) {
    this.world.pushToGroup(this.group, message);
  },

  sendEquipment() {
    var self = this,
      info = [
        this.armour.getData(),
        this.weapon.getData(),
        this.pendant.getData(),
        this.ring.getData(),
        this.boots.getData()
      ];

    this.send(new Messages.Equipment(Packets.EquipmentOpcode.Batch, info));
  },

  sendToSpawn() {
    var self = this,
      position = this.getSpawn();

    this.x = position.x;
    this.y = position.y;
  },

  sync(all) {
    var self = this;

    /**
     * Function to be used for syncing up health,
     * mana, exp, and other variables
     */

    if (!this.hitPoints || !this.mana) return;

    var info = {
      id: this.instance,
      hitPoints: this.getHitPoints(),
      maxHitPoints: this.getMaxHitPoints(),
      mana: this.mana.getMana(),
      maxMana: this.mana.getMaxMana(),
      experience: this.experience,
      level: this.level,
      armour: this.armour.getString(),
      weapon: this.weapon.getData()
    };

    this.world.pushToAdjacentGroups(
      this.group,
      new Messages.Sync(info),
      all ? null : this.instance
    );

    this.save();
  },

  notify(message) {
    var self = this;

    if (!message) return;

    this.send(
      new Messages.Notification(Packets.NotificationOpcode.Text, message)
    );
  },

  stopMovement(force) {
    /**
     * Forcefully stopping the player will simply hault
     * them in between tiles. Should only be used if they are
     * being transported elsewhere.
     */

    var self = this;

    this.send(new Messages.Movement(Packets.MovementOpcode.Stop, force));
  },

  finishedTutorial() {
    var self = this;

    if (!this.quests) return true;

    return this.getTutorial().isFinished();
  },

  checkGroups() {
    var self = this;

    if (!this.groupPosition) return;

    var diffX = Math.abs(this.groupPosition[0] - this.x),
      diffY = Math.abs(this.groupPosition[1] - this.y);

    if (diffX >= 10 || diffY >= 10) {
      this.groupPosition = [this.x, this.y];

      if (this.groupCallback) this.groupCallback();
    }
  },

  movePlayer() {
    var self = this;

    /**
     * Server-sided callbacks towards movement should
     * not be able to be overwritten. In the case that
     * this is used (for Quests most likely) the server must
     * check that no hacker removed the constraint in the client-side.
     * If they are not within the bounds, apply the according punishment.
     */

    this.send(new Messages.Movement(Packets.MovementOpcode.Started));
  },

  walkRandomly() {
    var self = this;

    setInterval(function() {
      this.setPosition(
        this.x + Utils.randomInt(-5, 5),
        this.y + Utils.randomInt(-5, 5)
      );
    }, 2000);
  },

  killCharacter(character) {
    var self = this;

    if (this.killCallback) this.killCallback(character);
  },

  save() {
    var self = this;

    if (config.offlineMode || this.isGuest) return;

    this.mysql.creator.save(self);
  },

  inTutorial() {
    return this.world.map.inTutorialArea(this);
  },

  onGroup(callback) {
    this.groupCallback = callback;
  },

  onAttack(callback) {
    this.attackCallback = callback;
  },

  onHit(callback) {
    this.hitCallback = callback;
  },

  onKill(callback) {
    this.killCallback = callback;
  },

  onDeath(callback) {
    this.deathCallback = callback;
  },

  onTalkToNPC(callback) {
    this.npcTalkCallback = callback;
  },

  onDoor(callback) {
    this.doorCallback = callback;
  },

  onProfile(callback) {
    this.profileToggleCallback = callback;
  },

  onReady(callback) {
    this.readyCallback = callback;
  }
});
