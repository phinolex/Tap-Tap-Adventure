var cls = require('./lib/class');
var Messages = require('./message');
var Utils = require('./utils');

module.exports = Entity = cls.Class.extend({
        init: function(id, type, kind, x, y) {
            var self = this;

            this.type = type;
            
            this.id = parseInt(id);
            this.kind = kind;

            this.isCritical = false;
            this.isHeal = false;
            
            this.shadowOffsetY = 0;

            // Position
            this.setPosition(x, y);

            this.name = "";
        },

	destroy: function() {
		
	},
	
        setName: function(name) {
            this.name = name;
        },

        setPosition: function(x, y) {
            this.x = x;
            this.y = y;       
        },

        ready: function(f) {
            this.ready_func = f;
        },


        /**
         *
         */
        getDistanceToEntity: function(entity) {
            var distX = Math.abs(entity.x - this.x),
                distY = Math.abs(entity.y - this.y);

            return (distX > distY) ? distX : distY;
        },

        isCloseTo: function(entity) {
            var dx, dy, d, close = false;
            if(entity) {
                dx = Math.abs(entity.x - this.x);
                dy = Math.abs(entity.y - this.y);

                if(dx < 30 && dy < 14) {
                    close = true;
                }
            }
            return close;
        },

        /**
         * Returns true if the entity is adjacent to the given one.
         * @returns {Boolean} Whether these two entities are adjacent.
         */
        isAdjacent: function(entity) {
            var adjacent = false;

            if(entity) {
                adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
            }
            return adjacent;
        },

        /**
         *
         */
        isAdjacentNonDiagonal: function(entity) {
            var result = false;

            if(this.isAdjacent(entity) && !(this.x !== entity.x && this.y !== entity.y)) {
                result = true;
            }

            return result;
        },

        isDiagonallyAdjacent: function(entity) {
            return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
        },

        forEachAdjacentNonDiagonalPosition: function(callback) {
            callback(this.x - 1, this.y, Types.Orientations.LEFT);
            callback(this.x, this.y - 1, Types.Orientations.UP);
            callback(this.x + 1, this.y, Types.Orientations.RIGHT);
            callback(this.x, this.y + 1, Types.Orientations.DOWN);

        },

        stun: function(level){
            var self = this;
            if(!this.isStun){
                this.isStun = true;
                if(this.attackCooldown){
                    this.attackCooldown.lastTime += 500*level;
                }
                this.stunTimeout = setTimeout(function(){
                    self.isStun = false;
                    self.stunTimeout = null;
                }, 500*level);
            }
        },
        provocation: function(level){
            var self = this;
            if(!this.isProvocation){
                this.isProvocation = true;
                this.stunTimeout = setTimeout(function(){
                    self.isProvocation = false;
                    self.provocationTimeout = null;
                }, 1000*level);
            }
        },

	// Old Entity        
	
	    _getBaseState: function () {
		return [
		    parseInt(this.id, 10),
		    this.kind,
		    this.x,
		    this.y
		];
	    },
	
	    getState: function () {
		return this._getBaseState();
	    },
	
	    spawn: function () {
		//if (kind == null || id == null)
		//    return;
		return new Messages.Spawn(this);
	    },
	
	    despawn: function () {
		    return new Messages.Despawn(this.id);
	    },
	
	    getPositionNextTo: function (entity) {
		var pos = null;
		if (entity) {
		    pos = {};
		    // This is a quick & dirty way to give mobs a random position
		    // close to another entity.
		    var r = Utils.random(4);
	
		    pos.x = entity.x;
		    pos.y = entity.y;
		    if (r === 0) {
			pos.y -= 1;
		    }
		    if (r === 1) {
			pos.y += 1;
		    }
		    if (r === 2) {
			pos.x -= 1;
		    }
		    if (r === 3) {
			pos.x += 1;
		    }
		}
		return pos;
	    },
	    
	    setRandomOrientation: function() {
	    r = Utils.random(4);
	
	    if(r === 0)
		this.orientation = Types.Orientations.LEFT;
	    if(r === 1)
		this.orientation = Types.Orientations.RIGHT;
	    if(r === 2)
		this.orientation = Types.Orientations.UP;
	    if(r === 3)
		this.orientation = Types.Orientations.DOWN;
			    
	    },

    });

module.exports = Entity;

