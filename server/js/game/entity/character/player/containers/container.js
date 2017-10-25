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
        
        //log.info('Trying to pickup ' + count + ' x ' + id);
        var maxStackSize = Items.maxStackSize(id)  == -1 ? Constants.MAX_STACK : Items.maxStackSize(id);

            
        //log.info('Max stack size=' + maxStackSize);
            
        if (!id || count < 0 || count > maxStackSize )
            return null;
        
        if (!Items.isStackable(id)) {
            if (self.hasSpace()) {
                var slot = self.slots[self.getEmptySlot()];
                slot.load(id, count, ability, abilityLevel);
                return slot;
            } else {
                return;
            }
        } else {
            if (maxStackSize == -1 || self.type == 'Bank') {
                // This is bank or an infinite stack.  Add all items to existing slot, or find new slot.
                var sSlot = self.getSlot(id);
                if (sSlot) {
                    sSlot.increment(count);
                    return sSlot;
                } else {
                    if (self.hasSpace()) {
                        var slot = self.slots[self.getEmptySlot()];
                        slot.load(id, count, ability, abilityLevel);
                        return slot;
                    }
                }
                return;
            } else {
                // Iterate over all stacks dropping items on the stacks until we are out of items.
                var remainingItems = count;
                for (var i = 0; i < self.slots.length; i++) {
                    if (self.slots[i].id === id) {
                        sSlot = self.slots[i];
                        var available = maxStackSize - sSlot.count;
                        //log.info('Found slot[' + i + '] with ' + available + ' spaces');
                        if (available >= remainingItems) {
                            //log.info("Found slot with enough available");
                            sSlot.increment(remainingItems);
                            return sSlot; //last item dropped off
                        } else if (available > 0) {
                            //log.info("Found slot with some available");
                            sSlot.increment(available);
                            remainingItems -= available;
                        } else {
                            //log.info("Found matching slot with no available");
                        }
                    }
                }
                //log.info('Iterated over all slots, still need space (' + remainingItems + ')');
                if (remainingItems > 0 && self.hasSpace()) {
                    //log.info('Creating needed slots');
                    // All stacks full, creating new stack.
                    var slot = self.slots[self.getEmptySlot()];
                    slot.load(id, remainingItems, ability, abilityLevel);
                    return slot;
                } 
                return; //failed to drop off items.  Shouldn't reach here as canHold is called first.

            }
        }
    },

    canHold: function(id, count) {
        var self = this;

        // find slot with space for count of item type ID
        // to do pick up partial stacks
        //log.info('Checking to see if we can hold ' + count + ' x ' + id);
        if (!Items.isStackable(id)) {
            // Non-stackable items require an entire open slot
            return self.hasSpace();
        } else {
            // If it is stackable and there is an open slot then we can hold it
            if (self.hasSpace())
                return true;


            var maxStackSize = Items.maxStackSize(id);

            // if it can be an inifite stack (or we are a bank), and we have a stack, then we can hold it
            if ( (self.type == 'Bank' || maxStackSize == -1) && self.contains(id) )
                return true;

            // if its not infinite and the count is larger than max, we can't hold it.
            if (maxStackSize != -1 && count > maxStackSize)
                return false;

            // Otherwise iterate over remaining slots, if there the total space left in slots is less than the count we can hold it
            var remainingSpace = 0;
            for (var i = 0; i < self.slots.length; i++) {
                if (self.slots[i].id == id)
                    remainingSpace += (maxStackSize - self.slots[i].count);
            }

            //log.info('We can hold ' + remainingSpace + ' out of ' + count);
            return remainingSpace >= count;
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