/* global bootKind, _, exports, module, Types */

Types = {
    Achievement: {
        TOTAL_ACHIEVEMENT_NUMBER: 35
    },
    Messages: {
        CREATE: 0,
        LOGIN: 1,
        WELCOME: 2,
        SPAWN: 3,
        DESPAWN: 4,
        MOVE: 5,
        LOOTMOVE: 6,
        AGGRO: 7,
        ATTACK: 8,
        HIT: 9,
        HURT: 10,
        HEALTH: 11,
        CHAT: 12,
        LOOT: 13,
        EQUIP: 14,
        DROP: 15,
        TELEPORT: 16,
        DAMAGE: 17,
        POPULATION: 18,
        KILL: 19,
        LIST: 20,
        WHO: 21,
        ZONE: 22,
        DESTROY: 23,
        PP: 24,
        BLINK: 25,
        OPEN: 26,
        CHECK: 27,
        PVP: 28,
        BOARD: 29,
        BOARDWRITE: 30,
        NOTIFY: 31,
        KUNG: 32,
        ACHIEVEMENT: 33,
        TALKTONPC: 34,
        MAGIC: 36,
        MANA: 37,
        RANKING: 38,
        INVENTORY: 39,
        SKILL: 40,
        SKILLINSTALL: 41,
        SKILLLOAD: 71,
        DOUBLE_EXP: 42,
        EXP_MULTIPLIER: 43,
        MEMBERSHIP: 44,
        FRIENDS: 45,
        IGNORES: 46,
        LOBBY: 47,
        TRADE: 48,
        CHARACTERINFO: 51,
        FLAREDANCE: 52,
        SELL: 53,
        SHOP: 54,
        BUY: 55,
        STOREOPEN: 56,
        STORESELL: 57,
        STOREBUY: 58,
        WANTED: 59,
        GUILD: 60,
        GUILDERROR: 61,
        GUILDERRORTYPE: {
            DOESNOTEXIST: 1,
            BADNAME: 2,
            ALREADYEXISTS: 3,
            NOLEAVE: 4,
            BADINVITE: 5,
            GUILDRULES: 6,
            IDWARNING: 7
        },
        GUILDACTION: {
            CONNECT: 8,
            ONLINE: 9,
            DISCONNECT: 10,
            INVITE: 11,
            LEAVE: 12,
            CREATE: 13,
            TALK: 14,
            JOIN: 15,
            POPULATION: 16
        },
        BANK: 62,
        KBVE: 63,
        GUILDWAR: 64,
        GUILDWARTYPES: {
            JOIN: 1,
            STARTED: 2,
            FULL: 3,
            INVALID: 4,
            ONGOING: 5,
            WAITING: 6
        },
        COUNTDOWN: 65,
        CLIENTFOCUS: 66,
        MOVEENTITY: 67,
        STOREENCHANT: 68,
        BANKSTORE: 69,
        BANKRETRIEVE: 70,
        NEWPASSWORD: 72,
        ADDSPAWN: 80,
        SAVESPAWNS: 81,
        PARTYINVITE: 90,
        PARTYLEAVE: 91,
        PARTYLEADER: 92,
        PARTYKICK: 93,
        PARTY: 94,
        MOVEENTITY2: 95,
        PETCREATE: 96,
        AUCTIONSELL: 97,
        AUCTIONBUY: 98,
        AUCTIONOPEN: 99,
        AUCTIONDELETE: 100,
        CLASSSWITCH: 101,
        GATHER: 102,
        CRAFT: 103,
        FAILEDATTEMPTS: 104,
        TIME: 105,
        SENDTELE: 106,
        TOD: 107,
        JSONUPDATE: 108,
        STEP: 109,
        CHARDATA: 110,
        DEATH: 111,
        PVPGAME: 112,
        UPDATE: 113,
        REQUESTPOS: 114,
        REQUESTWARP: 115,
        POISON: 116,
        REDTEAM: 117,
        BLUETEAM: 118,
        TEAM: 119,
        MINIGAMESTATE: 120,
        INGAME: 121,
        INLOBBY: 122,
        BANKREQUEST: 123,
        STOREREQUEST: 124,
        ENCHANTMENTREQUEST: 125,
        AUCTIONREQUEST: 126,
        CLASSREQUEST: 127,
        CRAFTINGREQUEST: 128,
        INTERFACE: 129,
        PLAYERREADY: 130,
        GUINOTIFY: 131,
        CAST: 132,
        SPELL: 133,
        FORCECAST: 134,
        PROJECTILE: 135,
        SPELLHIT: 136,
        DOOR: 137,
        GAMEFLAG: 138,
        GAMEDATA: 139,
        RESPAWN: 140,
        STOP: 141,
        DOORREQUEST: 142,
        DETERMINEHIT: 143,
        SENDAD: 144,
        CENTERCAMERA: 145,
        SHOWINSTURCTIONS: 146,
        SHOWINAPPSTORE: 147,
        PURCHASE: 148,
        PLAYERSTATE: 149,
        GLOBALCHAT: 150,
        POINTER: 151
    },

    Interfaces: {
        AUCTION: 1,
        BANK: 2,
        CLASS: 3,
        CRAFTING: 4,
        ENCHANTMENT: 5,
        STORE: 6,
        NOTIFY: 7
    },

    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    },

    Keys: {
        ENTER: 13,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32,
        I: 73,
        H: 72,
        M: 77,
        P: 80,
        KEYPAD_4: 100,
        KEYPAD_6: 102,
        KEYPAD_8: 104,
        KEYPAD_2: 98
    },

    Skills: {
        BLOODSUCKING: 1,
        RECOVERHEALTH: 2,
        HEALANDHEAL: 3,
        AVOIDATTACK: 4,
        ADDEXPERIENCE: 5,
        ATTACKWITHBLOOD: 6,
        CRITICALATTACK: 7,
        CRITICALRATIO: 8
    },

    PlayerClass: {
        FIGHTER: 0,
        ARCHER: 1,
        DEFENDER: 2,
        MAGE: 3
    },

    ActiveSkill: {
        POWERGAIN: 1,
        BERSERKER: 2,
        WHIRLWINDATTACK: 3,
        DEADLYATTACK: 4,
        CONCUSSION: 5,
        EVASION: 6,
        RUN: 7
    },

    Projectiles: {
        FIREBALL: 1,
        ICEBALL: 2,
        PINEARROW: 3,
        TORNADO: 4,
        TERROR: 5,
        LAVABALL: 101,
        DRAGONBALL: 102,
        BOULDER: 103,
        HEALBALL: 201
    },

    MinigameResult: {
        REDWIN: 1,
        BLUEWIN: 2,
        DRAW: 3,
        UNKNOWN: 4
    },

    InAppStore: {
        REMOVEADS: 1,
        ENABLESKINSLOT: 2,
        REGENBOOST: 3,
        DROPRATEENHANCER: 4,
        NAMECHANGE: 5
    },

    TradeStates: {
        STARTED: 1,
        ITEMCHANGE: 2,
        FIRSTACCEPT: 3,
        SECONDACCEPT: 4,
        FINISHED: 5
    }
};


Types.expForLevel = [];
Types.expForLevel[0] = 0;

for (var i = 1; i < 200; i++) {
    var points = Math.floor((1/4) * Math.floor(i + 300 * Math.pow(2, i / 7)));
    Types.expForLevel[i] = points + Types.expForLevel[i - 1];
}

Types.getLevel = function(exp){
    if (exp == 0)
        return 1;

    for(var i = 1; i < 150; i++){
        if(exp < Types.expForLevel[i])
            return i;

    }
    return 150;
};


Types.isPlayer = function(kind) {
    return kind === 1 || kind === 222;
};

Types.getOrientationAsString = function(orientation) {
    switch(orientation) {
        case Types.Orientations.LEFT: return "left"; break;
        case Types.Orientations.RIGHT: return "right"; break;
        case Types.Orientations.UP: return "up"; break;
        case Types.Orientations.DOWN: return "down"; break;
    }
};

Types.getMessageTypeAsString = function(type) {
    var typeName;
    _.each(Types.Messages, function(value, name) {
        if(value === type) {
            typeName = name;
        }
    });
    if(!typeName) {
        typeName = "UNKNOWN";
    }
    return typeName;
};


Types.Player = {};
Types.Player.Skills = {
    evasion: [1, '회피', 'Evasion'],
    bloodSucking: [1, '흡혈', 'Bloodsucking'],
    criticalStrike: [1, '크리티컬 스트라이크', 'Critical Strike'],
    heal: [2, '힐링', 'Heal'],
    flareDance: [2, '불꽃의 춤', 'Flare Dance'],
    stun: [2, '스턴', 'Stun'],
    superCat: [2, '슈퍼캣', 'Super Cat'],
    provocation: [2, '도발', 'Provocation'],

    isExists: function(name) {

        return name in Types.Player.Skills;
    },
    getKind: function(name) {

        return Types.Player.Skills.isExists(name) ? Types.Player.Skills[name][0] : 0;
    },
    getComment: function(name) {
        if(Types.Player.Skills.isExists(name)){

            return Types.Player.Skills[name][2];

        } else {

            return '';
        }
    }
};

var itemSkillName = {
    bloodsucking: [Types.Skills.BLOODSUCKING, "Bloodsucking"],
    recoverhealth: [Types.Skills.RECOVERHEALTH, "RecoverHealth"],
    healandheal: [Types.Skills.HEALANDHEAL, "HealAndHeal"],
    avoidattack: [Types.Skills.AVOIDATTACK, "AvoidAttack"],
    addexperience: [Types.Skills.ADDEXPERIENCE, "AddExperience"],
    attackwithblood: [Types.Skills.ATTACKWITHBLOOD, "AttackWithBlood"],
    criticalattack: [Types.Skills.CRITICALATTACK, "CriticalAttack"],
    criticalratio: [Types.Skills.CRITICALRATIO, "CriticalRatio"]
};

Types.getItemSkillNameByKind = function(kind){
    for(var k in itemSkillName) {
        if(itemSkillName[k][0] === kind) {

            return itemSkillName[k][1];
        }
    }
    return 'NoSkill';
};

var AchievementData = {};
Types.AchievementData = AchievementData;

Types.setAchievementData = function(achievementData) {
    AchievementData = achievementData;
    Types.AchievementData = achievementData;
};


Types.isAchievementNPC = function(kind) {
    for (var index in AchievementData)
        if (AchievementData[index].npcId == kind)
            return true;

    return false;
};

Types.getAchievementByNPCKind = function(kind) {
    for (var index in AchievementData) {
        if (AchievementData[index].npcId == kind)
            return AchievementData[index];
    }

    return null;
};

Types.getAchievementIndex = function(achievement) {
    for (var index in AchievementData) {
        if (AchievementData[index] == achievement)
            return index;
    }

    return -1;
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
