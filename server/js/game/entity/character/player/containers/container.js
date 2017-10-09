/* global log */

var cls = require('../../../../../lib/class'),
    _ = require('underscore'),
    Slot = require('./slot'),
    Items = require('../../../../../util/items'),
    Constants = require('../../../../../util/constants');

module.exports = Container = cls.Class.extend({

    /**
     * TODO: Add a limit of 2^31 - 1 for stackable items.
     */

    init: function(type, owner, size) {
        var self = this;

        self.type = type;
        self.owner = owner;
        self.size = size;

        self.slots = [];

        for (var i = 0; i < self.size; i++)
            self.slots.push(new Slot(i));
    },

    load: function(ids, counts, abilities, abilityLevels) {
        var self = this;

        /**
         * Fill each slot with manual data or the database
         */

        if (ids.length !== self.slots.length)
            log.error('[' + self.type + '] Mismatch in container size.');

        for (var i = 0; i < self.slots.length; i++)
            self.slots[i].load(ids[i], counts[i], abilities[i], abilityLevels[i]);

    },

    loadEmpty: function() {
        var self = this,
            data = [];

        /**
         * Better to have it condensed into one.
         */

        for (var i = 0; i < self.size; i++)
            data.push(-1)

        self.load(data, data, data, data);
    },

    add: function(id, count, ability, abilityLevel) {
        var self = this;

        if (!id || count < 0 || count >= Constants.MAX_STACK)
            return null;

        if (self.contains(id) && Items.isStackable(id)) {
            var sSlot = self.getSlot(id);

            sSlot.increment(count);

            return sSlot;
        } else {

            /**
             * Double checking. This should never be called without
             * checking the external (subclass) class for empty space.
             */

            if (!self.hasSpace())
                return;

            var slot = self.slots[self.getEmptySlot()];

            slot.load(id, count, ability, abilityLevel);

            return slot;
        }
    },

    remove: function(index, id, count) {
        var self = this;

        if (!id || count < 0 || !self.contains(id) || !self.slots[index] || self.slots[index].id === -1 || self.slots[index].id !== id)
            return false;

        var slot = self.slots[index];

        if (Items.isStackable(id)) {
            if (count >= slot.count)
                slot.empty();
            else
                slot.decrement(count);
        } else
            slot.empty();

        return true;
    },

    getSlot: function(id) {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].id === id)
                return self.slots[i];

        return null;
    },

    contains: function(id) {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].id === id)
                return true;

        return false;
    },

    containsSpaces: function(count) {
        var self = this,
            emptySpaces = [];

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].id === -1)
                emptySpaces.push(self.slots[i]);

        return emptySpaces.length === count;
    },

    hasSpace: function() {
        return this.getEmptySlot() > -1;
    },

    getEmptySlot: function() {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].id === -1)
                return i;

        return -1;
    },

    getIndex: function(id) {
        var self = this;

        /**
         * Used when the index is not determined,
         * returns the first item found based on the id.
         */

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].id === id)
                return i;

        return -1;
    },

    check: function() {
        var self = this;

        _.each(self.slots, function(slot) {
            if (isNaN(slot.id))
                slot.empty();
        });
    },

    getArray: function() {
        var self = this,
            ids = '',
            counts = '',
            abilities = '',
            abilityLevels = '';

        for (var i = 0; i < self.slots.length; i++) {
            ids += self.slots[i].id + ' ';
            counts += self.slots[i].count + ' ';
            abilities += self.slots[i].ability + ' ';
            abilityLevels += self.slots[i].abilityLevel + ' ';
        }

        return {
            username: self.owner.username,
            ids: ids.slice(0, -1),
            counts: counts.slice(0, -1),
            abilities: abilities.slice(0, -1),
            abilityLevels: abilityLevels.slice(0, -1)
        }
    }

});