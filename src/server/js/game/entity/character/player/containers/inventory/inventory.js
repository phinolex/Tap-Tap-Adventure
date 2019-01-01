/* global log */

var Container = require("../container"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets"),
  Constants = require("./constants"),
  _ = require("underscore"),
  Items = require("../../../../../../util/items");

module.exports = Inventory = Container.extend({
  /**
   * Not particularly sure whether or not this class will
   * require an update function to push any updates
   * of the inventory to the client. This is just a baseline
   * setup for the inventory until the interface is done.
   */

  constructor(owner, size) {
    

    this.super("Inventory", owner, size);
  },

  load(ids, counts, abilities, abilityLevels) {
    

    this.super(ids, counts, abilities, abilityLevels);

    this.owner.send(
      new Messages.Inventory(Packets.InventoryOpcode.Batch, [
        this.size,
        this.slots
      ])
    );
  },

  add(item, count) {
    

    if (!count) count = -1;

    if (count === -1)
      //default to moving whole stack
      count = parseInt(item.count);

    if (!this.canHold(item.id, count)) {
      this.owner.send(
        new Messages.Notification(
          Packets.NotificationOpcode.Text,
          Constants.InventoryFull
        )
      );
      return false;
    }

    var slot = this.super(item.id, count, item.ability, item.abilityLevel);

    if (!slot) return false;

    this.owner.send(new Messages.Inventory(Packets.InventoryOpcode.Add, slot));

    this.owner.save();

    if (item.instance) this.owner.world.removeItem(item);

    return true;
  },

  remove(id, count, index) {
    

    if (!index) index = this.getIndex(id);

    if (!this.super(index, id, count)) return;

    this.owner.send(
      new Messages.Inventory(Packets.InventoryOpcode.Remove, {
        index: parseInt(index),
        count: count
      })
    );

    this.owner.save();
  }
});
