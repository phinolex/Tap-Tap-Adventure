/* global module */

var cls = require("../lib/class"),
  _ = require("underscore");

/**
 * Abstract Class for Socket
 */

module.exports = Socket = cls.Class.extend({
  constructor(port) {
    this.port = port;
  },

  broadcast(message) {
    throw "Invalid initialization.";
  },

  forEachConnection(callback) {
    _.each(this._connections, callback);
  },

  addConnection(connection) {
    this._connections[connection.id] = connection;
  },

  removeConnection(id) {
    delete this._connections[id];
  },

  getConnection(id) {
    return this._connections[id];
  },

  onConnect(callback) {
    this.connectionCallback = callback;
  },

  onError(callback) {
    this.errorCallback = callback;
  },

  onConnectionType(callback) {
    this.connectionTypeCallback = callback;
  }
});
