/* global module, log */

var Socket = require("./socket"),
  Connection = require("./connection"),
  connect = require("connect"),
  serve = require("serve-static"),
  http = require("http"),
  SocketIO = require("socket.io"),
  Utils = require("../util/utils"),
  WebSocket = {};

module.exports = WebSocket;

WebSocket.Server = Socket.extend({
  _connections: {},
  _counter: 0,

  constructor(host, port, version) {
    

    this._super(port);

    this.host = host;
    this.version = version;

    this.ips = {};

    //Serve statically for faster development

    var app = connect();
    app.use(serve("client", {index: ["index.html"]}), null);

    this.httpServer = http
      .createServer(app)
      .listen(port, host, function serverEverythingListening() {
        log.notice("Server is now listening on: " + port);
      });

    this.io = new SocketIO(this.httpServer);
    this.io.on("connection", function webSocketListener(socket) {
      log.notice("Received connection from: " + socket.conn.remoteAddress);

      var client = new WebSocket.Connection(this.createId(), socket, self);

      socket.on("client", function(data) {
        // check the client version of socket.io matches the server version
        if (data.gVer !== this.version) {
          client.sendUTF8("updated");
          log.notice(data.gVer);
          log.notice(this.version);
          client.close("Client version is out of sync with the server.");
        }

        if (this.connectionCallback) {
          this.connectionCallback(client);
        }

        this.addConnection(client);
      });

      socket.on("u_message", function(message) {
        //Used for unity messages as Socket.IO differs

        if (client.listenCallback) client.listenCallback(message);
      });
    });
  },

  createId() {
    return "1" + Utils.random(99) + "" + this._counter++;
  },

  broadcast(message) {
    this.forEachConnection(function(connection) {
      connection.send(message);
    });
  },

  onConnect(callback) {
    this.connectionCallback = callback;
  },

  onRequestStatus(callback) {
    this.statusCallback = callback;
  }
});

WebSocket.Connection = Connection.extend({
  constructor(id, socket, server) {
    

    this._super(id, socket, server);

    this.socket.on("message", function(message) {
      if (this.listenCallback) this.listenCallback(JSON.parse(message));
    });

    this.socket.on("disconnect", function() {
      log.notice("Closed socket: " + this.socket.conn.remoteAddress);

      if (this.closeCallback) this.closeCallback();

      delete this._server.removeConnection(this.id);
    });
  },

  listen(callback) {
    this.listenCallback = callback;
  },

  onClose(callback) {
    this.closeCallback = callback;
  },

  send(message) {
    this.sendUTF8(JSON.stringify(message));
  },

  sendUTF8(data) {
    this.socket.send(data);
  }
});
