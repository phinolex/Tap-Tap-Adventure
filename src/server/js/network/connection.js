/* global log */

var cls = require("../lib/class");

module.exports = Connection = cls.Class.extend({
  init(id, connection, server) {
    var self = this;

    self.id = id;
    self.socket = connection;
    self._server = server;
  },

  broadcast(message) {
    throw "Invalid initialization.";
  },

  send(message) {
    throw "Invalid initialization.";
  },

  sendUTF8(data) {
    throw "Invalid initialization.";
  },

  close(reason) {
    if (reason) log.info(reason);

    this.socket.conn.close();
  }
});
