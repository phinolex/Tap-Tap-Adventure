define(['./incoming'], function(Incoming) {
    
    var PacketHandler = Class.extend({
        init: function() {
            var self = this;
            
            self.handlers = [];
            self.incoming = new Incoming(self);
            self.handlers[Types.Messages.WELCOME] = self.receiveWelcome;
            self.handlers[Types.Messages.MOVE] = self.receiveMove;
            self.handlers[Types.Messages.LOOTMOVE] = self.receiveLootMove;
            self.handlers[Types.Messages.ATTACK] = self.receiveAttack;
            self.handlers[Types.Messages.SPAWN] = self.receiveSpawn;
            self.handlers[Types.Messages.DESPAWN] = self.receiveDespawn;
            self.handlers[Types.Messages.HEALTH] = self.receiveHealth;
            self.handlers[Types.Messages.CHAT] = self.receiveChat;
            self.handlers[Types.Messages.EQUIP] = self.receiveEquipItem;
            self.handlers[Types.Messages.DROP] = self.receiveDrop;
            self.handlers[Types.Messages.TELEPORT] = self.receiveTeleport;
            self.handlers[Types.Messages.DAMAGE] = self.receiveDamage;
            self.handlers[Types.Messages.POPULATION] = self.receivePopulation;
            self.handlers[Types.Messages.LIST] = self.receiveList;
            self.handlers[Types.Messages.DESTROY] = self.receiveDestroy;
            self.handlers[Types.Messages.KILL] = self.receiveKill;
            self.handlers[Types.Messages.PP] = self.receivePoints;
            self.handlers[Types.Messages.BLINK] = self.receiveBlink;
            self.handlers[Types.Messages.PVP] = self.receivePVP;
            self.handlers[Types.Messages.BOARD] = self.receiveBoard;
            self.handlers[Types.Messages.NOTIFY] = self.receiveNotify;
            self.handlers[Types.Messages.KUNG] = self.receiveKung;
            self.handlers[Types.Messages.MANA] = self.receiveMana;
            self.handlers[Types.Messages.ACHIEVEMENT] = self.receiveAchievement;
            self.handlers[Types.Messages.PARTY] = self.receiveParty;
            self.handlers[Types.Messages.TALKTONPC] = self.receiveTalkToNPC;
            self.handlers[Types.Messages.RANKING] = self.receiveRanking;
            self.handlers[Types.Messages.INVENTORY] = self.receiveInventory;
            self.handlers[Types.Messages.DOUBLE_EXP] = self.receiveDoubleEXP;
            self.handlers[Types.Messages.EXP_MULTIPLIER] = self.receiveEXPMultiplier;
            self.handlers[Types.Messages.MEMBERSHIP] = self.receiveMembership;
            self.handlers[Types.Messages.SKILL] = self.receiveSkill;
            self.handlers[Types.Messages.SKILLINSTALL] = self.receiveSkillInstall;
            self.handlers[Types.Messages.SKILLLOAD] = self.receiveSkillLoad;
            self.handlers[Types.Messages.CHARACTERINFO] = self.receiveCharacterInfo;
            self.handlers[Types.Messages.SHOP] = self.receiveShop;
            self.handlers[Types.Messages.WANTED] = self.receiveWanted;
            self.handlers[Types.Messages.BANK] = self.receiveBank;
            self.handlers[Types.Messages.PARTYINVITE] = self.receivePartyInvite;
            self.handlers[Types.Messages.AUCTIONOPEN] = self.receiveAuction;
            self.handlers[Types.Messages.CLASSSWITCH] = self.receiveClassSwitch;
            self.handlers[Types.Messages.CHARDATA] = self.receiveData;
            self.handlers[Types.Messages.POISON] = self.receivePoison;
            self.handlers[Types.Messages.INTERFACE] = self.receiveInterface;
            self.handlers[Types.Messages.GUINOTIFY] = self.receiveGraphicNotification;
            self.handlers[Types.Messages.FORCECAST] = self.receiveForceCast;
            self.handlers[Types.Messages.PROJECTILE] = self.receiveProjectile;
            self.handlers[Types.Messages.GAMEFLAG] = self.receiveGameFlag;
            self.handlers[Types.Messages.DOOR] = self.receiveDoor;
            self.handlers[Types.Messages.GAMEDATA] = self.receiveMinigameData;
            self.handlers[Types.Messages.TEAM] = self.receiveTeam;
            self.handlers[Types.Messages.STOP] = self.receiveStop;
            self.handlers[Types.Messages.SENDAD] = self.receiveAd;
            self.handlers[Types.Messages.CENTERCAMERA] = self.receiveCamera;
            self.handlers[Types.Messages.SHOWINSTURCTIONS] = self.receiveInstructions;
            self.handlers[Types.Messages.SHOWINAPPSTORE] = self.receiveInAppStore;
            self.handlers[Types.Messages.PURCHASE] = self.receivePurchase;
            self.handlers[Types.Messages.PLAYERSTATE] = self.receivePlayerState;
            self.handlers[Types.Messages.GLOBALCHAT] = self.receiveGlobalChat;
            self.handlers[Types.Messages.TRADE] = self.receiveTrade;
        },
        
        call: function(handler, data) {
            var self = this;
            
            self.handlers[handler].call(self, data);
        }
    });
    
});