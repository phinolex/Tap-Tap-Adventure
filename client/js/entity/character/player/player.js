/* global Types */

define(['../character', 'utils/exceptions', './mount'], function(Character, Exceptions, Mount) {

    var Player = Character.extend({
        MAX_LEVEL: 10,

        init: function(id, name, pw, kind, game) {
            this._super(id, kind);
            this.game = game;
            this.name = name;
            this.pw = pw;

            // Renderer
            this.nameOffsetY = -10;
            this.rights = 0;
            // sprites
            this.spriteName = null;
            this.armorName = null;
            this.weaponName = null;
            this.pendant = null;
            this.ring = null;
            this.boots = null;
            this.armorEnchantedPoint = 0;
            this.armorSkillKind = 0;
            this.armorSkillLevel = 0;
            this.weaponEnchantedPoint = 0;
            this.weaponSkillKind = 0;
            this.weaponSkillLevel = 0;
            this.pendantEnchantedPoint = 0;
            this.pendantSkillKind = 0;
            this.pendantSkillLevel = 0;
            this.ringEnchantedPoint = 0;
            this.ringSkillKind = 0;
            this.ringSkillLevel = 0;

            // modes
            this.isLootMoving = false;
            this.isSwitchingWeapon = true;

            // PVP Flag
            this.pvpFlag = false;
            this.gameFlag = false;
            this.pvpTeam = -1;


            this.isWanted = false;
            // Benef
            this.invincible = false;
            this.isRoyalAzaleaBenef = false;

            this.isWanted = false;

            this.healCooltimeCallback = null;
            this.healCooltimeCounter = 0;

            this.flareDanceCooltimeCallback = null;
            this.flareDanceCooltimeCounter = 0;
            this.flareDanceMsgCooltimeCounter = 0;
            this.poisoned = false;
            this.mount=null;
            this.mountName=null;
            this.mountOffsetY=0;
            this.mountOffsetX=0;
            //this.mount.setPosition(this.gridX, this.gridY);

            this.pets = [];

            this.prevX = 0;
            this.prevY = 0;

            this.pClass = 0;
        },

        /**
         * Returns true if the character is currently walking towards an item in order to loot it.
         */

        setSkill: function(name, level, skillIndex) {
            this.skillHandler.add(name, level, skillIndex);
        },

        setBenef: function(itemKind){
            switch(itemKind){
                case 169:
                    this.startInvincibility();
                    break;
                case 213:
                    this.startRoyalAzaleaBenef();
                    break;
                case 20:
                    this.stopInvincibility();
                    break;
            }
        },
        setConsumable: function(itemKind) {

            this.game.sendGUIMessage("This feature has been disabled.");
            /*switch (itemKind) {
                case 450:
                    this.startMount("seadragon", 0, -42, 45000);
                    break;
                case 451:
                    this.startMount("whitetiger", 0, -75, 45000);
                    break;
                case 452:
                    this.startMount("forestdragon", -25, -50, 45000);
                    break;
            }*/
        },

        flareDanceAttack: function(){
            var adjacentMobIds = [];
            var entity = null;
            var x = this.gridX-1;
            var y = this.gridY-1;
            for(x = this.gridX-1; x < this.gridX+2; x++){
                for(y = this.gridY-1; y < this.gridY+2; y++){
                    entity = this.game.getMobAt(x, y);
                    if(entity){
                        adjacentMobIds.push(entity.id);
                    }
                }
            }
            if(adjacentMobIds.length > 0){
                var i = 4;
                for(i = adjacentMobIds.length; i < 4; i++){
                    adjacentMobIds.push(0);
                }
                if(adjacentMobIds.length > 4){
                    adjacentMobIds = adjacentMobIds.slice(0,4);
                }
                this.game.client.sendFlareDance(adjacentMobIds);
            }
        },
        isMovingToLoot: function() {
            return this.isLootMoving;
        },

        getSpriteName: function() {
            if (!this.spriteName)
            {
                setSpriteName(null);
            }
            return this.spriteName;
        },
        setSpriteName: function(name) {
            if (!name) {
                this.spriteName = "clotharmor";
            } else if(name){
                this.spriteName = name;
            } else {
                this.spriteName = this.armorName;
            }
        },
        getArmorName: function() {
            return this.armorName;
        },
        getArmorSprite: function() {
            return this.sprite;
        },
        setArmorName: function(name){
            this.armorName = name;
        },
        getWeaponName: function() {
            return this.weaponName;
        },
        setWeaponName: function(name) {
            this.weaponName = name;
            
            var isArcherWeapon = ItemTypes.isArcherWeapon(ItemTypes.getKindFromString(name));
            
            this.hasArcherWeapon = isArcherWeapon;
        },
        hasWeapon: function() {
            return this.weaponName !== null;
        },
        
        switchArmor: function(armorName, sprite){
            this.setSpriteName(armorName);
            this.setSprite(sprite);
            this.setArmorName(armorName);
            if(this.switch_callback) {
                this.switch_callback();
            }
        },
        switchWeapon: function(newWeaponName) {
            var count = 14,
                value = false,
                self = this;

            var toggle = function() {
                value = !value;
                return value;
            };

            if(newWeaponName !== this.getWeaponName()) {
                if(this.isSwitchingWeapon) {
                    clearInterval(blanking);
                }

                this.switchingWeapon = true;
                var blanking = setInterval(function() {
                    if(toggle()) {
                        self.setWeaponName(newWeaponName);
                    } else {
                        self.setWeaponName(null);
                    }

                    count -= 1;
                    if(count === 1) {
                        clearInterval(blanking);
                        self.switchingWeapon = false;

                        if(self.switch_callback) {
                            self.switch_callback();
                        }
                    }
                }, 90);
            }
        },
        onArmorLoot: function(callback) {
            this.armorloot_callback = callback;
        },

        startRoyalAzaleaBenef: function() {
            var self = this;

            if(!this.isRoyalAzaleaBenef) {
                this.isRoyalAzaleaBenef = true;
            } else {
                if(this.royalAzaleaBenefTimeout) {
                    clearTimeout(this.royalAzaleaBenefTimeout);
                }
            }
            this.royalAzaleaBenefTimeout = setTimeout(function() {
                self.stopRoyalAzaleaBenef();
                self.idle();
            }, 15000);
        },
        stopRoyalAzaleaBenef: function(){
            this.isRoyalAzaleaBenef = false;

            if(this.royalAzaleaBenefTimeout) {
                clearTimeout(this.royalAzaleaBenefTimeout);
            }
        },
        flagPVP: function(pvpFlag){
            this.pvpFlag = pvpFlag;
        },

        flagGame: function(gameFlag) {
            this.gameFlag = gameFlag;
        },

        walk: function(orientation) {
            this.setOrientation(orientation);
            if (this.mount) {
                this.mount.walk(orientation);
                this.animate("idle", this.idleSpeed);
            }
            else {
                this.animate("walk", this.walkSpeed);
            }
        },

        idle: function(orientation) {
            this.setOrientation(orientation);
            if (this.mount) {
                this.mount.idle(orientation);
            }
            else {
                this.animate("idle", this.idleSpeed);
            }
        },

        updateMovement: function() {
            if (this.mount) {
                this.mount.walk(this.orientation);
            }
            this._super();
        },

        // Mount Code.
        startMount: function(mountName, mountOffsetX, mountOffsetY, time) {
            var self = this;

            if(this.mount) {
                this.destroyMount();
                this.createMount(mountName, mountOffsetX, mountOffsetY);
            } else {
                this.createMount(mountName, mountOffsetX, mountOffsetY);
                this.mountTimeout = setTimeout(function() {
                    self.stopMount();
                    self.idle();
                }, time);
            }
        },

        stopMount: function() {
            if(this.mountTimeout) {
                this.destroyMount();
                clearTimeout(this.mountTimeout);
            }
        },

        createMount: function (mountName, mountOffsetX, mountOffsetY) {
            this.mountName=mountName;
            this.mountOffsetX=mountOffsetX;
            this.mountOffsetY=mountOffsetY;
            this.mount = new Mount(this.game, this, mountName, this.walkSpeed, this.idleSpeed);
            this.moveSpeed = 60;
            this.mount.setOrientation(this.orientation);
        },

        destroyMount: function () {
            this.moveSpeed = 120;
            delete this.mount;
        },

        removeTarget: function () {
            if (this.pets) {
                for (var i=0; i < this.pets.length; ++i)
                    this.pets[i].target = null;
            }
            this._super();
        },

        setClass: function (pClass) {
            this.pClass = pClass;
            if (pClass == Types.PlayerClass.WARRIOR)
            {
                this.setAtkRange(1);
            }
            else if (pClass == Types.PlayerClass.DEFENDER)
            {
                this.setAtkRange(1);
            }
            else if (pClass == Types.PlayerClass.ARCHER)
            {
                this.setAtkRange(4);
            }
        },

        setPendant: function(name) {
            this.pendant = name;
        },

        setRing: function(name) {
            this.ring = name;
        },

        setBoots: function(name) {
            this.boots = name;
        },

        setTeam: function(team) {
            this.pvpTeam = team;
        },

        getTeam: function() {
            return this.pvpTeam;
        }


    });

    return Player;
});