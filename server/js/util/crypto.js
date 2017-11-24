var cls = require('../lib/class'),
    Request = require('request'),
    config = require('../../config.json');

module.exports = Crypto = cls.Class.extend({

    /**
     * This is responsible for API checking in order
     * to ensure the authenticity of the player currently mining.
     */

    init: function(world) {
        var self = this;

        self.world = world;
        self.key = config.secretKey;

        self.enabled = config.crypto;
        self.rewardThreshold = 2000;

        if (self.enabled)
            self.load();
    },

    load: function() {
        var self = this,
            parameters = {
                method: 'GET',
                uri: 'https://api.coinhive.com/stats/site?secret=' + self.key
            };

        Request(parameters, function(error, response, body) {
            if (!body)
                return;

            var data = JSON.parse(body);

            if (error)
                log.info('Could not establish connection to crypto services.');

            if (data && data.success)
                log.info('Successfully connected to CoinHive\'s crypto API.');
            else
                log.info('Crpyto services failed to authenticate.')

        })
    },

    getBalance: function(user, callback) {
        var self = this,
            parameters = {
                method: 'GET'
            };

        Request(parameters, function(error, response) {

            if (error) {
                log.error('Could not get balance for: ' + user);
                return;
            }

            log.info(response);

        });
    },

    withdraw: function(user) {
        var self = this,
            parameters = {

            }
    }

});