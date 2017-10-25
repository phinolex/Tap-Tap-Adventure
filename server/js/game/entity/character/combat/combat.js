/* global log */

var cls = require('../../../../lib/class'),
    CombatQueue = require('./combatqueue'),
    Utils = require('../../../../util/utils'),
    Formulas = require('../../../formulas'),
    _ = require('underscore'),
    Hit = require('./hit'),
    Modules = require('../../../../util/modules'),
    Messages = require('../../../../network/messages'),
    Packets = require('../../../../network/packets');

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = Combat = cls.Class.extend({

    init: function(character) {
        var self = this;

        self.character = character;
        self.world = null;

        self.attackers = {};

        self.retaliate = false;

        self.queue = new CombatQueue();

        self.attacking = false;

        self.attackLoop = null;
        self.followLoop = null;
        self.checkLoop = null;

        self.first = false;
        self.started = false;
        self.lastAction = -1;
        self.lastHit = -1;

        self.cleanTimeout = null;
    },

    begin: function(attacker) {
        var self = this;

        self.start();
        self.character.setTarget(attacker);

        self.addAttacker(attacker);
        self.attack(attacker);
    },

    start: function() {
        var self = this;

        if (self.started)
            return;

        self.lastAction = new Date();

        self.attackLoop = setInterval(function() { self.parseAttack(); }, self.character.attackRate);

        self.followLoop = setInterval(function() { self.parseFollow(); }, 400);

        self.checkLoop = setInterval(function() {
            var time = new Date();

            if (time - self.lastAction > 5000)
                self.stop();

        }, 1000);

        self.healLoop = setInterval(function() {
            self.parseHealing();
        }, 1000);

        self.started = true;
    },

    stop: function() {
        var self = this;

        if (!self.started)
            return;

        clearInterval(self.attackLoop);
        clearInterval(self.followLoop);
        clearInterval(self.checkLoop);

        self.attackLoop = null;
        self.followLoop = null;
        self.checkLoop = null;

        self.started = false;

        self.cleanTimeout = setTimeout(function() {
            if (self.getTime() - self.lastHit > 7000 && self.isMob()) {
                self.forget();
                self.character.removeTarget();
                self.sendToSpawn();

                clearTimeout(self.cleanTimeout);
                self.cleanTimeout = null;
            }
        }, 1000);
    },

    parseAttack: function() {
        var self = this;

        if (!self.world || !self.queue)
            return;

        if (self.character.hasTarget() && self.inProximity()) {

            if (self.queue.hasQueue())
                self.hit(self.character, self.character.target, self.queue.getHit());

            if (self.character.target && !self.character.target.isDead())
                self.attack(self.character.target);

            self.lastAction = new Date();

        } else
            self.queue.clear();
    },

    parseFollow: function() {
        var self = this;

        if (self.isMob()) {
            if (!self.character.isRanged())
                self.sendFollow();

            if (!self.character.isAtSpawn() && !self.isAttacked()) {
                self.character.return();
                self.move(self.character, self.character.x, self.character.y);
            }

            if (self.onSameTile()) {
                var newPosition = self.getNewPosition();

                self.move(self.character, newPosition.x, newPosition.y);
            }

            if (self.character.hasTarget() && !self.inProximity()) {
                var attacker = self.getClosestAttacker();

                if (attacker)
                    self.follow(self.character, attacker);

            }
        }

    },

    parseHealing: function() {
        var self = this;

        if (self.character.isDead() || self.character.hasMaxHitPoints() || self.character.hasTarget() || self.isAttacked())
            return;

        if (self.isPlayer()) {
            self.character.hitPoints.heal(1);
            self.character.mana.heal(1);
        } else
            self.character.heal(1);

        self.world.pushBroadcast(new Messages.Sync({
            hitPoints: self.character.getHitPoints(),
            maxHitPoints: self.character.getMaxHitPoints(),
            mana: self.isPlayer() ? self.character.mana.getMana() : null,
            maxMana: self.isPlayer() ? self.character.mana.getMaxMana() : null
        }));
    },

    attack: function(target) {
        var self = this,
            hit;

        if (self.isPlayer())
            hit = self.character.getHitType(target);
        else
            hit = new Hit(Modules.Hits.Damage, Formulas.getDamage(self.character, target));

        if (!hit)
            return;

        self.queue.add(hit);
    },

    dealAoE: function(radius) {
        var self = this;

        if (!self.world)
            return;

        var entities = self.world.getGrids().getSurroundingEntities(self.character, radius);

        for (var i in entities) {
            if (entities.hasOwnProperty(i)) {
                var entity = entities[i];

                if (entity.type !== 'mob')
                    continue;

                var hit = new Hit(Modules.Hits.Damage, Formulas.getAoEDamage(self.character, entity)),
                    hitData = hit.getData();

                hitData.isAoE = true;

                self.hit(self.character, entity, hitData);
            }
        }
    },

    forceAttack: function() {
        var self = this;

        if (!self.character.target || !self.inProximity())
            return;

        self.stop();
        self.start();

        self.attackCount(2, self.character.target);
        self.hit(self.character, self.character.target, self.queue.getHit());
    },

    attackCount: function(count, target) {
        var self = this;

        for (var i = 0; i < count; i++)
            self.attack(new Hit(Modules.Hits.Damage, Formulas.getDamage(self.character, target)));
    },

    addAttacker: function(character) {
        var self = this;

        if (self.hasAttacker(character))
            return;

        self.attackers[character.instance] = character;
    },

    removeAttacker: function(character) {
        var self = this;

        if (self.hasAttacker(character))
            delete self.attackers[character.instance];

        self.sendToSpawn();
    },

    sendToSpawn: function() {
        var self = this;

        if (self.isMob() && Object.keys(self.attackers).length === 0) {
            self.character.return();
            self.move(self.character, self.character.spawnLocation[0], self.character.spawnLocation[1]);
        }
    },

    hasAttacker: function(character) {
        var self = this;

        if (!self.isAttacked())
            return;

        return character.instance in self.attackers;
    },

    onSameTile: function() {
        var self = this;

        if (!self.character.target || self.character.type !== 'mob')
            return;

        return self.character.x === self.character.target.x && self.character.y === self.character.target.y;
    },

    isAttacked: function() {
        return Object.keys(this.attackers).length > 0;
    },

    getNewPosition: function() {
        var self = this,
            position = {
                x: self.character.x,
                y: self.character.y
            };

        var random = Utils.randomInt(0, 3);

        if (random === 0)
            position.x++;
        else if (random === 1)
            position.y--;
        else if (random === 2)
            position.x--;
        else if (random === 3)
            position.y++;

        return position;
    },

    isRetaliating: function() {
        return Object.keys(this.attackers).length === 0 && this.retaliate;
    },

    inProximity: function() {
        var self = this;

        if (!self.character.target)
            return;

        var targetDistance = self.character.getDistance(self.character.target),
            range = self.character.attackRange;

        if (self.character.isRanged())
            return targetDistance <= range;

        return self.character.isNonDiagonal(self.character.target);
    },

    getClosestAttacker: function() {
        var self = this,
            closest = null,
            lowestDistance = 100;

        self.forEachAttacker(function(attacker) {
            var distance = self.character.getDistance(attacker);

            if (distance < lowestDistance)
                closest = attacker;
        });

        return closest;
    },

    setWorld: function(world) {
        var self = this;

        if (!self.world)
            self.world = world;
    },

    forget: function() {
        this.attackers = {};
    },

    move: function(character, x, y) {
        this.world.pushBroadcast(new Messages.Movement(Packets.MovementOpcode.Move, [character.instance, x, y, false, false]));
    },

    hit: function(character, target, hitInfo) {
        var self = this,
            time = self.getTime();

        if (time - self.lastHit < self.character.attackRate && !hitInfo.isAoE)
            return;

        if (character.isRanged() || hitInfo.isRanged) {

            var projectile = self.world.createProjectile(true, [character, target], hitInfo);

            self.world.pushToAdjacentGroups(character.group, new Messages.Projectile(Packets.ProjectileOpcode.Create, [projectile.instance, projectile.id, character.instance, target.instance, projectile.damage, character.projectileName, projectile.special]));

        } else {

            self.world.pushBroadcast(new Messages.Combat(Packets.CombatOpcode.Hit, character.instance, target.instance, hitInfo));

            self.world.handleDamage(character, target, hitInfo.damage);

        }

        self.lastHit = self.getTime();
    },

    follow: function(character, target) {
        this.world.pushBroadcast(new Messages.Movement(Packets.MovementOpcode.Follow, [character.instance, target.instance, character.isRanged(), character.attackRange]));
    },

    end: function() {
        this.world.pushBroadcast(new Messages.Combat(Packets.CombatOpcode.Finish, this.character.instance, null));
    },

    sendFollow: function() {
        var self = this;

        if (!self.character.hasTarget() || self.character.target.isDead())
            return;

        var ignores = [self.character.instance, self.character.target.instance];

        self.world.pushSelectively(new Messages.Movement(Packets.MovementOpcode.Follow, [self.character.instance, self.character.target.instance]), ignores);
    },

    forEachAttacker: function(callback) {
        _.each(this.attackers, function(attacker) {
            callback(attacker);
        });
    },
    
    getTime: function() {
        return new Date().getTime();
    },

    colliding: function(x, y) {
        return this.world.map.isColliding(x, y);
    },

    isPlayer: function() {
        return this.character.type === 'player'
    },

    isMob: function() {
        return this.character.type === 'mob';
    },

    isTargetMob: function() {
        return this.character.target.type === 'mob';
    }

});