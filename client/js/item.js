/* global Types */

define(['entity'], function(Entity) {

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
        

        getInfoMsg: function(){
            
            return this.getInfoMsgEx(this.kind, this.count, this.skillKind, this.skillLevel);
        },
        getInfoMsgEx: function(itemKind, enchantedPoint, skillKind, skillLevel) {
            var msg = '';
            if(ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)){
                msg = ItemTypes.getName(itemKind) + ": Lv " + (ItemTypes.getWeaponLevel(itemKind)*2) + (enchantedPoint ? "+" + enchantedPoint + " " : "");
                if(skillKind === Types.Skills.BLOODSUCKING) {
                    msg += " " + Types.getItemSkillNameByKind(skillKind) + " " + "+" + skillLevel*2 + "%";
                } else if(skillKind === Types.Skills.CRITICALRATIO) {
                    msg += " " + Types.getItemSkillNameByKind(skillKind) + " " + "+" + skillLevel + "%";
                }
                return msg;
            } else if(ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)){
                return ItemTypes.getName(itemKind) + ": Lv " + (ItemTypes.getArmorLevel(itemKind)*2) + (enchantedPoint ? "+" + enchantedPoint : "");
            }
            var name = ItemTypes.getName(itemKind);
            return (name) ? name : '';
        }
    });
  Item.getInfoMsgEx = Item.prototype.getInfoMsgEx;
  return Item;
});