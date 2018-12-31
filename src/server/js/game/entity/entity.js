/* global module */

var cls = require("../../lib/class"),
  Messages = require("../../network/messages"),
  Mobs = require("../../util/mobs"),
  NPCs = require("../../util/npcs"),
  Items = require("../../util/items");

module.exports = Entity = cls.Class.extend({
  init(id, type, instance, x, y) {
    var self = this;

    self.id = id;
    self.type = type;
    self.instance = instance;

    self.oldX = x;
    self.oldY = y;
    self.x = x;
    self.y = y;

    self.combat = null;

    self.dead = false;

    self.recentGroups = [];
  },

  getCombat() {
    return null;
  },

  getDistance(entity) {
    var self = this,
      x = Math.abs(self.x - entity.x),
      y = Math.abs(self.y - entity.y);

    return x > y ? x : y;
  },

  getCoordDistance(toX, toY) {
    var self = this,
      x = Math.abs(self.x - toX),
      y = Math.abs(self.y - toY);

    return x > y ? x : y;
  },

  isAdjacent(entity) {
    var self = this;

    if (!entity) return false;

    return self.getDistance(entity) <= 1;
  },

  isNonDiagonal(entity) {
    return (
      this.isAdjacent(entity) && !(entity.x !== this.x && entity.y !== this.y)
    );
  },

  isNear(entity, distance) {
    var self = this,
      near = false;

    var dx = Math.abs(self.x - entity.x),
      dy = Math.abs(self.y - entity.y);

    if (dx <= distance && dy <= distance) near = true;

    return near;
  },

  talk() {
    log.info("Who is screwing around with the client?");
  },

  drop(item) {
    return new Messages.Drop(this, item);
  },

  isPlayer() {
    return this.type === "player";
  },

  isMob() {
    return this.type === "mob";
  },

  isNPC() {
    return this.type === "npc";
  },

  isItem() {
    return this.type === "item";
  },

  setPosition(x, y) {
    var self = this;

    self.x = x;
    self.y = y;

    if (self.setPositionCallback) self.setPositionCallback();
  },

  hasSpecialAttack() {
    return false;
  },

  updatePosition() {
    var self = this;

    self.oldX = self.x;
    self.oldY = self.y;
  },

  onSetPosition(callback) {
    this.setPositionCallback = callback;
  },

  getState() {
    var self = this,
      string = self.isMob()
        ? Mobs.idToString(self.id)
        : self.isNPC()
        ? NPCs.idToString(self.id)
        : Items.idToString(self.id),
      name = self.isMob()
        ? Mobs.idToName(self.id)
        : self.isNPC()
        ? NPCs.idToName(self.id)
        : Items.idToName(self.id);

    return {
      type: self.type,
      id: self.instance,
      string: string,
      name: name,
      x: self.x,
      y: self.y
    };
  }
});
