
define(['../entity/character/character', '../utils/timer', '../entity/character/player/player'], function(Character, Timer, Player) {

    var Updater = Class.extend({
        init: function(game) {
            this.game = game;
            this.playerAggroTimer = new Timer(1000);
            this.lastUpdate = new Date();
        },

        update: function() {
            this.deltaSeconds = (new Date() - this.lastUpdate) / 1000;
            this.updateZoning();
            this.updateCharacters();
            this.updatePlayerAggro();
            this.updateTransitions();
            this.updateAnimations();
            this.updateAnimatedTiles();
            this.updateChatBubbles();
            this.updatePointers();
            this.updateKeyboardMovement();
            this.updateInfos();
            this.updateProjectiles();
            this.lastUpdate = new Date();
        },

        updateProjectiles: function() {
            var self = this;
            this.game.forEachProjectile(function(projectile) {
                if(projectile.isLoaded)
                    self.updateProjectile(projectile);

            });
        },

        updateProjectile: function(p) {
            var self = this;

            if (!p.impacted) {
                //self.game.renderer.cleanPathing();
                var mdist = p.speed * self.deltaSeconds;
                var dx = p.tx-p.x;
                var dy = p.ty-p.y;
                var tdist = Math.sqrt(dx*dx+dy*dy);
                var amount = mdist/tdist;

                // prevent "overshoot"
                if (amount > 1) amount = 1;

                p.x += dx * amount;
                p.y += dy * amount;

                // game/emitter projected or in pvp areas and not our projectile
                // collision with players in transit behavior
                if (p.owner == 0 || (this.game.pvpFlag && this.game.player && p.owner != this.game.player.id)) {
                    // which tile are we over
                    var tpos = { x: Math.floor(p.x/16), y: Math.floor(p.y/16) };
                    // player (self) standing here?
                    if (this.game.player) {
                        if (this.game.player.gridX == tpos.x) {
                            if (this.game.player.gridY == tpos.y) {
                                p.tx = this.game.player.x+8;
                                p.ty = this.game.player.y+8;
                                p.impact(this.game);
                            }
                        }
                    }
                }

                // tornadoes hit as they move over tiles
                if (p.kind === Types.Projectiles.TORNADO) {
                    // only track our own
                    if (this.game.player && p.owner == this.game.player.id) {
                        // which tile are we over
                        var tpos = { x: Math.floor(p.x/16), y: Math.floor(p.y/16) };
                        // has this changed
                        if (p.tpos == null || p.tpos && (p.tpos.x != tpos.x || p.tpos.y != tpos.y) ) {
                            // moved over new tile
                            this.game.detectCollateral(tpos.x,tpos.y,2,p.kind);
                        }
                        p.tpos = tpos;
                    }
                }

                if (tdist<1)
                    p.impact(this.game);

            }

        },

        updateCharacters: function() {
            var self = this;
            this.game.forEachEntity(function(entity) {
                var isCharacter = entity instanceof Character;

                if(entity.isLoaded) {
                    if(isCharacter) {
                        self.updateCharacter(entity);
                        self.game.onCharacterUpdate(entity);
                    }
                    self.updateEntityFading(entity);
                }
            });
        },

        updatePlayerAggro: function() {
            var t = this.game.currentTime,
                player = this.game.player;

            if(player && !player.isMoving() && !player.isAttacking()  && this.playerAggroTimer.isOver(t)) {
                player.checkAggro();
            }
        },

        updateEntityFading: function(entity) {
            if(entity && entity.isFading) {
                var duration = 1000,
                    t = this.game.currentTime,
                    dt = t - entity.startFadingTime;

                if(dt > duration) {
                    this.isFading = false;
                    entity.fadingAlpha = 1;
                } else {
                    entity.fadingAlpha = dt / duration;
                }
            }
        },

        updateTransitions: function() {
            var self = this,
                m = null,
                z = this.game.currentZoning;

            this.game.forEachEntity(function(entity) {
                m = entity.movement;
                if(m) {
                    if(m.inProgress) {
                        m.step(self.game.currentTime);
                    }
                }
            });

            if(z) {
                if(z.inProgress) {
                    z.step(this.game.currentTime);
                }
            }
        },

        updateZoning: function() {
            var g = this.game,
                c = g.camera,
                z = g.currentZoning,
                s = 3,
                ts = 16,
                speed = 500;

            if(z && z.inProgress === false) {
                var orientation = this.game.zoningOrientation,
                    startValue = endValue = offset = 0,
                    updateFunc = null,
                    endFunc = null;

                if(orientation === Types.Orientations.LEFT || orientation === Types.Orientations.RIGHT) {
                    offset = (c.gridW - 2) * ts;
                    startValue = (orientation === Types.Orientations.LEFT) ? c.x - ts : c.x + ts;
                    endValue = (orientation === Types.Orientations.LEFT) ? c.x - offset : c.x + offset;
                    updateFunc = function(x) {
                        if (!g.isCentered) {
                            c.setPosition(x, c.y);
                            g.initAnimatedTiles();
                            g.renderer.renderSideScrollerCanvas();
                        } else {
                            g.camera.setRealCoords();
                            g.renderbackground = true;
                        }
                    },
                        endFunc = function() {
                            if (!g.isCentered)
                                c.setPosition(z.endValue, c.y);

                            g.endZoning();
                        };
                } else if(orientation === Types.Orientations.UP || orientation === Types.Orientations.DOWN) {
                    offset = (c.gridH - 2) * ts;
                    startValue = (orientation === Types.Orientations.UP) ? c.y - ts : c.y + ts;
                    endValue = (orientation === Types.Orientations.UP) ? c.y - offset : c.y + offset;
                    updateFunc = function(y) {
                        if (!g.isCentered) {
                            c.setPosition(c.x, y);
                            g.initAnimatedTiles();
                            g.renderer.renderSideScrollerCanvas();
                        } else {
                            g.camera.setRealCoords();
                            g.renderbackground = true;
                        }
                    },
                        endFunc = function() {
                            if (!g.isCentered)
                                c.setPosition(c.x, z.endValue);

                            g.endZoning();
                        };
                }

                z.start(this.game.currentTime, updateFunc, endFunc, startValue, endValue, speed);
            }
        },

        updateCharacter: function(c) {
            var self = this;

            var tick = Math.round(16 / Math.round((c.moveSpeed / (1000 / 60))));

            if(c.isMoving() && c.movement.inProgress === false) {
                if(c.orientation === Types.Orientations.LEFT) {
                    c.movement.start(this.game.currentTime,
                        function(x) {
                            c.x = x;
                            c.hasMoved();
                        },
                        function() {
                            c.x = c.movement.endValue;
                            c.hasMoved();
                            c.nextStep();
                        },
                        c.x - tick,
                        c.x - 16,
                        c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.RIGHT) {
                    c.movement.start(this.game.currentTime,
                        function(x) {
                            c.x = x;
                            c.hasMoved();
                        },
                        function() {
                            c.x = c.movement.endValue;
                            c.hasMoved();
                            c.nextStep();
                        },
                        c.x + tick,
                        c.x + 16,
                        c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.UP) {
                    c.movement.start(this.game.currentTime,
                        function(y) {
                            c.y = y;
                            c.hasMoved();
                        },
                        function() {
                            c.y = c.movement.endValue;
                            c.hasMoved();
                            c.nextStep();
                        },
                        c.y - tick,
                        c.y - 16,
                        c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.DOWN) {
                    c.movement.start(this.game.currentTime,
                        function(y) {
                            c.y = y;
                            c.hasMoved();
                        },
                        function() {
                            c.y = c.movement.endValue;
                            c.hasMoved();
                            c.nextStep();
                        },
                        c.y + tick,
                        c.y + 16,
                        c.moveSpeed);
                }
            }

            if (this.game.isCentered) {
                if(c.isMoving() && c instanceof Player)
                    this.game.camera.setRealCoords();

                // Set Dirty all visible entities so it renders properly.
                if (c == this.game.player && this.game.player.isMoving())
                {
                    this.game.forEachVisibleEntityByDepth(function(entity) {
                        entity.setDirty();
                    });
                }
            }
        },

        updateKeyboardMovement: function()
        {
            if(!this.game.player /*|| this.game.player.isMoving()*/)
                return;

            var game = this.game;
            var player = this.game.player;

            var pos = {
                x: player.gridX,
                y: player.gridY
            };

            if(player.moveUp)
            {
                pos.y -= 1;
                game.keys(pos, Types.Orientations.UP);
            }
            else if(player.moveDown)
            {
                pos.y += 1;
                game.keys(pos, Types.Orientations.DOWN);

            }
            else if(player.moveRight)
            {
                pos.x += 1;
                game.keys(pos, Types.Orientations.RIGHT);

            }
            else if(player.moveLeft)
            {
                pos.x -= 1;
                game.keys(pos, Types.Orientations.LEFT);

            }
        },

        updateAnimations: function() {
            var t = this.game.currentTime;

            this.game.forEachEntity(function(entity) {
                var anim = entity.currentAnimation;

                if(anim) {
                    if(anim.update(t))
                        entity.setDirty();
                }
            });

            this.game.forEachProjectile(function(projectile) {
                var anim = projectile.currentAnimation;
                if(anim) {
                    if(anim.update(t))
                        projectile.setDirty();
                }
            });

            var sparks = this.game.sparksAnimation;
            if(sparks)
                sparks.update(t);


            var target = this.game.targetAnimation;
            if(target)
                target.update(t);

            var benef = this.game.benefAnimation;
            if (benef)
                benef.update(t);

            var benef10 = this.game.benef10Animation;
            if (benef10)
                benef10.update(t);

            var benef4 = this.game.benef4Animation;
            if (benef4)
                benef4.update(t);

        },

        updateAnimatedTiles: function() {
            var self = this,
                t = this.game.currentTime;

            this.game.forEachAnimatedTile(function (tile) {
                if(tile.animate(t)) {
                    tile.isDirty = true;
                    tile.dirtyRect = self.game.renderer.getTileBoundingRect(tile);

                    if(self.game.renderer.mobile || self.game.renderer.tablet)
                        self.game.checkOtherDirtyRects(tile.dirtyRect, tile, tile.x, tile.y);

                }
            });
        },

        updateChatBubbles: function() {
            var t = this.game.currentTime;

            this.game.bubbleManager.update(t);
        },
        
        updatePointers: function() {
            this.game.pointerManager.update();
        },

        updateInfos: function() {
            var t = this.game.currentTime;

            this.game.infoManager.update(t);
        }
    });

    return Updater;
});