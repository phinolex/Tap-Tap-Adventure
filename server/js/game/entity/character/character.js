/* global module */

var Entity = require('../entity'),
    _ = require('underscore'),
    Combat = require('./combat/combat'),
    Modules = require('../../../util/modules'),
    Mobs = require('../../../util/mobs');

module.exports = Character = Entity.extend({

    init: function(id, type, instance, x, y) {
        var self = this;

        self._super(id, type, instance, x, y);

        self.level = -1;

        self.movementSpeed = 150;
        self.attackRange = 1;
        self.attackRate = 1000;

        self.spawnDistance = 7;

        self.previousX = -1;
        self.previousY = -1;

        self.hitPoints = -1;
        self.maxHitPoints = -1;

        self.dead = false;
        self.aggressive = false;
        self.aggroRange = 2;

        self.frozen = false;
        self.stunned = false;

        self.target = null;
        self.potentialTarget = null;

        self.projectile = Modules.Projectiles.Arrow;
        self.projectileName = 'projectile-pinearrow';

        self.loadCombat();
    },

    loadCombat: function() {
        var self = this;

        if (Mobs.hasCombatPlugin(self.id))
            self.combat = new (Mobs.isNewCombatPlugin(self.id))(self);
        else
            self.combat = new Combat(self);
    },

    hit: function(attacker) {
        var self = this;

        if (self.hitCallback)
            self.hitCallback(attacker);
    },

    heal: function(amount) {
        var self = this;

        self.setHitPoints(self.hitPoints + amount);

        if (self.hitPoints > self.maxHitPoints)
            self.hitPoints = self.maxHitPoints;
    },

    isRanged: function() {
        return this.attackRange > 1;
    },

    applyDamage: function(damage) {
        this.hitPoints -= damage;
    },

    isDead: function() {
        return this.hitPoints < 1 || this.dead;
    },

    getCombat: function() {
        return this.combat;
    },

    getHitPoints: function() {
        return this.hitPoints;
    },

    getMaxHitPoints: function() {
        return this.maxHitPoints;
    },

    setPosition: function(x, y) {
        var self = this;

        self._super(x, y);

        if (self.movementCallback)
            self.movementCallback(x, y);
    },

    setTarget: function(target) {
        var self = this;

        self.target = target;

        if (self.targetCallback)
            self.targetCallback(target);
    },

    setPotentialTarget: function(potentialTarget) {
        this.potentialTarget = potentialTarget;
    },

    setHitPoints: function(hitPoints) {
        var self = this;

        self.hitPoints = hitPoints;

        if (self.hitPointsCallback)
            self.hitPointsCallback();
    },

    getProjectile: function() {
        return this.projectile;
    },

    getProjectileName: function() {
        return this.projectileName;
    },

    getDrop: function() {
        return null;
    },

    hasMaxHitPoints: function() {
        return this.hitPoints >= this.maxHitPoints;
    },

    removeTarget: function() {
        var self = this;

        if (self.removeTargetCallback)
            self.removeTargetCallback();

        self.target = null;
    },

    hasTarget: function() {
        return !(this.target === null);
    },

    hasPotentialTarget: function(potentialTarget) {
        return this.potentialTarget === potentialTarget;
    },

    clearTarget: function() {
        this.target = null;
    },

    onTarget: function(callback) {
        this.targetCallback = callback;
    },

    onRemoveTarget: function(callback) {
        this.removeTargetCallback = callback;
    },

    onMovement: function(callback) {
        this.movementCallback = callback;
    },

    onHit: function(callback) {
        this.hitCallback = callback;
    },

    onHealthChange: function(callback) {
        this.hitPointsCallback = callback;
    },

    onSubAoE: function(callback) {
        this.subAoECallback = callback;
    }

});