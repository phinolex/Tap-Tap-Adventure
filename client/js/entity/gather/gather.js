
define(['../entity', '../../data/gatherdata'], function(Entity, GatherData) {

    var Gather = Entity.extend({
        init: function(id, kind) {
            this._super(id, kind);
        },

        getSpriteName: function() {
        	log.info("sprite="+GatherData.Kinds[this.kind].sprite);
            return GatherData.Kinds[this.kind].sprite;
        },
        
        setOrientation: function(orientation) {
            if(orientation) {
                this.orientation = orientation;
            }
        },

        idle: function(orientation) {
            this.setOrientation(orientation);
            this.animate("idle", this.idleSpeed);
        },
        
        animate: function(animation, speed, count, onEndCount) {
            var oriented = ['idle'],
                o = this.orientation;

            if(!(this.currentAnimation && this.currentAnimation.name === "death")) { // don't change animation if the character is dying
                this.flipSpriteX = false;
                this.flipSpriteY = false;

                if(_.indexOf(oriented, animation) >= 0) {
                    animation += "_down";
                    //animation += "_" + (o === Types.Orientations.LEFT ? "right" : Types.getOrientationAsString(o));
                    this.flipSpriteX = (this.orientation === Types.Orientations.LEFT) ? true : false;
                }

                this.setAnimation(animation, speed, count, onEndCount);
            }
        },


        onDeath: function(callback) {
            this.death_callback = callback;
        },

        die: function() {
            this.isDead = true;

            if(this.death_callback) {
                this.death_callback();
            }
        },
        
    });

    return Gather;
});

