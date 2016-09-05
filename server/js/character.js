var cls = require("./lib/class"),
    Messages = require("./message"),
    Utils = require("./utils"),
    MobData = require("./mobdata"),
    NpcData = require("./npcdata"),
    Timer = require("./timer"),
    Types = require("../../shared/js/gametypes"),
    Transition =  require("./transition");

module.exports = Character = Entity.extend({
    init: function (id, type, kind, x, y) {
            var self = this;

            this._super(id, type, kind, x, y);

            // Position and orientation
            this.nextGridX = -1;
            this.nextGridY = -1;
            this.orientation = this.setRandomOrientation();
            
            /* 
             * Have to handle this
             * server side
             * then have it sent using gameclient
             */

            // Speeds
            this.atkSpeed = 50;
            this.moveSpeed = 120;
            this.walkSpeed = 100;
            this.idleSpeed = 450;
            this.setAttackRate(800);

            // Pathing
            this.movement = new Transition();
            this.path = null;
            this.newDestination = null;
            //this.adjacentTiles = {};

            // Combat
            this.target = null;
            this.unconfirmedTarget = null;
            this.attackers = {};

            // Health
            this.hitPoints = 0;
            this.maxHitPoints = 0;

            // Modes
            this.isDead = false;
            this.attackingMode = false;
            this.followingMode = false;
            this.engagingPC = false;
            this.inspecting = null;
            
            this.isStunned = false;
            this.isInvincible = false;
            
        },

        clean: function() {
            this.forEachAttacker(function(attacker) {
                attacker.disengage();
                attacker.idle();
            });
        },

        setMaxHitPoints: function(hp) {
            this.maxHitPoints = hp;
            this.hitPoints = hp;
        },
        setMaxMana: function(mana) {
            this.maxMana = mana;
            this.mana = mana;
	},

        setAttackRange: function(range) {
            this.attackRange = range;
        },

        hasWeapon: function() {
            return false;
        },

        turnTo: function(orientation) {
            this.orientation = orientation;
            this.idle();
        },

        setOrientation: function(orientation) {
            if(orientation) {
                this.orientation = orientation;
            }
        },

        idle: function(orientation) {
            this.setOrientation(orientation);
        },

        hit: function(orientation) {
            this.setOrientation(orientation);
            this.stop();
        },

        walk: function(orientation) {
            this.setOrientation(orientation);
        },

        moveTo_: function(x, y, callback) {
            this.destination = { x: x, y: y };
            //this.adjacentTiles = {};

            if(this.isMoving()) {
                this.continueTo(x, y);
            }
            else {
                var path = this.requestPathfindingTo(x, y);

                this.followPath(path);
            }
        },

        requestPathfindingTo: function(x, y) {
            if(this.request_path_callback) {
                return this.request_path_callback(x, y);
            } else {
                log.error(this.id + " couldn't request pathfinding to "+x+", "+y);
                return [];
            }
        },

        onRequestPath: function(callback) {
            this.request_path_callback = callback;
        },

        onStartPathing: function(callback) {
            this.start_pathing_callback = callback;
        },

        onStopPathing: function(callback) {
            this.stop_pathing_callback = callback;
        },

        followPath: function(path) {
		if (!path) return;
        	this.path = path;
		this.step = 0;

		if(this.followingMode) { // following a character
		    path.pop();
		}
	
		if(this.start_pathing_callback) {
		    this.start_pathing_callback(path);
		}
		this.nextStep();
        },

        continueTo: function(x, y) {
            this.newDestination = { x: x, y: y };
        },

        updateMovement: function() {
            var p = this.path,
                i = this.step;

            if(p[i][0] < p[i-1][0]) {
                this.walk(Types.Orientations.LEFT);
            }
            if(p[i][0] > p[i-1][0]) {
                this.walk(Types.Orientations.RIGHT);
            }
            if(p[i][1] < p[i-1][1]) {
                this.walk(Types.Orientations.UP);
            }
            if(p[i][1] > p[i-1][1]) {
                this.walk(Types.Orientations.DOWN);
            }
        },

        updatePositionOnGrid: function() {
            //log.info("this.path"+JSON.stringify(this.path));
            if (this.path.length > 0)
            {
                this.setPosition(this.path[this.step][0], this.path[this.step][1]);
            }
        },

        nextStep: function() {
            var stop = false,
                x, y, path;

            if(this.isMoving()) {
                if(this.before_step_callback) {
                    this.before_step_callback();
                }
                
                //log.info("nextStep-this.path="+JSON.stringify(this.path));
                this.updatePositionOnGrid();
                this.checkAggro();

                if(this.interrupted) { // if Character.stop() has been called
                    stop = true;
                    this.interrupted = false;
                }
                else {
                    if(this.hasNextStep()) {
                        this.nextGridX = this.path[this.step+1][0];
                        this.nextGridY = this.path[this.step+1][1];
                    }

                    if(this.step_callback) {
                        this.step_callback();
                    }

                    if(this.hasChangedItsPath()) {
                        x = this.newDestination.x;
                        y = this.newDestination.y;
                        path = this.requestPathfindingTo(x, y);

                        this.newDestination = null;
                        if(!path || path.length < 2) {
                            stop = true;
                        }
                        else {
                            this.followPath(path);
                        }
                    }
                    else if(this.hasNextStep()) {
                        this.step += 1;
                        this.updateMovement();
                    }
                    else {
                        stop = true;
                    }
                }

                if(stop) { // Path is complete or has been interrupted
    		        this.path = null;
    		        this.idle();

    		        if (this.engagingPC) {
    		            this.followingMode = false;
    		            this.engagingPC = false;
    		        }
                    if(this.stop_pathing_callback) {
                        this.stop_pathing_callback(this.x, this.y);
                    }
        		}
        	}
        },

        onBeforeStep: function(callback) {
            this.before_step_callback = callback;
        },

        onStep: function(callback) {
            this.step_callback = callback;
        },

        isMoving: function() {
            //log.info("isMoving-this.path="+JSON.stringify(this.path));
            return !(typeof this.path === 'undefined' || this.path === null);
        },

        hasNextStep: function() {
            //if (!this.path) return false;
            return (this.path.length - 1 > this.step);
        },

        hasChangedItsPath: function() {
            return !(this.newDestination === null);
        },

        isNear: function(character, distance) {
            var dx, dy, near = false;

            dx = Math.abs(this.x - character.x);
            dy = Math.abs(this.y - character.y);

            if(dx <= distance && dy <= distance) {
                near = true;
            }
            return near;
        },

        onAggro: function(callback) {
            this.aggro_callback = callback;
        },

        onCheckAggro: function(callback) {
            this.checkaggro_callback = callback;
        },

        checkAggro: function() {
            if(this.checkaggro_callback) {
                this.checkaggro_callback();
            }
        },

        aggro: function(character) {
            if(this.aggro_callback) {
                this.aggro_callback(character);
            }
        },

        onDeath: function(callback) {
            this.death_callback = callback;
        },

        /**
         * Changes the character's orientation so that it is facing its target.
         */
        lookAtTarget: function() {
            if(this.target) {
                this.turnTo(this.getOrientationTo(this.target));
            }
        },

        /**
         *
         */
        go: function(x, y) {
            if(this.isAttacking()) {
                this.disengage();
            }
            else if(this.followingMode) {
                this.followingMode = false;
                this.target = null;
            }
            this.moveTo_(x, y);
        },

        /**
         * Makes the character follow another one.
         */
        follow: function(entity, engagingPC) {
            this.engagingPC = engagingPC === undefined ? false : engagingPC;
            if (entity && ((this.engagingPC && this.kind === 1) || (this.engagingPC == false && entity.kind != 1) || (this.kind !== 1))) {                
                this.followingMode = true;
                this.moveTo_(entity.x, entity.y);
            }
        },

        /**
         * Stops a moving character.
         */
        stop: function() {
            if(this.isMoving()) {
                this.interrupted = true;
            }
        },

        /**
         * Makes the character attack another character. Same as Character.follow but with an auto-attacking behavior.
         * @see Character.follow
         */
        engage: function(character) {
            this.attackingMode = true;
            this.setTarget(character);
            var engagingPC = false;
            if (this.kind === 1 && character.kind === 1) {
                engagingPC = true;
            }
            this.follow(character, engagingPC);
        },
        disengage: function() {
            this.attackingMode = false;
            this.followingMode = false;
            this.removeTarget();
        },
        /**
         * Returns true if the character is currently attacking.
         */
        isAttacking: function() {
            return this.attackingMode;
        },

        /**
         * Gets the right orientation to face a target character from the current position.
         * Note:
         * In order to work properly, this method should be used in the following
         * situation :
         *    S
         *  S T S
         *    S
         * (where S is self, T is target character)
         *
         * @param {Character} character The character to face.
         * @returns {String} The orientation.
         */
        getOrientationTo: function(character) {
            if(this.x < character.x) {
                return Types.Orientations.RIGHT;
            } else if(this.x > character.x) {
                return Types.Orientations.LEFT;
            } else if(this.y > character.y) {
                return Types.Orientations.UP;
            } else {
                return Types.Orientations.DOWN;
            }
        },

        /**
         * Returns true if this character is currently attacked by a given character.
         * @param {Character} character The attacking character.
         * @returns {Boolean} Whether this is an attacker of this character.
         */
        isAttackedBy: function(character) {
        	if (Object.keys(this.attackers).length == 0) {
        		return false;
        	}
            return (character.id in this.attackers);
        },

        isAttacked: function() {
        	if (Object.keys(this.attackers).length == 0) {
        		return false;
        	}
        	return true;
        },
        
        /**
        * Registers a character as a current attacker of this one.
        * @param {Character} character The attacking character.
        */
        addAttacker: function(character) {
            if(!this.isAttackedBy(character)) {
                this.attackers[character.id] = character;
            } else {
                log.error(this.id + " is already attacked by " + character.id);
            }
        },

        /**
        * Unregisters a character as a current attacker of this one.
        * @param {Character} character The attacking character.
        */
        removeAttacker: function(character) {
            if (Object.keys(this.attackers).length == 0) {
            	    return;
            }
            if(this.isAttackedBy(character)) {
                delete this.attackers[character.id];
            } 
            //else {
            //    log.info(this.id + " is not attacked by " + character.id);
            //}
        },
        forceStop: function () {
    	    if (this.isMoving()) {
    	        //this.interrupted = true;
    	        this.path = null;
    	        this.newDestination = null;
    	        this.idle();
    	        if (this.engagingPC) {
    	            this.followingMode = false;
    	            this.engagingPC = false;
    	        }
    	    }
    	},
        /**
         * Loops through all the characters currently attacking this one.
         * @param {Function} callback Function which must accept one character argument.
         */
        forEachAttacker: function(callback) {
            _.each(this.attackers, function(attacker) {
                callback(attacker);
            });
        },

        /**
         * Sets this character's attack target. It can only have one target at any time.
         * @param {Character} character The target character.
         */
        setTarget: function(character) {
            if(this.target !== character) { // If it's not already set as the target
                if(this.hasTarget()) {
                    this.removeTarget(); // Cleanly remove the previous one
                }
                this.unconfirmedTarget = null;
                this.target = character;
                if(this.settarget_callback){
                    var targetName;
                    if (MobData.Kinds[character.kind] && MobData.Kinds[character.kind].key)
                    	targetName = MobData.Kinds[character.kind].key;
                    else if (NpcData.Kinds[character.kind] && NpcData.Kinds[character.kind].key)
                    	targetName = NpcData.Kinds[character.kind].key;
                    else
                    	targetName = Types.getKindAsString(character.kind);
                    this.settarget_callback(character, targetName);
                }
            } else {
                log.debug(character.id + " is already the target of " + this.id);
            }
        },
       
        onSetTarget: function(callback) {
          this.settarget_callback = callback;
        },


        /**
         * Removes the current attack target.
         */
        removeTarget: function() {
            var self = this;

            if(this.target) {
                if(this.target instanceof Character) {
                    this.target.removeAttacker(this);
                }
                if(this.removetarget_callback) this.removetarget_callback(this.target.id);
                this.target = null;
            }
        },
        onRemoveTarget: function(callback){
            this.removetarget_callback = callback;
        },

        /**
         * Returns true if this character has a current attack target.
         * @returns {Boolean} Whether this character has a target.
         */
        hasTarget: function() {
            return !(this.target === null);
        },

        /**
         * Marks this character as waiting to attack a target.
         * By sending an "attack" message, the server will later confirm (or not)
         * that this character is allowed to acquire this target.
         *
         * @param {Character} character The target character
         */
        waitToAttack: function(character) {
            this.unconfirmedTarget = character;
        },

        /**
         * Returns true if this character is currently waiting to attack the target character.
         * @param {Character} character The target character.
         * @returns {Boolean} Whether this character is waiting to attack.
         */
        isWaitingToAttack: function(character) {
            return (this.unconfirmedTarget === character);
        },

        /**
         *
         */
        canAttack: function(time) {
            if(this.isDead == false && this.attackCooldown.isOver(time)) {
                return true;
            }
            return false;
        },

        canMove: function(time) {
            if(this.isDead == false && this.moveCooldown.isOver(time)) {
                return true;
            }
            return false;
        },
        
        canReach: function(entity) {
            if (this.x == entity.x && this.y == entity.y)
            	    return true;

            if(this.attackRange > 1){
                if(this.isNear(entity, this.attackRange))
                    return true;

            } else{
                if(this.isAdjacentNonDiagonal(entity))
                    return true;

            }
            return false;
        },


        /**
         *
         */
        die: function() {
            this.removeTarget();
            this.isDead = true;

            if(this.death_callback) {
                this.death_callback();
            }
        },

        onHasMoved: function(callback) {
            this.hasmoved_callback = callback;
        },

        hasMoved: function() {
            this.setDirty();
            if(this.hasmoved_callback) {
                this.hasmoved_callback(this);
            }
        },

        hurt: function() {
            var self = this;

            this.stopHurting();
            this.sprite = this.hurtSprite;
            this.hurting = setTimeout(this.stopHurting.bind(this), 75);
        },

        stopHurting: function() {
            this.sprite = this.normalSprite;
            clearTimeout(this.hurting);
        },

        setAttackRate: function(rate) {
            this.attackCooldown = new Timer(rate);
        },
        
        setMoveRate: function(rate) {
            this.moveCooldown = new Timer(rate);
        },
    
// Server Character
    getState: function () {
        var basestate = this._getBaseState(),
            state = [];

        state.push(this.orientation);
        if (this.target) {
            state.push(this.target.id);
        }

        return basestate.concat(state);
    },
    
    resetMana: function(maxMana) {
        this.maxMana = maxMana;
        this.mana = this.maxMana;
    },

    resetHitPoints: function (maxHitPoints) {
        this.maxHitPoints = maxHitPoints;
        this.hitPoints = this.maxHitPoints;
    },

    regenHealthBy: function (value) {
        var hp = this.hitPoints,
            max = this.maxHitPoints;

        if (hp < max) {
            if (hp + value <= max) {
                this.hitPoints += value;
            }
            else {
                this.hitPoints = max;
            }
        }
    },
    regenManaBy: function(value) {
        var mana = this.mana,
            max = this.maxMana;
        
        if (mana < max) {
            if (mana + value <= max) {
                
                this.mana += value;
            } else {
                
                this.mana = max;
            }
        }   
    },

    hasFullHealth: function () {
        
        return this.hitPoints === this.maxHitPoints;
    },
    hasFullMana: function() {
      
        return this.mana === this.maxMana;
    },

    clearTarget: function () {
        this.target = null;
    },


    attack: function () {
        return new Messages.Attack(this.id, this.target.id);
    },

    health: function(attacker) {
        return new Messages.Health(this.hitPoints, attacker ? (attacker instanceof Mob ? 1 : 2) : 0, false);
    },

    regen: function () {
        return new Messages.Health(this.hitPoints, true);
    },
    
});


module.exports = Character;
