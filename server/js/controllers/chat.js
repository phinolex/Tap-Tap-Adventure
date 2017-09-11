var cls = require('../lib/class');

module.exports = Chat = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;
    },

    onChat: function(message) {
        var self = this;

        /**
         * Check whether the message received is a command or just
         * normal input. Note, we can add filters and censors here.
         */

        if (message.startsWith('/')) {
            var inputBlocks = message.substring(1).split(' ');

            self.handlePlayerCommands(inputBlocks);

            if (self.player.rights === 1)
                self.handleModeratorCommands(inputBlocks);

            if (self.player.rights === 2)
                self.handleAdministratorCommands(inputBlocks);
        } else {
            /**
             * We want to broadcast the message to the players in surrounding groups.
             */
        }
    },

    handlePlayerCommands: function(input) {
        var self = this,
            command = input.shift();

        switch(command) {
            case 'help':
                log.info('Oh hey! I am helping right?');
                return;
        }
    },

    handleModeratorCommands: function(input) {

    },

    handleAdministratorCommands: function(input) {

    }

});