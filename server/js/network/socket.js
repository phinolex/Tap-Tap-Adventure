/* global module */

var cls = require('../lib/class'),
    _ = require('underscore');

/**
 * Abstract Class for Socket
 */

module.exports = Socket = cls.Class.extend({

    init: function(port) {
        this.port = port;
    },

    broadcast: function(message) {
        throw 'Invalid initialization.';
    },

    forEachConnection: function(callback) {
        _.each(this._connections, callback);
    },

    addConnection: function(connection) {
        this._connections[connection.id] = connection;
    },

    removeConnection: function(id) {
        delete this._connections[id];
    },

    getConnection: function(id) {
        return this._connections[id];
    },

    onConnect: function(callback) {
        this.connectionCallback = callback;
    },

    onError: function(callback) {
        this.errorCallback = callback;
    },

    onConnectionType: function(callback) {
        this.connectionTypeCallback = callback;
    }

});