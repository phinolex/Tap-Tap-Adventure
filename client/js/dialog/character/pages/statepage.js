/**
 * Created by flavius on 2017-02-24.
 */
define(['../../../tabpage', '../../../item'], function(TabPage, Item) {
    
    var StatePage = TabPage.extend({

        /**
         * The old state page required the server to send all the information
         * about the player. Instead we will use all the information stored
         * directly in the client to just avoid any random issues in the future.
         */

        init: function(frame) {
            var self = this;

            self._super('#characterDialogFrameStatePage');
            self.frame = frame;
            self.game = self.frame.game;
            self.scale = self.frame.getScale();
        },

        /**
         * Here we load the initial batch of data.
         */

        load: function() {
            var self = this;

            self.player = self.game.player;

            self.closeDialogs();
            self.updateScale();

            self.setItemWeapon(self.player.weaponName ? self.player.weaponName : 'undefined');
            self.setItemArmor(self.player.spriteName);
            self.setItemPendant(self.player.pendant ? self.player.pendant : 'undefined');
            self.setItemRing(self.player.ring ? self.player.ring : 'undefined');
            self.setPlayerInfo();

            //We need sprites....

            var weapon = self.game.sprites[self.player.weaponName],
                armor = self.game.sprites[self.player.spriteName],
                weaponWidth = weapon ? weapon.width * self.scale : 0,
                weaponHeight = weapon ? weapon.height * self.scale : 0,
                armorWidth = armor.width * self.scale,
                armorHeight = armor.height * self.scale,
                maxWidth = Math.max(weaponWidth, armorWidth),
                maxHeight = Math.max(weaponHeight, armorHeight);


            self.setCharacterLook(maxWidth, maxHeight, armorWidth, armorHeight, weaponWidth, weaponHeight);

        },

        setPlayerInfo: function() {
            var self = this;

            $('#characterName').text(self.player.name);
            $('#characterLevel').text(self.player.level);
            $('#characterExp').text(self.player.experience);
        },

        setCharacterLook: function(maxWidth, maxHeight, armorWidth, armorHeight, weaponWidth, weaponHeight) {
            var self = this,
                characterLook = $('#characterLook'),
                characterLookShadow = $('#characterLookShadow'),
                characterLookArmor = $('#characterLookArmor'),
                characterLookWeapon = $('#characterLookWeapon');

            characterLook.css('left', '' + ((63 * self.scale) - parseInt(maxWidth / 2)) + 'px');
            characterLook.css('top', '' + ((150 * self.scale) - maxHeight) + 'px');
            characterLook.css('width', '' + maxWidth + 'px');
            characterLook.css('height', '' + maxHeight + 'px');

            characterLookShadow.css('left', '' + parseInt(((maxWidth - armorWidth) / 2) + ((armorWidth - (16 * self.scale)) / 2)) + 'px');
            characterLookShadow.css('top', '' + parseInt(((maxHeight - armorHeight) / 2) + (armorHeight - (19 * self.scale))) + 'px');

            characterLookArmor.css('left', '' + parseInt((maxWidth - armorWidth) / 2) + 'px');
            characterLookArmor.css('top', '' + parseInt((maxHeight - armorHeight) / 2) + 'px');
            characterLookArmor.css('width', '' + armorWidth + 'px');
            characterLookArmor.css('height', '' + armorHeight + 'px');
            characterLookArmor.css('background-size', '' + (armorWidth * 5) + 'px');
            characterLookArmor.css('background-position', '0px -' + (armorHeight * 8) + 'px');

            characterLookWeapon.css('left', '' + parseInt((maxWidth - weaponWidth) / 2) + 'px');
            characterLookWeapon.css('top', '' + parseInt((maxHeight - weaponHeight) / 2) + 'px');
            characterLookWeapon.css('width', '' + weaponWidth + 'px');
            characterLookWeapon.css('height', '' + weaponHeight + 'px');
            characterLookWeapon.css('background-size', '' + (weaponWidth * 5) + 'px');
            characterLookWeapon.css('background-position', '0px -' + (weaponHeight * 8) + 'px');

            characterLookArmor.css('background-image', 'url("img/' + self.scale + '/' + self.player.spriteName + '.png")');
            characterLookWeapon.css('background-image', 'url("img/' + self.scale + '/' + self.player.weaponName + '.png")');

        },

        setItemWeapon: function(weapon) {
            var self = this,
                characterItemWeapon = $('#characterItemWeapon');

            characterItemWeapon.css('background-image', 'url("img/' + self.scale + '/item-' + weapon + '.png")');
            characterItemWeapon.attr('title', Item.getInfoMsgEx(weapon, self.player.weaponEnchantedPoint, self.player.weaponSkillKind, self.player.weaponSkillLevel));
        },

        setItemArmor: function(armor) {
            var self = this,
                characterItemArmor = $('#characterItemArmor');

            characterItemArmor.css('background-image', 'url("img/' + self.scale + '/item-' + armor + '.png")');
            characterItemArmor.attr('title', Item.getInfoMsgEx(armor, self.player.armorEnchantedPoint, self.player.armorSkillKind, self.player.armorSkillLevel));
        },

        setItemPendant: function(pendant) {
            var self = this,
                characterItemPendant = $('#characterItemPendant');

            characterItemPendant.css('background-image', 'url("img/' + self.scale + '/item-' + pendant + '.png")');
            characterItemPendant.attr('title', Item.getInfoMsgEx(pendant, self.game.player.pendantEnchantedPoint, self.game.player.pendantSkillKind, self.game.player.pendantSkillLevel));
        },

        setItemRing: function(ring) {
            var self = this,
                characterItemRing = $('#characterItemRing');

            characterItemRing.css('background-image', 'url("img/' + self.scale + '/item-' + ring + '.png")');
            characterItemRing.attr('title', Item.getInfoMsgEx(ring, self.game.player.pendantEnchantedPoint, self.game.player.pendantSkillKind, self.game.player.pendantSkillLevel));
        },

        updateScale: function() {
            /**
             * Just in case the client is resized in the meantime.
             */

            this.scale = this.frame.getScale();
        },

        closeDialogs: function() {
            var self = this;

            for (var i = 0; i < self.game.dialogs.length; i++)
                if (self.game.dialogs[i] != self && self.game.dialogs[i].visible)
                    self.game.dialogs[i].hide();
        }
    });

    return StatePage;
});