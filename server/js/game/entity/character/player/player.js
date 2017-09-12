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
    Guild = require('./guild');

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

        self.handler = new Handler(self);

        self.inventory = new Inventory(self, 20);
        self.bank = new Bank(self, 56);
        self.quests = new Quests(self);
        self.abilities = new Abilities(self);
        self.enchant = new Enchant(self);

        self.introduced = false;
        self.currentSong = null;
        self.acceptedTrade = false;
        self.invincible = false;

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
            self.connection.close('Player: ' + self.player.username + ' is banned.');
        }

        if (self.x <= 0 || self.y <= 0)
            self.sendToSpawn();

        if (self.hitPoints.getHitPoints() < 0)
            self.hitPoints.setHitPoints(self.hitPoints.getMaxHitPoints());

        if (self.mana.getMana() < 0)
            self.mana.setMana(self.mana.getMaxMana());

        var info = [
                self.instance,
                self.username,
                self.x,
                self.y,
                self.kind,
                self.rights,
                self.hitPoints.getData(),
                self.mana.getData(),
                self.experience,
                self.level,
                self.lastLogin,
                self.pvpKills,
                self.pvpDeaths
            ];

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
        self.level = Formulas.expToLevel(self.experience);

        self.world.pushToAdjacentGroups(self.group, new Messages.Experience({
            id: self.instance,
            amount: exp,
            experience: self.experience,
            level: self.level
        }));
    },

    eat: function(id) {
        var self = this,
            type, amount;

        if (Items.healsHealth(id)) {
            type = 'health';
            amount = Items.getHealingFactor(id);

            self.hitPoints.heal(amount);

        } else if (Items.healsMana(id)) {
            type = 'mana';
            amount = Items.getManaFactor(id);

            self.mana.heal(amount);
        }

        if (!type || !amount)
            return;

        /**
         * Send the new points data, then signal
         * the client to show healing.
         */

        self.sync();

        self.world.pushBroadcast(new Messages.Heal({
            id: self.instance,
            type: type,
            amount: amount
        }));
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

    die: function() {
        var self = this;

        self.dead = true;

        if (self.deathCallback)
            self.deathCallback();

        self.send(new Messages.Death(self.instance));
    },

    teleport: function(x, y, isDoor) {
        var self = this;

        if (isDoor && !self.finishedTutorial()) {
            if (self.doorCallback)
                self.doorCallback(x, y);

            return;
        }

        self.world.pushToAdjacentGroups(self.group, new Messages.Teleport(self.instance, x, y));

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

        self.pvp = pvp;

        self.send(new Messages.PVP(self.instance, pvp));
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

    /**
     * Getters
     */

    hasArmour: function() {
        return this.armour && this.armour.name !== 'null' && this.armour.id !== -1;
    },

    hasWeapon: function() {
        return this.weapon && this.weapon.name !== 'null' && this.weapon.id !== -1;
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
        return this.hitPoints.getHitPoints() >= this.hitPoints.getMaxHitPoints();
    },

    hasMaxMana: function() {
        return this.mana.getMana() >= this.mana.getMaxMana();
    },

    getState: function() {
        var self = this;

        return [
            self.type,
            self.instance,
            self.username,
            self.x,
            self.y,
            self.rights,
            self.level,
            self.pvp,
            self.hitPoints.getData(),
            self.pvpKills,
            self.pvpDeaths,
            self.armour.getData(),
            self.weapon.getData(),
            self.pendant.getData(),
            self.ring.getData(),
            self.boots.getData()
        ]
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

    isMuted: function() {
        var self = this,
            time = new Date().getTime();

        return self.mute - time > 0;
    },

    isRanged: function() {
        return this.weapon && this.weapon.isRanged();
    },

    isDead: function() {
        return this.hitPoints.getHitPoints() < 1 || this.dead;
    },

    /**
     * Miscellaneous
     */

    send: function(message) {
        this.world.pushToPlayer(this, message);
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
            hitPoints: self.hitPoints.getHitPoints(),
            maxHitPoints: self.hitPoints.getMaxHitPoints(),
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

    save: function() {
        var self = this;

        if (config.offlineMode)
            return;

        self.mysql.creator.save(self);
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