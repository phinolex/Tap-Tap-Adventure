var _ = require('underscore');
var cls = require('./lib/class');
var Types = require('../../shared/js/gametypes');

var Messages = {};
module.exports = Messages;

var Message = cls.Class.extend({
});
Messages.Spawn = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        var spawn = [Types.Messages.SPAWN];
        return spawn.concat(this.entity.getState());
    }
});
Messages.Despawn = Message.extend({
    init: function (entityId) {
        this.entityId = entityId;
    },
    serialize: function () {
        return [Types.Messages.DESPAWN, this.entityId];
    }
});
Messages.Move = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.MOVE,
                this.entity.id,
                this.entity.x,
                this.entity.y];
    }
});
Messages.LootMove = Message.extend({
    init: function(entity, item) {
        this.entity = entity;
        this.item = item;
    },
    serialize: function() {
        return [Types.Messages.LOOTMOVE,
            this.entity.id,
            this.item.id];
    }
});
Messages.Attack = Message.extend({
    init: function(attackerId, targetId) {
        this.attackerId = attackerId;
        this.targetId = targetId;
    },
    serialize: function() {
        return [Types.Messages.ATTACK,
            this.attackerId,
            this.targetId];
    }
});
Messages.Wanted = Message.extend({
    init: function (player, isWanted) {
        this.player = player;
        this.isWanted = isWanted;
    },
    serialize: function () {
        return [Types.Messages.WANTED,
            this.player.id,
            this.isWanted];
    }
});
Messages.Health = Message.extend({
    init: function (points, isRegen) {
        this.points = points;
        this.isRegen = isRegen;
    },
    serialize: function() {
        var health = [Types.Messages.HEALTH,
                      this.points];
        if (this.isRegen)
            health.push(1);
        return health;
    }
});
Messages.Notify = Message.extend({
  init: function(message) {
    this.message = message;
  },
  serialize: function() {
    return [Types.Messages.NOTIFY,
            this.message];
  }
});
Messages.HitPoints = Message.extend({
    init: function(maxHitPoints, maxMana) {
        this.maxHitPoints = maxHitPoints;
        this.maxMana = maxMana;
    },
    serialize: function() {
        return [Types.Messages.HP,
            this.maxHitPoints,
            this.maxMana];
    }
});
Messages.TalkToNPC = Message.extend({
    init: function(questNumber, isCompleted){
        this.questNumber = questNumber;
        this.isCompleted = isCompleted;
    },
    serialize: function(){
        return [Types.Messages.TALKTONPC,
            this.questNumber,
            this.isCompleted];
    }
});
Messages.EquipItem = Message.extend({
    init: function (player, itemKind) {
        this.playerId = player.id;
        this.itemKind = itemKind;
    },
    serialize: function () {
        return [Types.Messages.EQUIP,
                this.playerId,
                this.itemKind];
    }
});
Messages.Drop = Message.extend({
    init: function (mob, item) {
        this.mob = mob;
        this.item = item;
    },
    serialize: function() {
        var drop = [Types.Messages.DROP,
                    this.mob.id,
                    this.item.id,
                    this.item.kind,
                    
                    this.item.count,
                    this.item.skillKind,
                    this.item.skillLevel];
        return drop;
    }
});
Messages.Log = Message.extend({
    init: function(message) {
        this.message = message;
        this.message.unshift(Types.Messages.LOG);
    },
    serialize: function() {
        return this.message;
    }
});
Messages.Skill = Message.extend({
    init: function(type, id, level) {
        this.type = type;
        this.id = id;
        this.level = level;
    },
    serialize: function() {
        return [Types.Messages.SKILL,
            this.type,
            this.id,
            this.level];
    }
});
Messages.SkillInstall = Message.extend({
    init: function(index, name) {
        this.index = index;
        this.name = name;
    },
    serialize: function() {
        return [Types.Messages.SKILLINSTALL, this.index, this.name];
    }
});
Messages.Chat = Message.extend({
    init: function (player, message) {
        this.playerId = player.id;
        this.message = message;
    },
    serialize: function () {
        return [Types.Messages.CHAT,
                this.playerId,
                this.message];
    }
});
Messages.Teleport = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.TELEPORT,
                this.entity.id,
                this.entity.x,
                this.entity.y];
    }
});
Messages.Damage = Message.extend({
    init: function (entity, points, hp, maxHp) {
        this.entity = entity;
        this.points = points;
        this.hp = hp;
        this.maxHitPoints = maxHp;
    },
    serialize: function () {
        return [Types.Messages.DAMAGE,
                this.entity.id,
                this.points,
                this.hp,
                this.maxHitPoints];
    }
});
Messages.CharacterInfo = Message.extend({
    init: function(player) {
        this.player = player;
    },
    serialize: function() {
      return [Types.Messages.CHARACTERINFO,
            this.player.kind,                 // 0
            this.player.armor,                // 1
            this.player.armorEnchantedPoint,  // 2
            this.player.avatar,               // 3
            this.player.weapon,               // 4
            this.player.weaponEnchantedPoint, // 5
            this.player.weaponSkillKind,      // 6
            this.player.weaponSkillLevel,     // 7
            this.player.weaponAvatar,         // 8
            this.player.pendant,              // 9
            this.player.pendantEnchantedPoint,// 10
            this.player.pendantSkillKind,     // 11
            this.player.pendantSkillLevel,    // 12
            this.player.ring,                 // 13
            this.player.ringEnchantedPoint,   // 14
            this.player.ringSkillKind,        // 15
            this.player.ringSkillLevel,       // 16
            this.player.boots,                // 17
            this.player.bootsEnchantedPoint,  // 18
            this.player.bootsSkillKind,       // 19
            this.player.bootsSkillLevel,      // 20
            this.player.experience,           // 21
            this.player.level,                // 22
            this.player.maxHitPoints,         // 23
            this.player.hitPoints,            // 24
            this.player.admin];
    }
});
Messages.Inventory = Message.extend({
  init: function(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
    this.inventoryNumber = inventoryNumber;
    this.itemKind = itemKind;
    this.itemNumber = itemNumber;
    this.itemSkillKind = itemSkillKind;
    this.itemSkillLevel = itemSkillLevel;
  },
  serialize: function() {
    return [Types.Messages.INVENTORY,
            this.inventoryNumber,
            this.itemKind,
            this.itemNumber,
            this.itemSkillKind,
            this.itemSkillLevel];
  }
});
Messages.Bank = Message.extend({
    init: function(bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        this.bankNumber = bankNumber;
        this.itemKind = itemKind;
        this.itemNumber = itemNumber;
        this.itemSkillKind = itemSkillKind;
        this.itemSkillLevel = itemSkillLevel;
    },
    serialize: function() {
        return [Types.Messages.BANK,
                this.bankNumber,
                this.itemKind,
                this.itemNumber,
                this.itemSkillKind,
                this.itemSkillLevel];
    }
});
Messages.Population = Message.extend({
    init: function (world, total) {
        this.world = world;
        this.total = total;
    },
    serialize: function () {
        return [Types.Messages.POPULATION,
                this.world,
                this.total];
    }
});
Messages.Kill = Message.extend({
    init: function (mob, level, exp) {
        this.mob = mob;
        this.level = level;
        this.exp = exp;
    },
    serialize: function () {
        return [Types.Messages.KILL,
                this.mob.kind,
                this.level,
                this.exp];
    }
});
Messages.List = Message.extend({
    init: function (ids) {
        this.ids = ids;
    },
    serialize: function () {
        var list = this.ids;
        list.unshift(Types.Messages.LIST);
        return list;
    }
});
Messages.Destroy = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.DESTROY,
                this.entity.id];
    }
});
Messages.Blink = Message.extend({
    init: function (item) {
        this.item = item;
    },
    serialize: function () {
        return [Types.Messages.BLINK,
                this.item.id];
    }
});
Messages.PVP = Message.extend({
    init: function(isPVP){
        this.isPVP = isPVP;
    },
    serialize: function(){
        return [Types.Messages.PVP,
                this.isPVP];
    }
});
Messages.TradeErrors = Message.extend({
    init: function(errorType, playerName, otherPlayer) {
        this.errorType = errorType;
        this.playerName = playerName;
        this.otherPlayer = otherPlayer;
    },
    serialize: function() {
        return [Types.Messages.TRADEINVALID, this.errorType, this.playerName, this.otherPlayer];
    }
});
Messages.TradeStates = Message.extend({
    init: function(stateType, playerName, otherPlayer) {
        this.stateType = stateType;
        this.playerName = playerName;
        this.otherPlayer = otherPlayer;
    },
    serialize: function() {
        return [Types.Messages.TRADE, this.stateType, this.playerName, this.otherPlayer];
    }
});
Messages.GuildError = Message.extend({
	init: function (errorType, guildName) {
		this.guildName = guildName;
		this.errorType = errorType;
	},
	serialize: function () {
		return [Types.Messages.GUILDERROR, this.errorType, this.guildName];
	}
});
Messages.Guild = Message.extend({
	init: function (action, info) {
		this.action = action;
		this.info = info;
	},
	serialize: function () {
		return [Types.Messages.GUILD, this.action].concat(this.info);
	}
});
Messages.Mana = Message.extend({
    init: function(player) {
        this.mana = player.mana;
        this.maxMana = player.maxMana;
    },
    serialize: function() {
        return [Types.Messages.MANA, this.mana, this.maxMana];
    }
});
