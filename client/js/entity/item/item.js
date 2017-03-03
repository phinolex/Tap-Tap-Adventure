/* global Types */

define(['../entity'], function(Entity) {

    var Item = Entity.extend({
        init: function(id, kind, type, skillKind, skillLevel) {
    	    this._super(id, kind);

            this.itemKind = ItemTypes.getKindAsString(kind);
    	    this.type = type;
    	    this.wasDropped = false;
    	    this.skillKind = skillKind;
            this.skillLevel = skillLevel;
    	    this.count = 1;
        },

        hasShadow: function() {
            return true;
        },

        onLoot: function(player) {
            if(this.type === "weapon") {
                player.switchWeapon(this.itemKind);
            } else if(this.type === "armor"){
                if(player.level < 100){
                    player.armorloot_callback(this.itemKind);
                }
            }
        },

        getSpriteName: function() {
             
             if (ItemTypes.KindData[this.kind].spriteName !== "")
             {
             	     //log.info("item-"+ ItemTypes.KindData[this.kind].spriteName);
             	     return "item-"+ ItemTypes.KindData[this.kind].spriteName;
             }
             //log.info("item-"+ this.itemKind);
             return "item-"+ this.itemKind;
        },

        /**
         * TODO: relocate getInfoMsgEx to game and rename the function
         */

        getInfoMsg: function() {
            return this.getInfoMsgEx(this.kind, this.count, this.skillKind, this.skillLevel);
        },

        getInfoMsgEx: function(itemKind, enchantmentPoints, skillKind, skillLevel) {
            var msg = '';

            if (ItemTypes.isEitherWeapon(itemKind)) {
                msg = ItemTypes.getName(itemKind) + ': Level ' + (ItemTypes.getWeaponLevel(itemKind) * 2) + (enchantmentPoints ? ' + ' + enchantmentPoints : '');

                switch (skillKind) {
                    case Types.Skills.BLOODSUCKING:
                    case Types.Skills.CRITICALRATIO:

                        msg += ' ' + Types.getItemSkillNameByKind(skillKind) + ' +' + (skillLevel * 2) + '%';

                        break;
                }
                
                return msg;
                
            } else if (ItemTypes.isEitherArmor(itemKind))
                return ItemTypes.getName(itemKind) + ': Level ' + (ItemTypes.getArmorLevel(itemKind) * 2) + (enchantmentPoints ? ' + ' + enchantmentPoints : '');
            
            return ItemTypes.getName(itemKind);
        }

    });
  Item.getInfoMsgEx = Item.prototype.getInfoMsgEx;
  return Item;
});