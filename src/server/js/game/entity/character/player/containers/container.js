/* global log */

var cls = require("../../../../../lib/class"),
  _ = require("underscore"),
  Slot = require("./slot"),
  Items = require("../../../../../util/items"),
  Constants = require("../../../../../util/constants");

module.exports = Container = cls.Class.extend({
  /**
   * TODO: Add a limit of 2^31 - 1 for stackable items.
   */

  init(type, owner, size) {
    var self = this;

    this.type = type;
    this.owner = owner;
    this.size = size;

    this.slots = [];

    for (var i = 0; i < this.size; i++) this.slots.push(new Slot(i));
  },

  load(ids, counts, abilities, abilityLevels) {
    var self = this;

    /**
     * Fill each slot with manual data or the database
     */

    if (ids.length !== this.slots.length)
      log.error("[" + this.type + "] Mismatch in container size.");

    for (var i = 0; i < this.slots.length; i++)
      this.slots[i].load(ids[i], counts[i], abilities[i], abilityLevels[i]);
  },

  loadEmpty() {
    var self = this,
      data = [];

    /**
     * Better to have it condensed into one.
     */

    for (var i = 0; i < this.size; i++) data.push(-1);

    this.load(data, data, data, data);
  },

  add(id, count, ability, abilityLevel) {
    var self = this;

    //log.info('Trying to pickup ' + count + ' x ' + id);
    var maxStackSize =
      Items.maxStackSize(id) === -1
        ? Constants.MAX_STACK
        : Items.maxStackSize(id);

    //log.info('Max stack size = ' + maxStackSize);

    if (!id || count < 0 || count > maxStackSize) return null;

    if (!Items.isStackable(id)) {
      if (this.hasSpace()) {
        var nsSlot = this.slots[this.getEmptySlot()]; //non-stackable slot

        nsSlot.load(id, count, ability, abilityLevel);

        return nsSlot;
      }
    } else {
      if (maxStackSize === -1 || this.type === "Bank") {
        var sSlot = this.getSlot(id);

        if (sSlot) {
          sSlot.increment(count);
          return sSlot;
        } else {
          if (this.hasSpace()) {
            var slot = this.slots[this.getEmptySlot()];

            slot.load(id, count, ability, abilityLevel);

            return slot;
          }
        }
      } else {
        var remainingItems = count;

        for (var i = 0; i < this.slots.length; i++) {
          if (this.slots[i].id === id) {
            var rSlot = this.slots[i];

            var available = maxStackSize - rSlot.count;

            if (available >= remainingItems) {
              rSlot.increment(remainingItems);

              return rSlot;
            } else if (available > 0) {
              rSlot.increment(available);
              remainingItems -= available;
            }
          }
        }

        if (remainingItems > 0 && this.hasSpace()) {
          var rrSlot = this.slots[this.getEmptySlot()];

          rrSlot.load(id, remainingItems, ability, abilityLevel);

          return rrSlot;
        }
      }
    }
  },

  canHold(id, count) {
    var self = this;

    if (!Items.isStackable(id)) return this.hasSpace();

    if (this.hasSpace()) return true;

    var maxStackSize = Items.maxStackSize(id);

    if ((this.type === "Bank" || maxStackSize === -1) && this.contains(id))
      return true;

    if (maxStackSize !== -1 && count > maxStackSize) return false;

    var remainingSpace = 0;

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === id)
        remainingSpace += maxStackSize - this.slots[i].count;

    return remainingSpace >= count;
  },

  remove(index, id, count) {
    var self = this;

    if (
      !id ||
      count < 0 ||
      !this.contains(id) ||
      !this.slots[index] ||
      this.slots[index].id === -1 ||
      this.slots[index].id !== id
    )
      return false;

    var slot = this.slots[index];

    if (Items.isStackable(id)) {
      if (count >= slot.count) slot.empty();
      else slot.decrement(count);
    } else slot.empty();

    return true;
  },

  getSlot(id) {
    var self = this;

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === id) return this.slots[i];

    return null;
  },

  contains(id) {
    var self = this;

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === id) return true;

    return false;
  },

  containsSpaces(count) {
    var self = this,
      emptySpaces = [];

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === -1) emptySpaces.push(this.slots[i]);

    return emptySpaces.length === count;
  },

  hasSpace() {
    return this.getEmptySlot() > -1;
  },

  getEmptySlot() {
    var self = this;

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === -1) return i;

    return -1;
  },

  getIndex(id) {
    var self = this;

    /**
     * Used when the index is not determined,
     * returns the first item found based on the id.
     */

    for (var i = 0; i < this.slots.length; i++)
      if (this.slots[i].id === id) return i;

    return -1;
  },

  check() {
    var self = this;

    _.each(this.slots, function(slot) {
      if (isNaN(slot.id)) slot.empty();
    });
  },

  getArray() {
    var self = this,
      ids = "",
      counts = "",
      abilities = "",
      abilityLevels = "";

    for (var i = 0; i < this.slots.length; i++) {
      ids += this.slots[i].id + " ";
      counts += this.slots[i].count + " ";
      abilities += this.slots[i].ability + " ";
      abilityLevels += this.slots[i].abilityLevel + " ";
    }

    return {
      username: this.owner.username,
      ids: ids.slice(0, -1),
      counts: counts.slice(0, -1),
      abilities: abilities.slice(0, -1),
      abilityLevels: abilityLevels.slice(0, -1)
    };
  }
});
