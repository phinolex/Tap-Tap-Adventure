var cls = require("./lib/class"),
    Pathfinder = require("./pathfinder"),
    Messages = require("./message"),
    _ = require("underscore"),
    Player = require('./player');

module.exports = MobController = cls.Class.extend({

    init: function(ws, map){
        this.worldServer = ws;
        this.map = map;
        this.pathfinder = new Pathfinder(map.width, map.height);
        this.pathingGrid = null;
        this.initPathingGrid();

    },

    initPathingGrid: function() {
        this.pathingGrid = [];
        for(var i=0; i < this.map.height; i += 1) {
            this.pathingGrid[i] = [];
            for(var j=0; j < this.map.width; j += 1) {
                this.pathingGrid[i][j] = this.map.grid[i][j];
            }
        }
        log.info("Initialized the pathing grid with static colliding cells.");
    },

    handleStep: function() {

    },

    setEntityStep: function () {
        var self = this;
        for(var mobId in this.worldServer.mobs)
        {
            var entity = this.worldServer.mobs[mobId];
            entity.onStep(function() {

            });

            entity.onRequestPath(function(x, y) {
                /*var ignored = [], // Always ignore self
                 ignoreTarget = function(target) {
                 ignored.push(target);

                 // also ignore other attackers of the target entity
                 target.forEachAttacker(function(attacker) {
                 ignored.push(attacker);
                 });
                 };*/

                /*
                 if(entity.hasTarget()) {
                 ignoreTarget(this.target);
                 } else if (this.previousTarget) {
                 // If repositioning before attacking again, ignore previous target
                 // See: tryMovingToADifferentTile()
                 ignoreTarget(this.previousTarget);
                 }*/
                //log.info("self.findPath(entity, x, y)="+this+","+x+","+y);
                if (this.x == x && this.y == y)
                    return null;
                //if (this.target)
                //	    ignore = [this.target];
                var path = self.findPath(this, x, y);
                //log.info("path="+JSON.stringify(path));
                //if (path == [])
                //	    this.target = null;
                /*if (path)
                 {
                 pos = path[path.length-1];
                 setTimeout(function () {
                 self.worldServer.pushBroadcast(new Messages.Move2(mob.id, pos[0], pos[1]));
                 }, (path.length-1) * this.moveSpeed);
                 }*/
                return path;
            });

            entity.onStopPathing(function(x, y) {


            });
        }
    },

    checkAggro: function() {

        for(var mobId in this.worldServer.mobs)
        {
            var mob = this.worldServer.mobs[mobId];
            if (!mob || mob.isDead || !(mob.isAggressive === true) || mob.isStunned)
                continue;

            for(var playerId in this.worldServer.players)
            {
                var player = this.worldServer.players[playerId];
                if (!player.isDead && player.isNear(mob, mob.aggroRange) && !mob.hasTarget())
                {
                    if (mob.level * 2 > player.level) {
                        //log.info("Aggroed by " + mob.id + " at ("+player.x+", "+player.y+")");
                        player.server.handleMobHate(mob.id, player.id, 5);
                        this.createAttackLink(mob, player);
                        //mob.engage(player);
                    }
                }
            }

        }

    },

    checkHit: function() {
        var time = new Date().getTime();

        for(var mobId in this.worldServer.mobs)
        {
            var mob = this.worldServer.mobs[mobId];
            if (!mob || mob.isDead || mob.isStunned)
                continue;

            if (mob.target && mob.canAttack(time) && mob.canReach(mob.target) ) {
                if (mob.path)
                    mob.path = null;
                mob.target.packetHandler.handleHurt(mob);
            }
        }
    },


    checkPetHit: function() {
        var time = new Date().getTime();

        for(var petId in this.worldServer.pets)
        {
            var pet = this.worldServer.pets[petId];
            var player = self.worldServer.getEntityById(pet.playerId);
            if (!player || player.isDead)
                continue;
            if (player.target) {
                pet.setTarget(player.target);
            }
            if (player && pet.target && !pet.target.isDead &&
                pet.canAttack(time) && pet.isNear(pet.target,2) && !(pet.target instanceof Player))
            {
                //log.info("PET HIT");
                //log.info("pet x:"+pet.x+",y:"+pet.y);
                //log.info("mob x:"+pet.target.x+",y:"+pet.target.y);
                player.packetHandler.handleHitEntity(pet, [0,pet.target.id]);
            }
        }
    },

    checkMove: function() {
        var time = new Date().getTime();
        for(var mobId in this.worldServer.mobs)
        {
            var mob = this.worldServer.mobs[mobId];
            if (mob.isDead)
                continue;
            if (mob.target && !mob.canReach(mob.target) && mob.canMove(time))
            {
                mob.follow(mob.target);
                if (!mob.path)
                {
                    mob.target = null;
                }
                if (mob.path)
                {
                    mob.nextStep();
                    this.worldServer.handleEntityGroupMembership(mob);
                }

            }
            if (!mob.target)
                mob.returnToSpawningPosition(1);

        }
    },

    /*
     checkMovePet: function() {
     //var time = new Date().getTime();
     var self = this;
     for(var petId in this.worldServer.pets)
     {
     var pet = this.worldServer.pets[petId];
     var player = this.worldServer.getEntityById(pet.playerId);
     if (!player || player.isDead || pet.isDead)
     continue;

     var target;
     if (player.target && !player.target.isDead)
     {
     //log.info("follow target");
     target = player.target;
     }
     else
     {
     //log.info("follow player");
     //log.info(player.x + "," + player.y);
     //log.info(pet.x + "," + pet.y);
     target = player;
     }
     pet.follow(target);
     while (pet.isMoving())
     {
     pet.nextStep();
     //if (!pet.isMoving())
     //this.worldServer.pushBroadcast(new Messages.Move(pet));
     }
     }
     },
     */

    createAttackLink: function(attacker, target) {
        if(attacker.hasTarget()) {
            attacker.removeTarget();
        }
        attacker.engage(target);

        if(!target.isAttackedBy(attacker)) {
            target.addAttacker(attacker);
        }

    },

    findPath: function(character, x, y, ignoreList) {
        var self = this,
            grid = this.pathingGrid,
            path = [];
        //isPlayer = (character === this.player);

        if(this.map.isColliding(x, y)) {
            return path;
        }

        if(this.pathfinder && character) {
            if(ignoreList) {
                _.each(ignoreList, function(entity) {
                    self.pathfinder.ignoreEntity(entity);
                });
            }

            path = this.pathfinder.findPath(grid, character, x, y, false);

            if(ignoreList) {
                this.pathfinder.clearIgnoreList();
            }
        } else {
            log.error("Error while finding the path to "+x+", "+y+" for "+character.id);
        }
        //log.info("path="+JSON.stringify(path));
        return path;
    },
});
