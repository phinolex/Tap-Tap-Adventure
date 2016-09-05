var _ = require('underscore');
var Character = require('./character');
var ChestArea = require('./chestarea');
var Messages = require('./message');
var MobArea = require('./mobarea');
var MobData = require('./mobdata');
var Items = require('./items');
var Utils = require('./utils');

module.exports = Mob = Character.extend({
    init: function (id, kind, x, y) {

    	this._super(id, 'mob', kind, x, y);

    	var mobData = MobData.Kinds[this.kind];
        this.updateHitPoints();
        this.spawningX = x;
        this.spawningY = y;
        this.armorLevel = mobData.armor;
        this.weaponLevel = mobData.weapon;
        this.level = mobData.level;
        this.hatelist = [];
        this.respawnTimeout = null;
        this.returnTimeout = null;
        this.isDead = false;
        this.hateCount = 0;
        this.tankerlist = [];
        this.aggroRange = mobData.aggroRange;
        this.attackRange = mobData.attackRange;
        this.isAggressive = mobData.isAggressive;
        this.setAttackRate(mobData.attackRate);
        this.setMoveRate(mobData.moveSpeed);
        this.xp = mobData.xp;
        this.setDrops();
        this.spawnDelay = mobData.spawnDelay;

    },

    startRoaming: function() {
        var self = this;

        setInterval(function() {
            if (Utils.randomInt(0, 20) == 4) {
                var position = {};
                var validPosition = false;
                while (!validPosition) {
                    position.x = self.x + Utils.random(0, 5);
                    position.y = self.y + Utils.random(0, 5);

                }
            }
        }, 500);
    },

    destroy: function () {
        this.isDead = true;
        this.hatelist = [];
        this.tankerlist = [];
        this.clearTarget();
        this.updateHitPoints();
        this.resetPosition();

        this.handleRespawn();
    },

    receiveDamage: function (points, playerId) {
        this.hitPoints -= points;
    },

    hates: function (playerId) {
        return _.any(this.hatelist, function(obj) {
            return obj.id === playerId;
        });
    },

    increaseHateFor: function (playerId, points) {
        if (this.hates(playerId)) {
            _.detect(this.hatelist, function (obj) {
                return obj.id === playerId;
            }).hate += points;
        }
        else {
            this.hatelist.push({ id: playerId, hate: points });
        }

        /*
         log.debug("Hatelist : "+this.id);
         _.each(this.hatelist, function(obj) {
         log.debug(obj.id + " -> " + obj.hate);
         });*/

        if (this.returnTimeout) {
            // Prevent the mob from returning to its spawning position
            // since it has aggroed a new player
            clearTimeout(this.returnTimeout);
            this.returnTimeout = null;
        }
    },
    addTanker: function(playerId){
        var i=0;
        for(i=0; i<this.tankerlist.length; i++){
            if(this.tankerlist[i].id === playerId){
                this.tankerlist[i].points++;
                break;
            }
        }
        if(i >= this.tankerlist.length){
            this.tankerlist.push({id: playerId, points: 1});
        }
    },
    getMainTankerId: function(){
        var i=0;
        var mainTanker = null;
        for(i=0; i<this.tankerlist.length; i++){
            if(mainTanker === null){
                mainTanker = this.tankerlist[i];
                continue;
            }
            if(mainTanker.points < this.tankerlist[i].points){
                mainTanker = this.tankerlist[i];
            }
        }

        if(mainTanker){
            return mainTanker.id;
        } else{
            return null;
        }
    },

    getHatedPlayerId: function(hateRank) {
        var i, playerId,
            sorted = _.sortBy(this.hatelist, function(obj) { return obj.hate; }),
            size = _.size(this.hatelist);

        if(hateRank && hateRank <= size) {
            i = size - hateRank;
        }
        else {
            if(size === 1){
                i = size - 1;
            } else{
                this.hateCount++;
                if(this.hateCount > size*1.3){
                    this.hateCount = 0;
                    i = size - 1 - Utils.random(size-1);
                    log.info("CHANGE TARGET: " + i);
                } else{
                    return 0;
                }
            }
        }
        if(sorted && sorted[i]) {
            playerId = sorted[i].id;
        }

        return playerId;
    },

    forgetPlayer: function(playerId, duration) {
        this.hatelist = _.reject(this.hatelist, function(obj) { return obj.id === playerId; });
        this.tankerlist = _.reject(this.tankerlist, function(obj) { return obj.id === playerId; });

        if(this.hatelist.length === 0 || this.tankerlist === 0) {
            this.returnToSpawningPosition(duration);
        }
    },

    forgetEveryone: function () {
        this.hatelist = [];
        this.tankerlist = [];
        this.returnToSpawningPosition(1);
    },

    drop: function (item) {
        if (item) {
            return new Messages.Drop(this, item);
        }
    },

    handleRespawn: function () {
        var self = this;

        if (this.area && this.area instanceof MobArea) {
            // Respawn inside the area if part of a MobArea
            this.area.respawnMob(this, this.spawnDelay);
        }
        else {
            if (this.area && this.area instanceof ChestArea) {
                this.area.removeFromArea(this);
            }

            setTimeout(function () {
                if (self.respawnCallback) {
                    self.respawnCallback();
                }
            }, this.spawnDelay);
        }
    },

    onRespawn: function (callback) {
        this.respawnCallback = callback;
    },

    resetPosition: function () {
        this.setPosition(this.spawningX, this.spawningY);
    },
    returnToSpawningPosition: function(waitDuration) {
        var self = this,
            delay = waitDuration || 4000;


        this.clearTarget();

        this.returnTimeout = setTimeout(function() {
            self.resetPosition();
            self.move(self.x, self.y);
        }, delay);
    },

    onMove: function (callback) {
        this.moveCallback = callback;
    },

    move: function (x, y) {
        this.setPosition(x, y);

        if (this.moveCallback)
            this.moveCallback(this);
    },

    updateHitPoints: function () {
        this.resetHitPoints(MobData.Kinds[this.kind].hp);
    },

    distanceToSpawningPoint: function (x, y) {
        return Utils.distanceTo(x, y, this.spawningX, this.spawningY);
    },

    distanceBetween: function(entityX, entityY, otherEntityX, otherEntityY) {
        return Utils.distanceTo(entityX, entityY, otherEntityX, otherEntityY);
    },

    setDrops: function () {
        this.drops = MobData.Kinds[this.kind].drops
    }
});

module.exports = Mob;
