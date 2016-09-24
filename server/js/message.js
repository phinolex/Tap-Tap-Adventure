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
        //log.info("move sent");
        return [Types.Messages.MOVE,
            this.entity.id,
            this.entity.x,
            this.entity.y];
    }
});

Messages.Move2 = Message.extend({
    init: function (entityId, x, y) {
        this.entityId = entityId;
        this.x = x;
        this.y = y;
    },
    serialize: function () {
        //log.info("move sent");
        return [Types.Messages.MOVE,
            this.entityId,
            this.x,
            this.y];
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
    init: function (points, isRegen, isPoison) {
        this.points = points;
        this.isRegen = isRegen;
        this.isPoison = isPoison;
    },
    serialize: function() {
        return [Types.Messages.HEALTH, this.points, this.isRegen, this.isPoison];
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
Messages.PlayerPoints = Message.extend({
    init: function(maxHitPoints, maxMana, hp, mp) {
        this.maxHitPoints = maxHitPoints;
        this.maxMana = maxMana;
        this.hitPoints = hp;
        this.mana = mp
    },
    serialize: function() {
        return [Types.Messages.PP,
            this.maxHitPoints,
            this.maxMana,
            this.hitPoints,
            this.mana];
    }
});
Messages.TalkToNPC = Message.extend({
    init: function(npcId, achievementNumber, isCompleted){
        this.npcId = npcId;
        this.achievementNumber = achievementNumber;
        this.isCompleted = isCompleted;
    },
    serialize: function(){
        return [Types.Messages.TALKTONPC,
            this.npcId,
            this.achievementNumber,
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
        this.name = name
    },
    serialize: function() {
        return [Types.Messages.SKILLINSTALL, this.index, this.name];
    }
});
Messages.SkillLoad = Message.extend({
    init: function(index, id, level) {
        this.index = index;
        this.id = id;
        this.level = level;
    },
    serialize: function() {
        return [Types.Messages.SKILLLOAD,
            this.index,
            this.id,
            this.level];
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
            this.player.weapon,               // 3
            this.player.weaponEnchantedPoint, // 4
            this.player.weaponSkillKind,      // 5
            this.player.weaponSkillLevel,     // 6
            this.player.experience,           // 7
            this.player.level,                // 8
            this.player.maxHitPoints,         // 9
            this.player.hitPoints,            // 10
            this.player.admin,                // 11
            this.player.pClass];              // 12
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
            this.mob.id,
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
        //log.info(JSON.stringify(list));
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

Messages.Mana = Message.extend({
    init: function(player) {
        this.mana = player.mana;
        this.maxMana = player.maxMana;
    },
    serialize: function() {
        return [Types.Messages.MANA, this.mana, this.maxMana];
    }
});

Messages.Countdown = Message.extend({
    init: function(time) {
        this.time = time;
    },
    serialize: function() {
        return [Types.Messages.COUNTDOWN, this.time];
    }

});

Messages.PartyInvite = Message.extend({
    init: function(id) {
        this.id = id;
    },
    serialize: function() {
        return [Types.Messages.PARTYINVITE, this.id];
    }
});

Messages.Party = Message.extend({
    init: function (members) {
        this.members = members;
        //this.members.unshift(Types.Messages.PARTY);
    },
    serialize: function () {
        //var list = this.members;
        //list.unshift(Types.Messages.PARTY);
        return this.members;
    }
});

Messages.AuctionOpen = Message.extend({
    init: function (itemData) {
        this.itemData = itemData;
    },
    serialize: function () {
        //var list = this.members;
        //list.unshift(Types.Messages.AUCTIONOPEN);
        return this.itemData;
    }
});

Messages.SwitchClass = Message.extend({
    init: function (pClass) {
        this.pClass = pClass;
    },
    serialize: function () {
        return [Types.Messages.CLASSSWITCH, this.pClass];
    }
});

Message.MinigameState = Message.extend({
    init: function(state) {
        this.state = state;
    },

    serialize: function() {
        return [Types.Messages.MINIGAMESTATE, this.state];
    }
});

Messages.MinigameTime = Message.extend({
    init: function(time) {
        this.time = time;
    },
    serialize: function() {
        return [Types.Messages.TIME, this.time];
    }
});

Messages.MinigameTeam = Message.extend({
    init: function(team) {
        this.team = team;
    },
    serialize: function() {
        return [Types.Messages.TEAM, this.team];
    }
});

Messages.TimeOfDay = Message.extend({
    init: function (isDay) {
        this.isDay = isDay;
    },
    serialize: function() {
        return [Types.Messages.TOD, this.isDay];
    }
});

Messages.RequestPos = Message.extend({
    init: function(data) {
        this.data = data;
    },
    serialize: function() {
        var id = data[0];
        return [Types.Messages.REQUESTPOS, id];
    }
});


Messages.Update = Message.extend({
    init: function(player) {
        this.player = player;
    },

    serialize: function() {
        var id = this.player.id,
            x = this.player.x,
            y = this.player.y;

        return [Types.Messages.UPDATE, id, x, y];
    }
});

Messages.Poison = Message.extend({
    init: function(isOn) {
        this.isOn = isOn;
    },

    serialize: function() {
        return [Types.Messages.POISON, this.isOn];
    }
});

Messages.CharData = Message.extend({
    init: function(data) {
        this.data = data;
    },
    serialize: function() {
        var attackSpeed = this.data[0],
            moveSpeed = this.data[1],
            walkSpeed = this.data[2],
            idleSpeed = this.data[3],
            attackRate = this.data[4];

        return [Types.Messages.CHARDATA, attackSpeed, moveSpeed, walkSpeed, idleSpeed, attackRate];
    }
});