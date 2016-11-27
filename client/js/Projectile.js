/**
 * Created by flavius on 2016-11-23.
 */
define(function() {

    var Projectile = Class.extend({
        init: function(id, kind) {
            var self = this;

            this.id = id;
            this.kind = kind;

            // Renderer
            this.sprite = null;
            this.animations = null;
            this.currentAnimation = null;

            // Position
            this.x = 0;
            this.y = 0;
            this.setPositionByGrid(0, 0);

            // Target
            this.tx = 0;
            this.ty = 0;

            this.angle = 0; // north

            // Speed
            this.speed = 1; // px/s

            // owner
            this.owner = null;
            this.isDirty = false;

            // Modes
            this.isLoaded = false;
            this.visible = true;
            this.impacted = false;

            this.setDirty();
        },

        setDirty: function() {
            this.isDirty = true;
            if(this.dirty_callback) {
                this.dirty_callback(this);
            }
        },

        onDirty: function(dirty_callback) {
            this.dirty_callback = dirty_callback;
        },

        setPosition: function(x, y) {
            log.info("Setting position: " + x + " y: " + y);
            this.x = x;
            this.y = y;
        },

        setPositionByGrid: function(x, y) {
            this.setPosition(x * 16, y * 16);
        },

        setTarget: function(x, y) {
            this.tx = x;
            this.ty = y;

            this.angle = Math.atan2(this.ty-this.y,this.tx-this.x) * (180/Math.PI) + 90; // 0 deg north
        },

        setTargetByGrid: function(x, y) {
            this.setTarget(x * 16, y * 16);
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

        getSprite: function() {
            return this.sprite;
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
                    this.currentAnimation.setSpeed(speed);
                    this.currentAnimation.setCount(count, onEndCount);
                }
            }
            else {
                this.log_error("Not ready for animation");
            }
        },

        impact: function(game){

            var self = this;
            if (this.impacted == true) return; // prevent more than once
            this.impacted = true;
            this.x=this.tx;
            this.y=this.ty;

            if(this.impact_callback) {
                this.impact_callback(this);
            }

            this.setSprite(game.sprites["explosion-fireball"]);

            if (this.kind == Types.Projectiles.ICEBALL) {
                this.setSprite(game.sprites["explosion-iceball"]);
            }

            if (this.kind == Types.Projectiles.BOULDER) {
                this.setSprite(game.sprites["explosion-boulder"]);
            }

            if (this.kind == Types.Projectiles.TERROR) {
                this.angle = 0; // no vectoring on explosion anim
                this.setSprite(game.sprites["explosion-terror"]);
            }

            if (this.kind == Types.Projectiles.HEALBALL1) {
                this.setSprite(game.sprites["explosion-heal"]);
            }

            if (this.kind == Types.Projectiles.LAVABALL) {
                this.setSprite(game.sprites["explosion-lavaball"]);
            }

            // no impact anim for arrow, though we might consider blood splatter in the future
            if (this.kind === Types.Projectiles.PINEARROW) {
                self.impactAnimCompleted();
                return;
            }

            // no impact anim for tornado
            if (this.kind === Types.Projectiles.TORNADO) {
                self.impactAnimCompleted();
                return;
            }

            this.setAnimation("explosion", 50,1,function(){
                self.impactAnimCompleted();
            });

        },

        impactAnimCompleted: function() {

            this.visible=false;
            if(this.impact_completed_callback) {
                this.impact_completed_callback(this);
            }

        },

        onImpact: function(callback) {
            this.impact_callback = callback;
        },

        onImpactCompleted: function(callback) {
            this.impact_completed_callback = callback;
        }

    });

    return Projectile;
});