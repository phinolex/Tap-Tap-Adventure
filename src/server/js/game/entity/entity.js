/* global module */

var cls = require("../../lib/class"),
  Messages = require("../../network/messages"),
  Mobs = require("../../util/mobs"),
  NPCs = require("../../util/npcs"),
  Items = require("../../util/items");

module.exports = Entity = cls.Class.extend({
  constructor(id, type, instance, x, y) {
    

    this.id = id;
    this.type = type;
    this.instance = instance;

    this.oldX = x;
    this.oldY = y;
    this.x = x;
    this.y = y;

    this.combat = null;

    this.dead = false;

    this.recentGroups = [];
  },

  getCombat() {
    return null;
  },

  getDistance(entity) {
    var self = this,
      x = Math.abs(this.x - entity.x),
      y = Math.abs(this.y - entity.y);

    return x > y ? x : y;
  },

  getCoordDistance(toX, toY) {
    var self = this,
      x = Math.abs(this.x - toX),
      y = Math.abs(this.y - toY);

    return x > y ? x : y;
  },

  isAdjacent(entity) {
    

    if (!entity) return false;

    return this.getDistance(entity) <= 1;
  },

  isNonDiagonal(entity) {
    return (
      this.isAdjacent(entity) && !(entity.x !== this.x && entity.y !== this.y)
    );
  },

  isNear(entity, distance) {
    var self = this,
      near = false;

    var dx = Math.abs(this.x - entity.x),
      dy = Math.abs(this.y - entity.y);

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
    

    this.x = x;
    this.y = y;

    if (this.setPositionCallback) this.setPositionCallback();
  },

  hasSpecialAttack() {
    return false;
  },

  updatePosition() {
    

    this.oldX = this.x;
    this.oldY = this.y;
  },

  onSetPosition(callback) {
    this.setPositionCallback = callback;
  },

  getState() {
    var self = this,
      string = this.isMob()
        ? Mobs.idToString(this.id)
        : this.isNPC()
        ? NPCs.idToString(this.id)
        : Items.idToString(this.id),
      name = this.isMob()
        ? Mobs.idToName(this.id)
        : this.isNPC()
        ? NPCs.idToName(this.id)
        : Items.idToName(this.id);

    return {
      type: this.type,
      id: this.instance,
      string: string,
      name: name,
      x: this.x,
      y: this.y
    };
  }
});
