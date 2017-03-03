
define([], function() {

    var Mount = Class.extend({
        init: function(game, player, spriteName, moveSpeed, idleSpeed) {
            this.game = game;
            this.player = player;
            
            // Renderer
            this.sprite = null;
            this.flipSpriteX = false;
            this.flipSpriteY = false;
            this.animations = null;
            this.currentAnimation = null;
            
            // Modes
            this.isLoaded = false;
            
            this.spriteName = spriteName;
            this.moveSpeed = moveSpeed;
            this.idleSpeed = idleSpeed;
            
            this.orientation = Types.Orientations.DOWN;
            
        },
        setSprite: function(sprite) {
            if(!sprite) {
                log.error(this.id + " : sprite is null", true);
                throw "Sprite error";
            }

            if(this.sprite && this.sprite.name === sprite.name) {
                return;
            }

            this.sprite = sprite;

            this.animations = sprite.createAnimations();

            this.isLoaded = true;
        },

        getAnimationByName: function(name) {
            var animation = null;

            if(name in this.animations) {
                animation = this.animations[name];
            }
            else {
                log.error("No animation called "+ name);
            }
            return animation;
        },

        setAnimation: function(name, speed, count, onEndCount) {
            var self = this;

            if(this.isLoaded) {
                if(this.currentAnimation && this.currentAnimation.name === name) {
                    return;
                }

                var s = this.sprite,
                    a = this.getAnimationByName(name);

                if(a) {
                    this.currentAnimation = a;
                    if(name.substr(0, 3) === "atk") {
                        this.currentAnimation.reset();
                    }
                    this.currentAnimation.setSpeed(speed);
                    this.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
                        self.idle();
                    });
                }
            }
            else {
                log.error("Not ready for animation");
            }
        },

        animate: function(animation, speed, count, onEndCount) {
            var oriented = ['atk', 'walk', 'idle'],
                o = this.orientation;

            if(!(this.currentAnimation && this.currentAnimation.name === "death")) { // don't change animation if the character is dying
                this.flipSpriteX = false;
                this.flipSpriteY = false;

                if(_.indexOf(oriented, animation) >= 0) {
                    animation += "_" + (o === Types.Orientations.LEFT ? "right" : Types.getOrientationAsString(o));
                    this.flipSpriteX = this.orientation === Types.Orientations.LEFT;
                }

                this.setAnimation(animation, speed, count, onEndCount);
            }
        },
        
        setOrientation: function(orientation) {
            if(orientation) {
                this.orientation = orientation;
            }
        },

        walk: function(orientation) {
            this.setOrientation(orientation);
            this.animate("walk", this.moveSpeed);
        },


        idle: function(orientation) {
            this.setOrientation(orientation);
            this.animate("idle", this.idleSpeed);
        }
    });    
    return Mount;
});
