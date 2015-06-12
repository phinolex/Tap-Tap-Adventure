var Utils = require('../utils');

var cls = require("../lib/class"),
    redis = require("redis"),
    bcrypt = require("bcrypt");

module.exports = DatabaseHandler = cls.Class.extend({
    init: function(config) {
        client = redis.createClient(config.redis_port, config.redis_host, {socket_nodelay: true});
        client.auth("");
    },
    initializeProcesses: function() {
        log.info("Redis successfully initialized, nothing to report.");
    }
});
