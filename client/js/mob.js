
define(['character', 'mobdata'], function(Character, MobData) {

    var Mob = Character.extend({
        init: function(id, kind, name) {
            this._super(id, kind);

            this.aggroRange = 1;
            this.isAggressive = true;
            this.moveSpeed = 200;
            this.atkSpeed = 100;
            this.idleSpeed = 150;
            this.xp=0;
            this.level=0;
            
            this.title=name;
        },

        idle: function(orientation) {
            if (MobData.Kinds[this.kind].key === "deathknight" ||
            	MobData.Kinds[this.kind].key === "skeletonking")
            {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
            else
            {
            	    this._super(orientation);
            }
        },
        
        getSpriteName: function() {
                return MobData.Kinds[this.kind].spriteName;
        }        
    });

    return Mob;
});