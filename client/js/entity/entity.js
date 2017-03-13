
define(['./animation', '../data/mobdata'], function(Animation, MobData) {

    var Entity = Class.extend({
        init: function(id, kind) {
            var self = this;

            self.id = id;
            self.kind = kind;

            self.sprite = null;
            self.flipSpriteX = false;
            self.flipSpriteY = false;

            self.animations = null;
            self.currentAnimation = null;

            self.isCritical = false;
            self.isHeal = false;

            self.isPointing = false;
            self.pointerTimeout = null;

            self.shadowOffsetY = 0;

            self.setGridPosition(0, 0);

            self.isLoaded = false;
            self.isHighlighted = false;
            self.visible = true;
            self.isFading = false;
            self.prevX = 0;
            self.prevY = 0;
            self.prevOrientation = null;

            self.name = "";

            self.loadAnimations();
            self.setDirty();
        },

        loadAnimations: function() {
            var self = this;

            self.criticalAnimation = new Animation('atk_down', 10, 0, 48, 48);
            self.criticalAnimation.setSpeed(30);

            self.healAnimation = new Animation('atk_down', 10, 0, 32, 32);
            self.healAnimation.setSpeed(120);

            self.stunAnimation = new Animation('atk_down', 6, 0, 48, 48);
            self.stunAnimation.setSpeed(30);

            self.criticalAnimation.setCount(1, function() {
                self.isCritical = false;
                self.criticalAnimation.reset();
                self.criticalAnimation.count = 1;
            });

            self.healAnimation.setCount(1, function() {
                self.isHeal = false;
                self.healAnimation.reset();
                self.healAnimation.count = 1;
            });
        },

        setName: function(name) {
            this.name = name;
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
        },

        setGridPosition: function(gridX, gridY) {
            var self = this;

            self.gridX = gridX;
            self.gridY = gridY;

            self.setPosition(gridX * 16, gridY * 16);
        },
        
        setSprite: function(sprite) {
            var self = this;
            
            if (!sprite)
                throw 'Sprite not found: ' + self.id;
            
            if (self.sprite && self.sprite.name == sprite.name)
                return;
            
            if (!sprite.isLoaded)
                sprite.load();
            
            self.sprite = sprite;
            self.normalSprite = self.sprite;

            self.hurtSprite = sprite.getHurtSprite();
            self.animations = sprite.createAnimations();

            self.isLoaded = true;

            if (self.ready_func)
                self.ready_func();
        },

        setAnimation: function(name, speed, count, onEndCount) {
            var self = this;

            if (self.isLoaded) {
                if (self.currentAnimation && self.currentAnimation.name === name)
                    return;

                var a = self.getAnimationByName(name);

                if (a) {
                    self.currentAnimation = a;

                    if (name.substr(0, 3) === 'atk')
                        self.currentAnimation.reset();

                    self.currentAnimation.setSpeed(speed);

                    self.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
                        self.idle();
                    });
                }
            }
        },

        setHighlight: function(highlight) {
            var self = this;

            self.sprite = highlight ? self.sprite.silhouetteSprite : self.normalSprite;
            self.isHighlighted = highlight;
        },

        setVisible: function(visible) {
            this.visible = visible;
        },

        setDirty: function() {
            var self = this;

            self.isDirty = true;

            if (self.dirty_callback)
                self.dirty_callback(self);
        },

        getSprite: function() {
            return this.sprite;
        },

        getSpriteName: function() {
            return this.spriteName;
        },

        getAnimationByName: function(name) {
            var self = this,
                animation;

            if (name in self.animations)
                animation = self.animations[name];

            return animation;
        },

        isMob: function(kind) {
            var kinds = MobData.Kinds;

            return kinds[kind]? true : false;
        },

        hasShadow: function() {
            return false;
        },

        ready: function(callback) {
            this.ready_func = callback;
        },

        onDirty: function(callback) {
            this.dirty_callback = callback;
        },

        clean: function() {
            this.stopBlinking();
        },

        isVisible: function() {
            return this.visible;
        },

        toggleVisibility: function() {
            this.setVisible(!this.visible);
        },

        getDistanceToEntity: function(entity) {
            var x = Math.abs(entity.gridX - this.gridX),
                y = Math.abs(entity.gridY - this.gridY);

            return (x > y) ? x : y;
        },

        isCloseTo: function(entity) {
            var self = this,
                dx, dy,
                close = false;

            if (entity) {
                dx = Math.abs(entity.gridX - self.gridX);
                dy = Math.abs(entity.gridY - self.gridY);

                if (dx < 30 && dy < 14)
                    close = true;
            }

            return close;
        },

        isAdjacent: function(entity) {
            var self = this,
                adjacent = false;

            if (entity)
                adjacent = self.getDistanceToEntity(entity) <= 1;

            return adjacent;
        },

        isAdjacentNonDiagonal: function(entity) {
            return this.isAdjacent(entity) && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY);
        },

        isDiagonallyAdjacent: function(entity) {
            return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
        },

        forEachAdjacentNonDiagonalPosition: function(callback) {
            var self = this;

            callback(self.gridX - 1, self.gridY, Types.Orientations.LEFT);
            callback(self.gridX, self.gridY - 1, Types.Orientations.UP);
            callback(self.gridX + 1, self.gridY, Types.Orientations.RIGHT);
            callback(self.gridX, self.gridY + 1, Types.Orientations.DOWN);
        },

        fadeIn: function(currentTime) {
            this.isFading = true;
            this.startFadingTime = currentTime;
        },

        blink: function(speed) {
            var self = this;

            self.blinking = setInterval(function() {
                self.toggleVisibility();
            }, speed);
        },

        stopBlinking: function() {
            var self = this;

            if (self.blinking)
                clearInterval(self.blinking);

            self.setVisible(true);
        },

        stun: function(level) {
            var self = this;

            if (!self.isStun) {
                self.isStun = true;

                if (self.attackCooldown)
                    self.attackCooldown.lastTime += 500 * level;

                self.stunTimeout = setTimeout(function() {
                    self.isStun = false;
                    self.stunTimeout = null;
                }, 50 * level);
            }
        },

        provocation: function(level) {
            var self = this;

            if (!self.isProvocation) {
                self.isProvocation = true;

                self.stunTimeout = setTimeout(function() {
                    self.isProvocation = false;
                    self.provocationTimeout = null;
                }, 100 * level);
            }
        }

    });

    return Entity;
});
