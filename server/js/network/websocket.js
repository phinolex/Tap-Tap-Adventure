/* global module, log */

var Socket = require('./socket'),
    Connection = require('./connection'),
    connect = require('connect'),
    serve = require('serve-static'),
    http = require('http'),
    SocketIO = require('socket.io'),
    Utils = require('../util/utils'),
    WebSocket = {};

module.exports = WebSocket;

WebSocket.Server = Socket.extend({
    _connections: {},
    _counter: 0,

    init: function(host, port, version) {
        var self = this;

        self._super(port);

        self.host = host;
        self.version = version;

        //Serve statically for faster development

        var app = connect();
        app.use(serve('client', {'index': ['index.html']}), null);

        self.httpServer = http.createServer(app).listen(port, host, function serverEverythingListening() {
            log.notice('Server is now listening on: ' + port);
        });

        self.io = new SocketIO(self.httpServer);
        self.io.on('connection', function webSocketListener(socket) {
            log.notice('Received connection from: ' + socket.conn.remoteAddress);

            var client = new WebSocket.Connection(self.createId(), socket, self);

            socket.on('client', function(data) {
                if (data.gVer !== self.version) {
                    client.sendUTF8('updated');
                    client.close('Client version is out of sync with the server.');
                }

                if (self.connectionCallback)
                    self.connectionCallback(client);

                self.addConnection(client);
            });

            socket.on('u_message', function(message) {
                //Used for unity messages as Socket.IO differs

                if (client.listenCallback)
                    client.listenCallback(message);
            });
        });

    },

    createId: function() {
        return '1' + Utils.random(99) + '' + this._counter++;
    },

    broadcast: function(message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },

    onConnect: function(callback) {
        this.connectionCallback = callback;
    },

    onRequestStatus: function(callback) {
        this.statusCallback = callback;
    }
});

WebSocket.Connection = Connection.extend({

    init: function(id, socket, server) {
        var self = this;

        self._super(id, socket, server);

        self.socket.on('message', function(message) {
            if (self.listenCallback)
                self.listenCallback(JSON.parse(message));
        });

        self.socket.on('disconnect', function() {
            log.notice('Closed socket: ' + self.socket.conn.remoteAddress);

            if (self.closeCallback)
                self.closeCallback();

            delete self._server.removeConnection(self.id);
        });
    },

    listen: function(callback) {
        this.listenCallback = callback;
    },

    onClose: function(callback) {
        this.closeCallback = callback;
    },

    send: function(message) {
        this.sendUTF8(JSON.stringify(message));
    },

    sendUTF8: function(data) {
        this.socket.send(data);
    }

});