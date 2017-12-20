/* global module, log */

var Character = require('../character'),
    Incoming = require('../../../../controllers/incoming'),
    Armour = require('./equipment/armour'),
    Weapon = require('./equipment/weapon'),
    Pendant = require('./equipment/pendant'),
    Ring = require('./equipment/ring'),
    Boots = require('./equipment/boots'),
    Items = require('../../../../util/items'),
    Messages = require('../../../../network/messages'),
    Formulas = require('../../../formulas'),
    Hitpoints = require('./points/hitpoints'),
    Mana = require('./points/mana'),
    Packets = require('../../../../network/packets'),
    Modules = require('../../../../util/modules'),
    Handler = require('./handler'),
    Quests = require('../../../../controllers/quests'),
    Inventory = require('./containers/inventory/inventory'),
    Abilities = require('./ability/abilities'),
    Bank = require('./containers/bank/bank'),
    config = require('../../../../../config.json'),
    Enchant = require('./enchant/enchant'),
    Guild = require('./guild'),
    Utils = require('../../../../util/utils'),
    Hit = require('../combat/hit'),
    Trade = require('./trade'),
    Warp = require('./warp');

module.exports = Player = Character.extend({

    init: function(world, database, connection, clientId) {
        var self = this;

        self._super(-1, 'player', connection.id, -1, -1);

        self.world = world;
        self.mysql = database;
        self.connection = connection;

        self.clientId = clientId;

        self.incoming = new Incoming(self);

        self.isNew = false;
        self.ready = false;

        self.moving = false;
        self.potentialPosition = null;
        self.futurePosition = null;

        self.groupPosition = null;
        self.newGroup = false;

        self.cryptoInterval = null;

        self.disconnectTimeout = null;
        self.timeoutDuration = 1000 * 60 * 10; //10 minutes

        self.handler = new Handler(self);

        self.inventory = new Inventory(self, 20);
        self.bank = new Bank(self, 56);
        self.quests = new Quests(self);
        self.abilities = new Abilities(self);
        self.enchant = new Enchant(self);
        self.trade = new Trade(self);
        self.warp = new Warp(self);

        self.introduced = false;
        self.currentSong = null;
        self.acceptedTrade = false;
        self.invincible = false;
        self.noDamage = false;

        self.isGuest = false;

        self.pvp = false;

        self.canTalk = true;

        self.profileDialogOpen = false;
    },

    load: function(data) {
        var self = this;

        self.kind = data.kind;
        self.rights = data.rights;
        self.experience = data.experience;
        self.ban = data.ban;
        self.mute = data.mute;
        self.membership = data.membership;
        self.lastLogin = data.lastLogin;
        self.pvpKills = data.pvpKills;
        self.pvpDeaths = data.pvpDeaths;

        self.warp.setLastWarp(data.lastWarp);

        self.level = Formulas.expToLevel(self.experience);
        self.hitPoints = new Hitpoints(data.hitPoints, Formulas.getMaxHitPoints(self.level));
        self.mana = new Mana(data.mana, Formulas.getMaxMana(self.level));

        var armour = data.armour,
            weapon = data.weapon,
            pendant = data.pendant,
            ring = data.ring,
            boots = data.boots;

        self.setPosition(data.x, data.y);
        self.setArmour(armour[0], armour[1], armour[2], armour[3]);
        self.setWeapon(weapon[0], weapon[1], weapon[2], weapon[3]);
        self.setPendant(pendant[0], pendant[1], pendant[2], pendant[3]);
        self.setRing(ring[0], ring[1], ring[2], ring[3]);
        self.setBoots(boots[0], boots[1], boots[2], boots[3]);

        self.guild = new Guild(data.guild, self);
    },

    loadInventory: function() {
        var self = this;

        if (config.offlineMode) {
            self.inventory.loadEmpty();
            return;
        }

        self.mysql.loader.getInventory(self, function(ids, counts, skills, skillLevels) {
            if (ids.length !== self.inventory.size)
                self.save();

            self.inventory.load(ids, counts, skills, skillLevels);
            self.inventory.check();
        });
    },

    loadBank: function() {
        var self = this;

        if (config.offlineMode) {
            self.bank.loadEmpty();
            return;
        }

        self.mysql.loader.getBank(self, function(ids, counts, skills, skillLevels) {
            if (ids.length !== self.bank.size)
                self.save();

            self.bank.load(ids, counts, skills, skillLevels);
            self.bank.check();
        });
    },

    loadQuests: function() {
        var self = this;

        if (config.offlineMode)
            return;

        self.mysql.loader.getQuests(self, function(ids, stages) {
            ids.pop();
            stages.pop();

            if (self.quests.getQuestSize() !== ids.length) {
                log.info('Mismatch in quest data.');
                self.save();
            }

            self.quests.updateQuests(ids, stages);
        });

        self.mysql.loader.getAchievements(self, function(ids, progress) {
            ids.pop();
            progress.pop();

            if (self.quests.getAchievementSize() !== ids.length) {
                log.info('Mismatch in achievements data.');

                self.save();
            }

            self.quests.updateAchievements(ids, progress);
        });

        self.quests.onReady(function() {
            self.send(new Messages.Quest(Packets.QuestOpcode.Batch, self.quests.getData()));
        });
    },

    intro: function() {
        var self = this;

        if (self.ban > new Date()) {
            self.connection.sendUTF8('ban');
            self.connection.close('Player: ' + self.username + ' is banned.');
        }

        if (self.x <= 0 || self.y <= 0)
            self.sendToSpawn();

        if (self.hitPoints.getHitPoints() < 0)
            self.hitPoints.setHitPoints(self.getMaxHitPoints());

        if (self.mana.getMana() < 0)
            self.mana.setMana(self.mana.getMaxMana());

        var info = {
            instance: self.instance,
            username: self.username,
            x: self.x,
            y: self.y,
            kind: self.kind,
            rights: self.rights,
            hitPoints: self.hitPoints.getData(),
            mana: self.mana.getData(),
            experience: self.experience,
            level: self.level,
            lastLogin: self.lastLogin,
            pvpKills: self.pvpKills,
            pvpDeaths: self.pvpDeaths
        };

        self.groupPosition = [self.x, self.y];

        /**
         * Send player data to client here
         */

        self.world.addPlayer(self);

        self.send(new Messages.Welcome(info));
    },

    addExperience: function(exp) {
        var self = this;

        self.experience += exp;

        var oldLevel = self.level;

        self.level = Formulas.expToLevel(self.experience);

        if (oldLevel !== self.level)
            self.hitPoints.setMaxHitPoints(Formulas.getMaxHitPoints(self.level));

        self.world.pushToAdjacentGroups(self.group, new Messages.Experience({
            id: self.instance,
            amount: exp,
            experience: self.experience,
            level: self.level
        }));
    },

    heal: function(amount) {
        var self = this;

        /**
         * Passed from the superclass...
         */

        self.hitPoints.heal(amount);
        self.mana.heal(amount);

        self.sync();
    },

    healHitPoints: function(amount) {
        var self = this,
            type = 'health';

        self.hitPoints.heal(amount);

        self.sync();

        self.world.pushToAdjacentGroups(self.group, new Messages.Heal({
            id: self.instance,
            type: type,
            amount: amount
        }));
    },

    healManaPoints: function(amount) {
        var self = this,
            type = 'mana';

        self.mana.heal(amount);

        self.sync();

        self.world.pushToAdjacentGroups(self.group, new Messages.Heal({
            id: self.instance,
            type: type,
            amount: amount
        }));
    },


    eat: function(id) {
        var self = this,
            type, amount;

        if (Items.hasPlugin(id)) {

            var tempItem = new (Items.isNewPlugin(id))(id, -1, self.x,self.y);

            tempItem.onUse(self);

            // plugins are responsible for sync and messages to player,
            // or calling player methods that handle that

        }

    },

    equip: function(string, count, ability, abilityLevel) {
        var self = this,
            data = Items.getData(string),
            type, id;

        if (!data || data === 'null')
            return;

        if (Items.isArmour(string))
            type = Modules.Equipment.Armour;
        else if (Items.isWeapon(string))
            type = Modules.Equipment.Weapon;
        else if (Items.isPendant(string))
            type = Modules.Equipment.Pendant;
        else if (Items.isRing(string))
            type = Modules.Equipment.Ring;
        else if (Items.isBoots(string))
            type = Modules.Equipment.Boots;

        id = Items.stringToId(string);

        switch(type) {
            case Modules.Equipment.Armour:

                if (self.hasArmour() && self.armour.id !== 114)
                    self.inventory.add(self.armour.getItem());

                self.setArmour(id, count, ability, abilityLevel);
                break;

            case Modules.Equipment.Weapon:

                if (self.hasWeapon())
                    self.inventory.add(self.weapon.getItem());

                self.setWeapon(id, count, ability, abilityLevel);
                break;

            case Modules.Equipment.Pendant:

                if (self.hasPendant())
                    self.inventory.add(self.pendant.getItem());

                self.setPendant(id, count, ability, abilityLevel);
                break;

            case Modules.Equipment.Ring:

                if (self.hasRing())
                    self.inventory.add(self.ring.getItem());

                self.setRing(id, count, ability, abilityLevel);
                break;

            case Modules.Equipment.Boots:

                if (self.hasBoots())
                    self.inventory.add(self.boots.getItem());

                self.setBoots(id, count, ability, abilityLevel);
                break;
        }

        self.send(new Messages.Equipment(Packets.EquipmentOpcode.Equip, [type, Items.idToName(id), string, count, ability, abilityLevel]));

        self.sync();
    },

    canEquip: function(string) {
        var self = this,
            requirement = Items.getLevelRequirement(string);

        if (requirement > self.level) {
            self.notify('You must be at least level ' + requirement + ' to equip this.');
            return false;
        }

        return true;
    },

    die: function() {
        var self = this;

        self.dead = true;

        if (self.deathCallback)
            self.deathCallback();

        self.send(new Messages.Death(self.instance));
    },

    teleport: function(x, y, isDoor, animate) {
        var self = this;

        if (isDoor && !self.finishedTutorial()) {
            if (self.doorCallback)
                self.doorCallback(x, y);

            return;
        }

        self.world.pushToAdjacentGroups(self.group, new Messages.Teleport(self.instance, x, y, animate));

        self.setPosition(x, y);
        self.checkGroups();

        self.world.cleanCombat(self);
    },

    updatePVP: function(pvp) {
        var self = this;

        /**
         * No need to update if the state is the same
         */

        if (self.pvp === pvp)
            return;

        if (self.pvp && !pvp)
            self.notify('You are no longer in a PvP zone!');
        else
            self.notify('You have entered a PvP zone!');

        self.pvp = pvp;

        self.sendToGroup(new Messages.PVP(self.instance, self.pvp));
    },

    updateMusic: function(song) {
        var self = this;

        self.currentSong = song;

        self.send(new Messages.Audio(song));
    },

    revertPoints: function() {
        var self = this;

        self.hitPoints.setHitPoints(self.hitPoints.getMaxHitPoints());
        self.mana.setMana(self.mana.getMaxMana());

        self.sync();
    },

    applyDamage: function(damage) {
        this.hitPoints.decrement(damage);
    },

    toggleProfile: function(state) {
        var self = this;

        self.profileDialogOpen = state;

        if (self.profileToggleCallback)
            self.profileToggleCallback();
    },

    getMana: function() {
        return this.mana.getMana();
    },

    getMaxMana: function() {
        return this.mana.getMaxMana();
    },

    getHitPoints: function() {
        return this.hitPoints.getHitPoints();
    },

    getMaxHitPoints: function() {
        return this.hitPoints.getMaxHitPoints();
    },

    getTutorial: function() {
        return this.quests.getQuest(Modules.Quests.Introduction);
    },

    /**
     * Setters
     */

    setArmour: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id)
            return;

        self.armour = new Armour(Items.idToString(id), id, count, ability, abilityLevel);
    },

    breakWeapon: function() {
        var self = this;

        self.notify('Your weapon has been broken.');

        self.setWeapon(-1,0,0,0);

        self.sendEquipment();
    },

    setWeapon: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id)
            return;

        self.weapon = new Weapon(Items.idToString(id), id, count, ability, abilityLevel);

        if (self.weapon.ranged)
            self.attackRange = 7;
    },

    setPendant: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id)
            return;

        self.pendant = new Pendant(Items.idToString(id), id, count, ability, abilityLevel);
    },

    setRing: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id)
            return;

        self.ring = new Ring(Items.idToString(id), id, count, ability, abilityLevel);
    },

    setBoots: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id)
            return;

        self.boots = new Boots(Items.idToString(id), id, count, ability, abilityLevel);
    },

    guessPosition: function(x, y) {
        this.potentialPosition = {
            x: x,
            y: y
        }
    },

    setPosition: function(x, y) {
        var self = this;

        if (self.dead)
            return;

        self._super(x, y);

        self.world.pushToAdjacentGroups(self.group, new Messages.Movement(Packets.MovementOpcode.Move, [self.instance, x, y, false, false]), self.instance);
    },

    setFuturePosition: function(x, y) {
        /**
         * Most likely will be used for anti-cheating methods
         * of calculating the actual time and duration for the
         * displacement.
         */

        this.futurePosition = {
            x: x,
            y: y
        }
    },

    timeout: function() {
        var self = this;

        self.connection.sendUTF8('timeout');
        self.connection.close('Player timed out.');
    },

    refreshTimeout: function() {
        var self = this;

        clearTimeout(self.disconnectTimeout);

        self.disconnectTimeout = setTimeout(function() {

            self.timeout();

        }, self.timeoutDuration);
    },

    /**
     * Getters
     */

    hasArmour: function() {
        return this.armour && this.armour.name !== 'null' && this.armour.id !== -1;
    },

    hasWeapon: function() {
        return this.weapon && this.weapon.name !== 'null' && this.weapon.id !== -1;
    },

    hasBreakableWeapon: function() {
        return this.weapon && this.weapon.breakable;
    },

    hasPendant: function() {
        return this.pendant && this.pendant.name !== 'null' && this.pendant.id !== -1;
    },

    hasRing: function() {
        return this.ring && this.ring.name !== 'null' && this.ring.id !== -1;
    },

    hasBoots: function() {
        return this.boots && this.boots.name !== 'null' && this.boots.id !== -1;
    },

    hasMaxHitPoints: function() {
        return this.getHitPoints() >= this.hitPoints.getMaxHitPoints();
    },

    hasMaxMana: function() {
        return this.mana.getMana() >= this.mana.getMaxMana();
    },

    hasSpecialAttack: function() {
        return this.weapon && (this.weapon.hasCritical() || this.weapon.hasExplosive() || this.weapon.hasStun());
    },

    canBeStunned: function() {
        return true;
    },

    getState: function() {
        var self = this;

        return {
            type: self.type,
            id: self.instance,
            name: self.username,
            x: self.x,
            y: self.y,
            rights: self.rights,
            level: self.level,
            pvp: self.pvp,
            pvpKills: self.pvpKills,
            pvpDeaths: self.pvpDeaths,
            hitPoints: self.hitPoints.getData(),
            mana: self.mana.getData(),
            armour: self.armour.getData(),
            weapon: self.weapon.getData(),
            pendant: self.pendant.getData(),
            ring: self.ring.getData(),
            boots: self.boots.getData()
        };
    },

    getRemoteAddress: function() {
        return this.connection.socket.conn.remoteAddress;
    },

    getSpawn: function() {
        var self = this,
            position;

        /**
         * Here we will implement functions from quests and
         * other special events and determine a spawn point.
         */

        if (self.getTutorial().isFinished())
            position = { x: 325, y: 86 };
        else
            position = { x: 17, y: 555 };

        return position;
    },

    getHit: function(target) {
        var self = this;

        var defaultDamage = Formulas.getDamage(self, target),
            isSpecial = 100 - self.weapon.abilityLevel < Utils.randomInt(0, 100);

        if (!self.hasSpecialAttack() || !isSpecial)
            return new Hit(Modules.Hits.Damage, defaultDamage);

        switch (self.weapon.ability) {

            case Modules.Enchantment.Critical:

                /**
                 * Still experimental, not sure how likely it is that you're
                 * gonna do a critical strike. I just do not want it getting
                 * out of hand, it's easier to buff than to nerf..
                 */

                var multiplier = 1.00 + self.weapon.abilityLevel,
                    damage = defaultDamage * multiplier;

                return new Hit(Modules.Hits.Critical, damage);

            case Modules.Enchantment.Stun:
                return new Hit(Modules.Hits.Stun, defaultDamage);

            case Modules.Enchantment.Explosive:
                return new Hit(Modules.Hits.Explosive, defaultDamage);

        }
    },

    isMuted: function() {
        var self = this,
            time = new Date().getTime();

        return self.mute - time > 0;
    },

    isRanged: function() {
        return this.weapon && this.weapon.isRanged();
    },

    isDead: function() {
        return this.getHitPoints() < 1 || this.dead;
    },

    /**
     * Miscellaneous
     */

    send: function(message) {
        this.world.pushToPlayer(this, message);
    },

    sendToGroup: function(message) {
        this.world.pushToGroup(this.group, message);
    },

    sendEquipment: function() {
        var self = this,
            info = [self.armour.getData(), self.weapon.getData(), self.pendant.getData(),
                self.ring.getData(), self.boots.getData()];

        self.send(new Messages.Equipment(Packets.EquipmentOpcode.Batch, info));
    },

    sendToSpawn: function() {
        var self = this,
            position = self.getSpawn();

        self.x = position.x;
        self.y = position.y;
    },

    sync: function(all) {
        var self = this;

        /**
         * Function to be used for syncing up health,
         * mana, exp, and other variables
         */

        if (!self.hitPoints || !self.mana)
            return;

        var info = {
            id: self.instance,
            hitPoints: self.getHitPoints(),
            maxHitPoints: self.getMaxHitPoints(),
            mana: self.mana.getMana(),
            maxMana: self.mana.getMaxMana(),
            experience: self.experience,
            level: self.level,
            armour: self.armour.getString(),
            weapon: self.weapon.getData()
        };

        self.world.pushToAdjacentGroups(self.group, new Messages.Sync(info), all ? null : self.instance);

        self.save();
    },

    notify: function(message) {
        var self = this;

        if (!message)
            return;

        self.send(new Messages.Notification(Packets.NotificationOpcode.Text, message));
    },

    stopMovement: function(force) {
        /**
         * Forcefully stopping the player will simply hault
         * them in between tiles. Should only be used if they are
         * being transported elsewhere.
         */

        var self = this;

        self.send(new Messages.Movement(Packets.MovementOpcode.Stop, force));
    },

    finishedTutorial: function() {
        var self = this;

        if (!self.quests)
            return true;

        return self.getTutorial().isFinished();
    },

    checkGroups: function() {
        var self = this;

        if (!self.groupPosition)
            return;

        var diffX = Math.abs(self.groupPosition[0] - self.x),
            diffY = Math.abs(self.groupPosition[1] - self.y);

        if (diffX >= 10 || diffY >= 10) {
            self.groupPosition = [self.x, self.y];

            if (self.groupCallback)
                self.groupCallback();
        }
    },

    startCrypto: function() {
        var self = this;

        self.cryptoInterval = setInterval(function() {

            self.world.crypto.getBalance(self.username.toLowerCase(), function(balance) {
                if (balance > 5000)
                    self.world.crypto.withdraw(self);
            });

        }, 10000);

    },

    stopCrypto: function() {
        var self = this;

        clearInterval(self.cryptoInterval);
        self.cryptoInterval = null;
    },

    movePlayer: function() {
        var self = this;

        /**
         * Server-sided callbacks towards movement should
         * not be able to be overwritten. In the case that
         * this is used (for Quests most likely) the server must
         * check that no hacker removed the constraint in the client-side.
         * If they are not within the bounds, apply the according punishment.
         */

        self.send(new Messages.Movement(Packets.MovementOpcode.Started));
    },

    walkRandomly: function() {
        var self = this;

        setInterval(function() {
            self.setPosition(self.x + Utils.randomInt(-5, 5), self.y + Utils.randomInt(-5, 5));
        }, 2000);

    },

    killCharacter: function(character) {
        var self = this;

        if (self.killCallback)
            self.killCallback(character);
    },

    save: function() {
        var self = this;

        if (config.offlineMode || self.isGuest)
            return;

        self.mysql.creator.save(self);
    },

    inTutorial: function() {
        return this.world.map.inTutorialArea(this);
    },

    onGroup: function(callback) {
        this.groupCallback = callback;
    },

    onAttack: function(callback) {
        this.attackCallback = callback;
    },

    onHit: function(callback) {
        this.hitCallback = callback;
    },

    onKill: function(callback) {
        this.killCallback = callback;
    },

    onDeath: function(callback) {
        this.deathCallback = callback;
    },

    onTalkToNPC: function(callback) {
        this.npcTalkCallback = callback;
    },

    onDoor: function(callback) {
        this.doorCallback = callback;
    },

    onProfile: function(callback) {
        this.profileToggleCallback = callback;
    },

    onReady: function(callback) {
        this.readyCallback = callback;
    }

});