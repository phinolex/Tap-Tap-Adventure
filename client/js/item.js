/* global Types */

define(['entity'], function(Entity) {

    var Item = Entity.extend({
        init: function(id, kind, type, skillKind, skillLevel) {
    	    this._super(id, kind);

            this.itemKind = Types.getKindAsString(kind);
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
            return "item-"+ this.itemKind;
        },

        getInfoMsg: function(){
            return 'default';
        },
        getInfoMsgEx: function(itemKind, enchantedPoint, skillKind, skillLevel) {
            var msg = '';
            if(Types.isWeapon(itemKind)) {
                msg = Types.getName(itemKind) + ": Attack +" + Types.getWeaponRank(itemKind) + 1;
            }
            switch(itemKind){
                case Types.Entities.FLASK: return Types.getName(itemKind) + ": HP +80";
                case Types.Entities.BURGER: return Types.getName(itemKind) + ": HP +200";
            }
        return '';
    }
  });
  Item.getInfoMsgEx = Item.prototype.getInfoMsgEx;
  return Item;
});