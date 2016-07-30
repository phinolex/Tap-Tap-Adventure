
define(['character', 'timer', 'player'], function(Character, Timer, Player) {

    var Updater = Class.extend({
        init: function(game) {
            this.game = game;
            this.playerAggroTimer = new Timer(1000);
        },

        update: function() {
            this.updateZoning();
            this.updateCharacters();
            this.updatePlayerAggro();
            this.updateTransitions();
            this.updateAnimations();
            this.updateAnimatedTiles();
            this.updateChatBubbles();
            this.updateInfos();
            this.updateKeyboardMovement();
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

            // Check player aggro every 1s when not moving nor attacking
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
                        g.camera.setRealCoords();
			g.renderbackground = true;
                        
                    },
                    endFunc = function() {
                        g.endZoning();
                    };
                } else if(orientation === Types.Orientations.UP || orientation === Types.Orientations.DOWN) {
                    offset = (c.gridH - 2) * ts;
                    startValue = (orientation === Types.Orientations.UP) ? c.y - ts : c.y + ts;
                    endValue = (orientation === Types.Orientations.UP) ? c.y - offset : c.y + offset;
                    updateFunc = function(y) {
                        g.camera.setRealCoords();
			g.renderbackground = true;
                    },
                    endFunc = function() {
                        g.endZoning();
                        
                    };
                }

                z.start(this.game.currentTime, updateFunc, endFunc, startValue, endValue, speed);
            }
        },

        updateCharacter: function(c) {
            var self = this;

            // Estimate of the movement distance for one update
            //var tick = Math.round(16 / Math.round((c.moveSpeed / (1000 / this.game.renderer.FPS))));
            //log.info("tick="+tick);
            var tick=3;
            
            if (c === self.game.player)
            {
            	    // Gets reset to 0 Every screen update.
            	    if (c.prevX == 0 && c.prevY == 0)
            	    {
            	    	    c.prevX = c.x;
            	    	    c.prevY = c.y;
            	    	    c.prevOrientation = c.orientation;
            	    }
            }  
            if (c.isStunned)
            	return;

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
            if(c.isMoving() && c instanceof Player)
            {
            	this.game.camera.setRealCoords();
		//this.game.renderbackground = true;
            }
            
            // Set Dirty all visible entities so it renders properly.
            if (c == this.game.player && this.game.player.isMoving())
            {
            	this.game.forEachVisibleEntityByDepth(function(entity) {
                    entity.setDirty();		
            	});
            }
        },
        
        updateKeyboardMovement: function()
        {
            if(!this.game.player /*|| this.game.player.isMoving()*/)
                return;

            var game = this.game;
            var player = this.game.player;

            if (game.joystick)
            {            	
	           player.moveRight = false;
	       	   player.moveLeft = false;
		   player.moveUp = false;
		   player.moveDown = false;
		   
		   if (game.joystick.right())
		   {
		       player.moveRight = true;
	       	   }
		   else if (game.joystick.left())
		   {
		       player.moveLeft = true;
		   }
		   else if (game.joystick.up())
		   {
		       player.moveUp = true;
		   }
		   else if (game.joystick.down())
		   {
		       player.moveDown = true;
		   }

       	    }

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

                if(anim && !entity.isStun) {
                    if(anim.update(t)) {
                        entity.setDirty();
                    }
                }
                
                if (entity.mount) {
                	var animMount = entity.mount.currentAnimation;
                	if (animMount) {
                		animMount.update(t);
                        }
                }
                
                anim = entity.criticalAnimation;
                if(anim && entity.isCritical){
                    anim.update(t);
                }
                anim = entity.healAnimation;
                if(anim && entity.isHeal){
                    anim.update(t);
                }
                anim = entity.stunAnimation;
                if(anim && entity.isStun){
                    anim.update(t);
                }
            });

            var sparks = this.game.sparksAnimation;
            if(sparks) {
                sparks.update(t);
            }

            var target = this.game.targetAnimation;
            if(target) {
                target.update(t);
            }

            var benef = this.game.benefAnimation;
            if(benef) {
                benef.update(t);
            }

            var benef10 = this.game.benef10Animation;
            if(benef10) {
                benef10.update(t);
            }

            var benef4 = this.game.benef4Animation;
            if(benef4) {
                benef4.update(t);
            }
        },

        updateAnimatedTiles: function() {
            var self = this,
                t = this.game.currentTime;

            this.game.forEachAnimatedTile(function (tile) {
                if(tile.animate(t)) {
                    tile.isDirty = true;
                    tile.dirtyRect = self.game.renderer.getTileBoundingRect(tile);

                    if(self.game.renderer.mobile || self.game.renderer.tablet) {
                        self.game.checkOtherDirtyRects(tile.dirtyRect, tile, tile.x, tile.y);
                    }
                }
            });
        },

        updateChatBubbles: function() {
            var t = this.game.currentTime;

            this.game.bubbleManager.update(t);
        },

        updateInfos: function() {
            var t = this.game.currentTime;

            this.game.infoManager.update(t);
        }
    });

    return Updater;
});
