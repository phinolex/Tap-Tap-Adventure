/* global Types */

define(['../character', 'utils/exceptions', './mount'], function(Character, Exceptions, Mount) {

    var Player = Character.extend({

        init: function(id, name, password, kind, game) {
            var self = this;

            self._super(id, kind);

            self.name = name;
            self.password = password;
            self.game = game;

            self.rights = 0; //Client sided rights don't do anything special

            self.spriteName = null;
            self.armorName = null;
            self.weaponName = null;
            self.pendant = null;
            self.ring = null;
            self.boots = null;

            self.initEquipmentStats();

            self.isLootMoving = false;
            self.isSwitchingWeapon = true;

            self.pvpFlag = false;
            self.gameFlag = false;
            self.pvpTeam = -1;

            self.wanted = false;

            self.invincible = false;
            self.isRoyalAzaleaBenef = false;
            self.poisoned = false;

            self.pets = [];

            self.prevX = 0;
            self.prevY = 0;

            self.pClass = 0;
        },

        initEquipmentStats: function() {
            var self = this;

            self.armorEnchantedPoint = 0;
            self.armorSkillKind = 0;
            self.armorSkillLevel = 0;

            self.weaponEnchantedPoint = 0;
            self.weaponSkillKind = 0;
            self.weaponSkillLevel = 0;

            self.pendantEnchantedPoint = 0;
            self.pendantSkillKind = 0;
            self.pendantSkillLevel = 0;

            self.ringEnchantedPoint = 0;
            self.ringSkillKind = 0;
            self.ringSkillLevel = 0;

            self.bootsEnchantedPoint = 0;
            self.bootsSkillKind = 0;
            self.bootsSkillLevel = 0;
        },

        setSkill: function(name, level, index) {
            this.skillHandler.add(name, level, index);
        },

        setBenef: function(itemKind) {
            var self = this;

            switch(itemKind) {
                case 169:
                    self.startInvincibility();
                    break;

                case 213:
                    self.startRoyalAzaleaBenef();
                    break;

                case 20:
                    self.stopInvincibility();
                    break;
            }
        },

        flareDanceAttack: function() {
            var self = this,
                adjacentMobs = [],
                entity, x, y;

            for (x = self.gridX - 1; self.gridX + 2; x++) {
                for (y = self.gridY - 1; y < self.gridY + 2; y++) {
                    entity = self.game.getMobAt(x, y);

                    if (entity)
                        adjacentMobs.push(entity.id);
                }
            }

            if (adjacentMobs.length > 0) {
                for (var i = adjacentMobs.length; i < 4; i++)
                    adjacentMobs.push(0);

                if (adjacentMobs.length > 4)
                    adjacentMobs = adjacentMobs.slice(0, 4);

                self.game.client.sendFlareDance(adjacentMobs);
            }
        },

        setLook: function(name) {
            var self = this;

            self.setSpriteName(name);
            self.setArmorName(name);
        },

        setSpriteName: function(name) {
            var self = this;

            if (!name)
                self.spriteName = 'clotharmor';
            else if (name)
                self.spriteName = name;
            else
                self.spriteName = self.armorName;
        },

        setArmorName: function(armorName) {
            this.armorName = armorName;
        },

        setWeaponName: function(weaponName) {
            this.weaponName = weaponName;
            this.hasArcherWeapon = ItemTypes.isArcherWeapon(ItemTypes.getKindFromString(weaponName));
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

        setClass: function(pClass) {
            var self = this;

            self.pClass = pClass;

            switch (pClass) {
                case Types.PlayerClass.FIGHTER:
                case Types.PlayerClass.DEFENDER:
                    self.setAtkRange(1);
                    break;

                case Types.PlayerClass.ARCHER:
                    self.setAtkRange(4);
                    break;

                case Types.PlayerClass.MAGE:
                    self.setAtkRange(5);
                    break;
            }
        },

        getTeam: function() {
            return this.pvpTeam;
        },

        getSpriteName: function() {
            var self = this;

            if (!self.spriteName)
                self.setSpriteName(null);

            return self.spriteName;
        },

        isMovingToLoot: function() {
            return this.isLootMoving;
        },

        getWeaponName: function() {
            return this.weaponName;
        },

        hasWeapon: function() {
            return this.weaponName !== null;
        },

        switchArmor: function(armor, sprite) {
            var self = this;

            self.setSpriteName(armor);
            self.setSprite(sprite);
            self.setArmorName(armorName);

            if (self.switch_callback)
                self.switch_callback();
        },

        switchWeapon: function(newWeapon) {
            var self = this,
                count = 14,
                value = false;

            var toggle = function() {
                value = !value;
                return value;
            };

            if (newWeapon != self.getWeaponName()) {
                if (self.isSwitchingWeapon)
                    clearInterval(blinking);

                self.isSwitchingWeapon = true;

                var blinking = setInterval(function() {

                    self.setWeaponName(toggle() ? newWeapon : null);

                    count -= 1;

                    if (count == 1) {
                        clearInterval(blinking)

                        self.isSwitchingWeapon = false;

                        if (self.switch_callback)
                            self.switch_callback();
                    }

                }, 90);
            }
        },

        onSwitchWeapon: function(callback) {
            this.switch_callback = callback;
        },

        startRoyalAzaleaBenef: function() {
            var self = this;

            if (!self.isRoyalAzaleaBenef)
                self.isRoyalAzaleaBenef = true;
            else
                if (self.royalAzaleaBenefTimeout)
                    clearTimeout(self.royalAzaleaBenefTimeout);

            self.royalAzaleaBenefTimeout = setTimeout(function() {
                self.stopRoyalAzaleaBenef();
                self.idle();
            }, 15000);
        },

        stopRoyalAzaleaBenef: function() {
            var self = this;

            self.isRoyalAzaleaBenef = false;

            if (self.royalAzaleaBenefTimeout)
                clearTimeout(self.royalAzaleaBenefTimeout);
        },

        flagPVP: function(pvpFlag) {
            this.pvpFlag = pvpFlag;
        },

        flagGame: function(gameFlag) {
            this.gameFlag = gameFlag;
        },

        walk: function(orientation) {
            var self = this;

            self.setOrientation(orientation);
            self.animate('walk', self.walkSpeed);
        },

        idle: function(orientation) {
            var self = this;

            self.setOrientation(orientation);
            self.animate('idle', self.idleSpeed);
        },

        updateMovement: function() {
            this._super();
        },

        removeTarget: function() {
            this._super();
        }
    });

    return Player;
});