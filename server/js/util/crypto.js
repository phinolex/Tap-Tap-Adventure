var cls = require('../lib/class'),
    Request = require('request'),
    config = require('../../config.json'),
    Formulas = require('../game/formulas');

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
            if (error || !body || !response) {
                log.info('Could not establish connection to crypto services.');
                return;
            }

            var data = JSON.parse(body);

            if (data && data.success)
                log.info('Successfully connected to CoinHive\'s crypto API.');
            else
                log.info('Crpyto services failed to authenticate.')

        })
    },

    getBalance: function(user, callback) {
        var self = this,
            parameters = {
                method: 'GET',
                uri: 'https://api.coinhive.com/user/balance?secret=' + self.key + '&name=' + user
            };

        Request(parameters, function(error, response, body) {
            if (error || !response || !body) {
                log.error('Could not get balance for: ' + user);
                return;
            }

            var data = JSON.parse(body);

            if (data && data.success)
                callback(data.balance);

        });
    },

    withdraw: function(player) {
        var self = this,
            parameters = {
                method: 'POST',
                uri: 'https://api.coinhive.com/user/withdraw',
                form: {
                    secret: self.key,
                    name: player.username.toLowerCase(),
                    amount: 5000
                }
            };

        Request(parameters, function(error, response, body) {
            if (error || !response || !body) {
                log.info('Could not withdraw funds for: ' + player.username);
                return;
            }

            var data = JSON.parse(body);

            if (data && data.success) {

                var exp = Formulas.getRewardExperience(player);

                player.addExperience(exp);

                player.notify('Thank you for your contribution.');
                player.notify('You have been rewarded ' + exp + ' experience!');
            }
        });
    }

});