var Container = require("../container"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets"),
  _ = require("underscore"),
  Items = require("../../../../../../util/items");

module.exports = Slot = Container.extend({
  constructor(owner, size) {
    

    this.open = false;

    this.super("Bank", owner, size);
  },

  load(ids, counts, abilities, abilityLevels) {
    

    this.super(ids, counts, abilities, abilityLevels);

    this.owner.send(
      new Messages.Bank(Packets.BankOpcode.Batch, [this.size, this.slots])
    );
  },

  add(id, count, ability, abilityLevel) {
    

    if (!this.canHold(id, count)) {
      this.owner.send(
        new Messages.Notification(
          Packets.NotificationOpcode.Text,
          "You do not have enough space in your bank."
        )
      );
      return false;
    }

    var slot = this.super(id, parseInt(count), ability, abilityLevel);

    this.owner.send(new Messages.Bank(Packets.BankOpcode.Add, slot));

    this.owner.save();
    return true;
  },

  remove(id, count, index) {
    

    if (!this.super(index, id, count)) return;

    this.owner.send(
      new Messages.Bank(Packets.BankOpcode.Remove, {
        index: parseInt(index),
        count: count
      })
    );

    this.owner.save();
  }
});
