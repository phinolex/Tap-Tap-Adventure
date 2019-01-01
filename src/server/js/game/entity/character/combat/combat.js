/* global log */

var cls = require("../../../../lib/class"),
  CombatQueue = require("./combatqueue"),
  Utils = require("../../../../util/utils"),
  Formulas = require("../../../formulas"),
  _ = require("underscore"),
  Hit = require("./hit"),
  Modules = require("../../../../util/modules"),
  Messages = require("../../../../network/messages"),
  Packets = require("../../../../network/packets");

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = Combat = cls.Class.extend({
  init(character) {
    var self = this;

    this.character = character;
    this.world = null;

    this.attackers = {};

    this.retaliate = false;

    this.queue = new CombatQueue();

    this.attacking = false;

    this.attackLoop = null;
    this.followLoop = null;
    this.checkLoop = null;

    this.first = false;
    this.started = false;
    this.lastAction = -1;
    this.lastHit = -1;

    this.lastActionThreshold = 7000;

    this.cleanTimeout = null;

    this.character.onSubAoE(function(radius, hasTerror) {
      this.dealAoE(radius, hasTerror);
    });

    this.character.onDamage(function(target, hitInfo) {
      if (
        this.isPlayer() &&
        this.character.hasBreakableWeapon() &&
        Formulas.getWeaponBreak(this.character, target)
      )
        this.character.breakWeapon();

      if (hitInfo.type === Modules.Hits.Stun) {
        target.setStun(true);

        if (target.stunTimeout) clearTimeout(target.stunTimeout);

        target.stunTimeout = setTimeout(function() {
          target.setStun(false);
        }, 3000);
      }
    });
  },

  begin(attacker) {
    var self = this;

    this.start();

    this.character.setTarget(attacker);
    this.addAttacker(attacker);

    attacker.combat.addAttacker(this.character); //For mobs attacking players..

    this.attack(attacker);
  },

  start() {
    var self = this;

    if (this.started) return;

    this.lastAction = new Date().getTime();

    this.attackLoop = setInterval(function() {
      this.parseAttack();
    }, this.character.attackRate);

    this.followLoop = setInterval(function() {
      this.parseFollow();
    }, 400);

    this.checkLoop = setInterval(function() {
      if (this.getTime() - this.lastAction > this.lastActionThreshold) {
        this.stop();

        this.forget();
      }
    }, 1000);

    this.started = true;
  },

  stop() {
    var self = this;

    if (!this.started) return;

    clearInterval(this.attackLoop);
    clearInterval(this.followLoop);
    clearInterval(this.checkLoop);

    this.attackLoop = null;
    this.followLoop = null;
    this.checkLoop = null;

    this.started = false;
  },

  parseAttack() {
    var self = this;

    if (!this.world || !this.queue || this.character.stunned) return;

    if (this.character.hasTarget() && this.inProximity()) {
      if (this.queue.hasQueue())
        this.hit(this.character, this.character.target, this.queue.getHit());

      if (this.character.target && !this.character.target.isDead())
        this.attack(this.character.target);

      this.lastAction = this.getTime();
    } else this.queue.clear();
  },

  parseFollow() {
    var self = this;

    if (this.character.frozen || this.character.stunned) return;

    if (this.isMob()) {
      if (!this.character.isRanged()) this.sendFollow();

      if (this.isAttacked() || this.character.hasTarget())
        this.lastAction = this.getTime();

      if (this.onSameTile()) {
        var newPosition = this.getNewPosition();

        this.move(this.character, newPosition.x, newPosition.y);
      }

      if (this.character.hasTarget() && !this.inProximity()) {
        var attacker = this.getClosestAttacker();

        if (attacker) this.follow(this.character, attacker);
      }
    }
  },

  attack(target) {
    var self = this,
      hit;

    if (this.isPlayer()) hit = this.character.getHit(target);
    else
      hit = new Hit(
        Modules.Hits.Damage,
        Formulas.getDamage(this.character, target)
      );

    if (!hit) return;

    this.queue.add(hit);
  },

  dealAoE(radius, hasTerror) {
    var self = this;

    /**
     * TODO - Find a way to implement special effects without hardcoding them.
     */

    if (!this.world) return;

    var entities = this.world
      .getGrids()
      .getSurroundingEntities(this.character, radius);

    _.each(entities, function(entity) {
      var hitData = new Hit(
        Modules.Hits.Damage,
        Formulas.getAoEDamage(this.character, entity)
      ).getData();

      hitData.isAoE = true;
      hitData.hasTerror = hasTerror;

      this.hit(this.character, entity, hitData);
    });
  },

  forceAttack() {
    var self = this;

    if (!this.character.target || !this.inProximity()) return;

    this.stop();
    this.start();

    this.attackCount(2, this.character.target);
    this.hit(this.character, this.character.target, this.queue.getHit());
  },

  attackCount(count, target) {
    var self = this;

    for (var i = 0; i < count; i++) this.attack(target);
  },

  addAttacker(character) {
    var self = this;

    if (this.hasAttacker(character)) return;

    this.attackers[character.instance] = character;
  },

  removeAttacker(character) {
    var self = this;

    if (this.hasAttacker(character)) delete this.attackers[character.instance];

    if (!this.isAttacked()) this.sendToSpawn();
  },

  sendToSpawn() {
    var self = this;

    if (!this.isMob()) return;

    this.character.return();

    this.world.pushBroadcast(
      new Messages.Movement(Packets.MovementOpcode.Move, [
        this.character.instance,
        this.character.x,
        this.character.y,
        false,
        false
      ])
    );
  },

  hasAttacker(character) {
    var self = this;

    if (!this.isAttacked()) return;

    return character.instance in this.attackers;
  },

  onSameTile() {
    var self = this;

    if (!this.character.target || this.character.type !== "mob") return;

    return (
      this.character.x === this.character.target.x &&
      this.character.y === this.character.target.y
    );
  },

  isAttacked() {
    return this.attackers && Object.keys(this.attackers).length > 0;
  },

  getNewPosition() {
    var self = this,
      position = {
        x: this.character.x,
        y: this.character.y
      };

    var random = Utils.randomInt(0, 3);

    if (random === 0) position.x++;
    else if (random === 1) position.y--;
    else if (random === 2) position.x--;
    else if (random === 3) position.y++;

    return position;
  },

  isRetaliating() {
    return (
      this.isPlayer() &&
      !this.character.hasTarget() &&
      this.retaliate &&
      !this.character.moving &&
      new Date().getTime() - this.character.lastMovement > 1500
    );
  },

  inProximity() {
    var self = this;

    if (!this.character.target) return;

    var targetDistance = this.character.getDistance(this.character.target),
      range = this.character.attackRange;

    if (this.character.isRanged()) return targetDistance <= range;

    return this.character.isNonDiagonal(this.character.target);
  },

  getClosestAttacker() {
    var self = this,
      closest = null,
      lowestDistance = 100;

    this.forEachAttacker(function(attacker) {
      var distance = this.character.getDistance(attacker);

      if (distance < lowestDistance) closest = attacker;
    });

    return closest;
  },

  setWorld(world) {
    var self = this;

    if (!this.world) this.world = world;
  },

  forget() {
    var self = this;

    this.attackers = {};
    this.character.removeTarget();

    if (this.forgetCallback) this.forgetCallback();
  },

  move(character, x, y) {
    var self = this;

    /**
     * The server and mob types can parse the mob movement
     */

    if (character.type !== "mob") return;

    character.move(x, y);
  },

  hit(character, target, hitInfo) {
    var self = this,
      time = this.getTime();

    if (time - this.lastHit < this.character.attackRate && !hitInfo.isAoE)
      return;

    if (character.isRanged() || hitInfo.isRanged) {
      var projectile = this.world.createProjectile(
        [character, target],
        hitInfo
      );

      this.world.pushToAdjacentGroups(
        character.group,
        new Messages.Projectile(
          Packets.ProjectileOpcode.Create,
          projectile.getData()
        )
      );
    } else {
      this.world.pushBroadcast(
        new Messages.Combat(
          Packets.CombatOpcode.Hit,
          character.instance,
          target.instance,
          hitInfo
        )
      );
      this.world.handleDamage(character, target, hitInfo.damage);
    }

    if (character.damageCallback) character.damageCallback(target, hitInfo);

    this.lastHit = this.getTime();
  },

  follow(character, target) {
    this.world.pushBroadcast(
      new Messages.Movement(Packets.MovementOpcode.Follow, [
        character.instance,
        target.instance,
        character.isRanged(),
        character.attackRange
      ])
    );
  },

  end() {
    this.world.pushBroadcast(
      new Messages.Combat(
        Packets.CombatOpcode.Finish,
        this.character.instance,
        null
      )
    );
  },

  sendFollow() {
    var self = this;

    if (!this.character.hasTarget() || this.character.target.isDead()) return;

    var ignores = [this.character.instance, this.character.target.instance];

    this.world.pushSelectively(
      new Messages.Movement(Packets.MovementOpcode.Follow, [
        this.character.instance,
        this.character.target.instance
      ]),
      ignores
    );
  },

  forEachAttacker(callback) {
    _.each(this.attackers, function(attacker) {
      callback(attacker);
    });
  },

  onForget(callback) {
    this.forgetCallback = callback;
  },

  targetOutOfBounds() {
    var self = this;

    if (!this.character.hasTarget() || !this.isMob()) return;

    var spawnPoint = this.character.spawnLocation,
      target = this.character.target;

    return (
      Utils.getDistance(spawnPoint[0], spawnPoint[1], target.x, target.y) >
      this.character.spawnDistance
    );
  },

  getTime() {
    return new Date().getTime();
  },

  colliding(x, y) {
    return this.world.map.isColliding(x, y);
  },

  isPlayer() {
    return this.character.type === "player";
  },

  isMob() {
    return this.character.type === "mob";
  },

  isTargetMob() {
    return this.character.target.type === "mob";
  },

  canAttackAoE(target) {
    return (
      this.isMob() ||
      target.type === "mob" ||
      (this.isPlayer() &&
        target.type === "player" &&
        target.pvp &&
        this.character.pvp)
    );
  }
});
