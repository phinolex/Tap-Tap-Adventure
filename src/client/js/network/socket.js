/* global log */

define(["./packets", "./messages"], function(Packets, Messages) {
  return Class.extend({
    constructor(game) {
      

      this.game = game;
      this.config = this.game.app.config;
      this.connection = null;

      this.listening = false;

      this.disconnected = false;

      this.messages = new Messages(this.game.app);
    },

    connect() {
      var self = this,
        protocol = this.config.ssl ? "wss" : "ws",
        url = protocol + "://" + this.config.ip + ":" + this.config.port;

      log.info("Opening WebSocket: " + url);

      this.connection = null;

      this.connection = io(url, {
        forceNew: true,
        reconnection: false
      });

      this.connection.on("connect_error", function() {
        log.info("Failed to connect to: " + this.config.ip);

        this.listening = false;

        this.game.app.toggleLogin(false);
        this.game.app.sendError(null, "Could not connect to the game server.");
      });

      this.connection.on("connect", function() {
        this.listening = true;

        this.game.app.updateLoader("Preparing handshake...");
        this.connection.emit("client", {
          gVer: this.config.version,
          cType: "HTML5"
        });
      });

      this.connection.on("message", function(message) {
        this.receive(message);
      });

      this.connection.on("disconnect", function() {
        this.game.handleDisconnection();
      });
    },

    receive(message) {
      

      if (!this.listening) return;

      if (message.startsWith("[")) {
        var data = JSON.parse(message);

        if (data.length > 1) this.messages.handleBulkData(data);
        else this.messages.handleData(JSON.parse(message).shift());
      } else this.messages.handleUTF8(message);
    },

    send(packet, data) {
      var self = this,
        json = JSON.stringify([packet, data]);

      if (this.connection && this.connection.connected)
        this.connection.send(json);
    }
  });
});
