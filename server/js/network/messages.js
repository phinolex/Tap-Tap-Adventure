var cls = require('../lib/class'),
    Packets = require('./packets'),
    Messages = {},
    Message = cls.Class.extend({ });

module.exports = Messages;

Messages.Handshake = Message.extend({

    init: function(clientId, devClient) {
        this.clientId = clientId;
        this.devClient = devClient;
    },

    serialize: function() {
        return [Packets.Handshake, [this.clientId, this.devClient]];
    }
});

Messages.Welcome = Message.extend({

    init: function(data) {
        this.data = data; //array of info
    },

    serialize: function() {
        return [Packets.Welcome, this.data];
    }
});

Messages.Spawn = Message.extend({

    init: function(entity) {
        this.entity = entity;
    },

    serialize: function() {
        return [Packets.Spawn, this.entity.getState()];
    }
});

Messages.List = Message.extend({

    init: function(list) {
        this.list = list;
    },

    serialize: function() {
        return [Packets.List, this.list];
    }
});

Messages.Sync = Message.extend({

    init: function(data) {
        this.data = data;
    },

    serialize: function() {
        return [Packets.Sync, this.data];
    }

});

Messages.Equipment = Message.extend({

    init: function(opcode, equipmentData) {
        this.opcode = opcode;
        this.equipmentData = equipmentData;
    },

    serialize: function() {
        return [Packets.Equipment, this.opcode, this.equipmentData];
    }

});

Messages.Movement = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Movement, [this.opcode, this.data]];
    }
});

Messages.Teleport = Message.extend({

    init: function(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    },

    serialize: function() {
        return [Packets.Teleport, [this.id, this.x, this.y]];
    }

});

Messages.Despawn = Message.extend({

    init: function(id) {
        this.id = id;
    },

    serialize: function() {
        return [Packets.Despawn, this.id];
    }

});

Messages.Animation = Message.extend({

    init: function(id, data) {
        this.id = id;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Animation, this.id, this.data];
    }

});

Messages.Combat = Message.extend({

    init: function(opcode, attackerId, targetId, hitData) {
        this.opcode = opcode;
        this.attackerId = attackerId;
        this.targetId = targetId;
        this.hitData = hitData;
    },

    serialize: function() {
        return [Packets.Combat, [this.opcode, this.attackerId, this.targetId, this.hitData]];
    }

});

Messages.Projectile = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Projectile, this.opcode, this.data];
    }

});

Messages.Population = Message.extend({

    init: function(playerCount) {
        this.playerCount = playerCount
    },

    serialize: function() {
        return [Packets.Population, this.playerCount];
    }

});

Messages.Points = Message.extend({

    init: function(id, hitPoints, mana) {
        this.id = id;
        this.hitPoints = hitPoints;
        this.mana = mana;
    },

    serialize: function() {
        return [Packets.Points, [this.id, this.hitPoints, this.mana]];
    }

});

Messages.Network = Message.extend({

    init: function(opcode) {
        this.opcode = opcode;
    },

    serialize: function() {
        return [Packets.Network, this.opcode];
    }
});

Messages.Chat = Message.extend({

    init: function(data) {
        this.data = data;
    },

    serialize: function() {
        return [Packets.Chat, this.data];
    }

});

/**
 * Should we just have a packet that represents containers
 * as a whole or just send it separately for each?
 */

Messages.Inventory = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Inventory, this.opcode, this.data];
    }

});

Messages.Bank = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Bank, this.opcode, this.data];
    }

});

Messages.Ability = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Ability, this.opcode, this.data];
    }

});

Messages.Quest = Message.extend({

    init: function(opcode, data) {
        this.opcode = opcode;
        this.data = data;
    },

    serialize: function() {
        return [Packets.Quest, this.opcode, this.data];
    }

});

Messages.Notification = Message.extend({

    init: function(opcode, message) {
        this.opcode = opcode;
        this.message = message;
    },

    serialize: function() {
        return [Packets.Notification, this.opcode, this.message];
    }

});

Messages.Blink = Message.extend({

    init: function(instance) {
        this.instance = instance;
    },

    serialize: function () {
        return [Packets.Blink, this.instance];
    }

});

Messages.Heal = Message.extend({

    init: function(info) {
        this.info = info;
    },

    serialize: function() {
        return [Packets.Heal, this.info];
    }

});

Messages.Experience = Message.extend({

    init: function(info) {
        this.info = info;
    },

    serialize: function() {
        return [Packets.Experience, this.info];
    }

});

Messages.Death = Message.extend({

    init: function(id) {
        this.id = id;
    },

    serialize: function() {
        return [Packets.Death, this.id];
    }

});

Messages.Audio = Message.extend({

    init: function(song) {
        this.song = song;
    },

    serialize: function() {
        return [Packets.Audio, this.song];
    }

});

Messages.NPC = Message.extend({

    init: function(opcode, info) {
        this.opcode = opcode;
        this.info = info;
    },

    serialize: function() {
        return [Packets.NPC, this.opcode, this.info];
    }

});

Messages.Respawn = Message.extend({

    init: function(instance, x, y) {
        this.instance = instance;
        this.x = x;
        this.y = y;
    },

    serialize: function() {
        return [Packets.Respawn, this.instance, this.x, this.y];
    }

});

Messages.Enchant = Message.extend({

    init: function(opcode, info) {
        this.opcode = opcode;
        this.info = info;
    },

    serialize: function() {
        return [Packets.Enchant, this.opcode, this.info];
    }

});

Messages.Guild = Message.extend({

    init: function(opcode, info) {
        this.opcode = opcode;
        this.info = info;
    },

    serialize: function() {
        return [Packets.Enchant, this.opcode, this.info];
    }

});

Messages.Pointer = Message.extend({

    init: function(opcode, info) {
        this.opcode = opcode;
        this.info = info;
    },

    serialize: function() {
        return [Packets.Pointer, this.opcode, this.info];
    }

});

Messages.PVP = Message.extend({

    init: function(id, pvp) {
        this.id = id;
        this.pvp = pvp;
    },

    serialize: function() {
        return [Packets.PVP, this.id, this.pvp];
    }

});