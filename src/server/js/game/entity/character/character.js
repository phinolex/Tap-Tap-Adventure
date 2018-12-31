/* global module */

var Entity = require("../entity"),
  _ = require("underscore"),
  Combat = require("./combat/combat"),
  Modules = require("../../../util/modules"),
  Mobs = require("../../../util/mobs");

module.exports = Character = Entity.extend({
  init(id, type, instance, x, y) {
    var self = this;

    self._super(id, type, instance, x, y);

    self.level = -1;
    self.loaded = false;

    self.movementSpeed = 150;
    self.attackRange = 1;
    self.attackRate = 1000;
    self.healingRate = 7000;

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

    self.stunTimeout = null;

    self.projectile = Modules.Projectiles.Arrow;
    self.projectileName = "projectile-pinearrow";

    self.healingInterval = null;

    self.loadCombat();
    self.startHealing();
  },

  loadCombat() {
    var self = this;

    if (Mobs.hasCombatPlugin(self.id))
      self.combat = new (Mobs.isNewCombatPlugin(self.id))(self);
    else self.combat = new Combat(self);
  },

  setStun(stun) {
    var self = this;

    self.stunned = stun;

    if (self.stunCallback) self.stunCallback(stun);
  },

  startHealing() {
    var self = this;

    self.healingInterval = setInterval(function() {
      if (
        !self.hasTarget() &&
        !self.combat.isAttacked() &&
        !self.dead &&
        self.loaded
      ) {
        self.heal(1);
      }
    }, 5000);
  },

  stopHealing() {
    var self = this;

    clearInterval(self.healingInterval);
    self.healingInterval = null;
  },

  hit(attacker) {
    var self = this;

    if (self.hitCallback) self.hitCallback(attacker);
  },

  heal(amount) {
    var self = this;

    self.setHitPoints(self.hitPoints + amount);

    if (self.hitPoints > self.maxHitPoints) self.hitPoints = self.maxHitPoints;
  },

  isRanged() {
    return this.attackRange > 1;
  },

  applyDamage(damage) {
    this.hitPoints -= damage;
  },

  isDead() {
    return this.hitPoints < 1 || this.dead;
  },

  getCombat() {
    return this.combat;
  },

  getHitPoints() {
    return this.hitPoints;
  },

  getMaxHitPoints() {
    return this.maxHitPoints;
  },

  setPosition(x, y) {
    var self = this;

    self._super(x, y);

    if (self.movementCallback) self.movementCallback(x, y);
  },

  setTarget(target) {
    var self = this;

    self.target = target;

    if (self.targetCallback) self.targetCallback(target);
  },

  setPotentialTarget(potentialTarget) {
    this.potentialTarget = potentialTarget;
  },

  setHitPoints(hitPoints) {
    var self = this;

    self.hitPoints = hitPoints;

    if (self.hitPointsCallback) self.hitPointsCallback();
  },

  getProjectile() {
    return this.projectile;
  },

  getProjectileName() {
    return this.projectileName;
  },

  getDrop() {
    return null;
  },

  hasMaxHitPoints() {
    return this.hitPoints >= this.maxHitPoints;
  },

  removeTarget() {
    var self = this;

    if (self.removeTargetCallback) self.removeTargetCallback();

    self.target = null;
  },

  hasTarget() {
    return !(this.target === null);
  },

  hasPotentialTarget(potentialTarget) {
    return this.potentialTarget === potentialTarget;
  },

  clearTarget() {
    this.target = null;
  },

  onTarget(callback) {
    this.targetCallback = callback;
  },

  onRemoveTarget(callback) {
    this.removeTargetCallback = callback;
  },

  onMovement(callback) {
    this.movementCallback = callback;
  },

  onHit(callback) {
    this.hitCallback = callback;
  },

  onHealthChange(callback) {
    this.hitPointsCallback = callback;
  },

  onDamage(callback) {
    this.damageCallback = callback;
  },

  onStunned(callback) {
    this.stunCallback = callback;
  },

  onSubAoE(callback) {
    this.subAoECallback = callback;
  }
});
