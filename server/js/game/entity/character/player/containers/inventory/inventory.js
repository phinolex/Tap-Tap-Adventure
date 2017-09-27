/* global log */

var Container = require('../container'),
    Messages = require('../../../../../../network/messages'),
    Packets = require('../../../../../../network/packets'),
    Constants = require('./constants'),
    _ = require('underscore'),
    Items = require('../../../../../../util/items');

module.exports = Inventory = Container.extend({

    /**
     * Not particularly sure whether or not this class will
     * require an update function to push any updates
     * of the inventory to the client. This is just a baseline
     * setup for the inventory until the interface is done.
     */

    init: function(owner, size) {
        var self = this;

        self._super('Inventory', owner, size);
    },

    load: function(ids, counts, abilities, abilityLevels) {
        var self = this;

        self._super(ids, counts, abilities, abilityLevels);

        self.owner.send(new Messages.Inventory(Packets.InventoryOpcode.Batch, [self.size, self.slots]));
    },

    add: function(item) {
        var self = this;

        if (!self.hasSpace() && !(self.contains(item.id) && Items.isStackable(item.id))) {
            self.owner.send(new Messages.Notification(Packets.NotificationOpcode.Text, Constants.InventoryFull));
            return;
        }

        var slot = self._super(item.id, parseInt(item.count), item.ability, item.abilityLevel);

        if (!slot)
            return;

        self.owner.send(new Messages.Inventory(Packets.InventoryOpcode.Add, slot));

        self.owner.save();

        if (item.instance)
            self.owner.world.removeItem(item);
    },

    remove: function(id, count, index) {
        var self = this;

        if (!self._super(index, id, count))
            return;

        self.owner.send(new Messages.Inventory(Packets.InventoryOpcode.Remove, {
            index: parseInt(index),
            count: count
        }));

        self.owner.save();
    }

});